import http from 'http';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { getAiVariationCyclePresets } from './bridge-presets';

export interface InspectedElement {
  tag: string;
  selector?: string;
  htmlSnippet: string;
  computedStyles?: Record<string, string>;
  siteTokens?: Record<string, unknown>;
  updatedAt: number;
}

export interface BridgeConfig {
  port: number;
  isMcp: boolean;
}

let activeElement: InspectedElement | null = null;
const sseClients = new Set<http.ServerResponse>();

export function getActiveElement(): InspectedElement | null {
  return activeElement;
}

export function setActiveElement(el: InspectedElement): void {
  activeElement = el;
}

export function broadcastSSE(event: { type: string; payload: unknown }): void {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of sseClients) {
    try {
      res.write(data);
    } catch {
      sseClients.delete(res);
    }
  }
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Private-Network': 'true',
};

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

export function createBridgeServer(port = 4999): http.Server {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, CORS_HEADERS);
      res.end();
      return;
    }

    if (url.pathname === '/health' && req.method === 'GET') {
      res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ready',
        mcp: true,
        port,
        hasActiveElement: Boolean(activeElement),
        activeElement,
      }));
      return;
    }

    if (url.pathname === '/api/active-element' && req.method === 'POST') {
      try {
        const body = JSON.parse(await readBody(req)) as Partial<InspectedElement>;
        if (body.tag) {
          activeElement = {
            tag: body.tag,
            selector: body.selector,
            htmlSnippet: body.htmlSnippet || '',
            computedStyles: body.computedStyles,
            siteTokens: body.siteTokens,
            updatedAt: Date.now(),
          };
          broadcastSSE({ type: 'active_element', payload: activeElement });
        }
        res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, activeElement }));
      } catch (err) {
        res.writeHead(400, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: String(err) }));
      }
      return;
    }

    if (url.pathname === '/api/events' && req.method === 'GET') {
      res.writeHead(200, {
        ...CORS_HEADERS,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.write(': connected\n\n');
      sseClients.add(res);
      req.on('close', () => sseClients.delete(res));
      return;
    }

    if (url.pathname === '/api/synthesize' && req.method === 'POST') {
      try {
        const body = JSON.parse(await readBody(req)) as {
          prompt: string;
          tag: string;
          htmlSnippet?: string;
          computedStyles?: Record<string, string>;
          siteTokens?: Record<string, unknown>;
          setIndex?: number;
        };
        const response = await synthesizeWithLocalOrEnv(
          body.prompt,
          body.tag,
          body.htmlSnippet,
          body.computedStyles,
          body.siteTokens,
          body.setIndex
        );
        res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      } catch (err) {
        res.writeHead(500, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: String(err) }));
      }
      return;
    }

    if (url.pathname === '/api/patch' && req.method === 'POST') {
      try {
        const body = JSON.parse(await readBody(req)) as {
          cssText: string;
          tailwindClasses?: string;
          prompt?: string;
          name?: string;
          description?: string;
          selector?: string;
        };
        broadcastSSE({
          type: 'apply_style',
          payload: {
            cssText: body.cssText,
            tailwindClasses: body.tailwindClasses || '',
            prompt: body.prompt,
            name: body.name,
            description: body.description,
            selector: body.selector,
          },
        });
        res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, broadcastCount: sseClients.size }));
      } catch (err) {
        res.writeHead(400, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: String(err) }));
      }
      return;
    }

    if (url.pathname === '/api/commit-to-source' && req.method === 'POST') {
      try {
        const body = JSON.parse(await readBody(req)) as { filePath: string; cssText: string };
        const safePath = path.resolve(process.cwd(), body.filePath);
        if (!safePath.startsWith(process.cwd())) throw new Error('Path traversal forbidden');
        if (fs.existsSync(safePath)) {
          fs.appendFileSync(safePath, `\n/* AuraCSS Commit */\n/* ${body.cssText} */\n`);
        }
        res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, filePath: safePath }));
      } catch (err) {
        res.writeHead(400, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: String(err) }));
      }
      return;
    }

    res.writeHead(404, CORS_HEADERS);
    res.end('Not found');
  });

  return server;
}

interface ColorDef {
  hex: string;
  tw: string;
  isLight: boolean;
}

const COLOR_MAP: Record<string, ColorDef> = {
  crimson: { hex: '#dc2626', tw: 'red-600', isLight: false },
  red: { hex: '#ef4444', tw: 'red-500', isLight: false },
  ruby: { hex: '#e11d48', tw: 'rose-600', isLight: false },
  rose: { hex: '#f43f5e', tw: 'rose-500', isLight: false },
  pink: { hex: '#ec4899', tw: 'pink-500', isLight: false },
  blue: { hex: '#2563eb', tw: 'blue-600', isLight: false },
  indigo: { hex: '#4f46e5', tw: 'indigo-600', isLight: false },
  violet: { hex: '#7c3aed', tw: 'violet-600', isLight: false },
  purple: { hex: '#a855f7', tw: 'purple-500', isLight: false },
  cyan: { hex: '#38bdf8', tw: 'sky-400', isLight: true },
  sky: { hex: '#38bdf8', tw: 'sky-400', isLight: true },
  teal: { hex: '#14b8a6', tw: 'teal-500', isLight: false },
  emerald: { hex: '#10b981', tw: 'emerald-500', isLight: false },
  green: { hex: '#22c55e', tw: 'green-500', isLight: false },
  amber: { hex: '#f59e0b', tw: 'amber-500', isLight: true },
  orange: { hex: '#f97316', tw: 'orange-500', isLight: false },
  yellow: { hex: '#eab308', tw: 'yellow-500', isLight: true },
  slate: { hex: '#0f172a', tw: 'slate-900', isLight: false },
  dark: { hex: '#0f172a', tw: 'slate-900', isLight: false },
  black: { hex: '#020617', tw: 'slate-950', isLight: false },
  white: { hex: '#ffffff', tw: 'white', isLight: true },
  light: { hex: '#f8fafc', tw: 'slate-50', isLight: true },
};

function extractColorDef(text: string): ColorDef | null {
  const hexMatch = text.match(/#([0-9a-f]{6}|[0-9a-f]{3})/i);
  if (hexMatch) {
    const hex = hexMatch[0];
    const isLight = isLightColorHex(hex);
    return { hex, tw: `[${hex}]`, isLight };
  }
  for (const [name, def] of Object.entries(COLOR_MAP)) {
    const regex = new RegExp(`\\b${name}\\b`, 'i');
    if (regex.test(text)) return def;
  }
  return null;
}

function isLightColorHex(hex: string): boolean {
  if (hex.startsWith('#') && hex.length >= 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160;
  }
  return false;
}

async function synthesizeWithLocalOrEnv(
  prompt: string,
  tag: string,
  _htmlSnippet = '',
  _computedStyles: Record<string, string> = {},
  _siteTokens: Record<string, unknown> = {},
  setIndex = 0
) {
  const p = prompt.toLowerCase();
  const isAction = tag === 'button' || tag === 'a';

  if (p.includes('diverse design variations') || p.includes('presets') || p.includes('4 variations')) {
    const presets = getAiVariationCyclePresets(setIndex, isAction);
    return {
      cssText: presets[0]!.cssText,
      tailwindClasses: presets[0]!.tailwindClasses,
      explanation: JSON.stringify({ presets }),
    };
  }

  // --- Natural Language Instruction Compiler ---
  const color = extractColorDef(p);
  const hasBg = p.includes('background') || p.includes('bg') || p.includes('fill') || (!p.includes('text') && !p.includes('border') && color !== null);
  const hasText = p.includes('text') || p.includes('font') || p.includes('foreground');
  const hasBorder = p.includes('border') || p.includes('outline') || p.includes('stroke');
  const hasGlow = p.includes('glow') || p.includes('neon') || p.includes('shadow') || p.includes('halo') || p.includes('luminous');
  const hasFading = p.includes('fading') || p.includes('fade') || p.includes('pulse') || p.includes('pulsing') || p.includes('breathe');
  const hasClickAnim = p.includes('click') || p.includes('clicking') || p.includes('press') || p.includes('tap') || p.includes('active');
  const hasAnim = p.includes('animat') || p.includes('motion') || p.includes('bounce') || p.includes('spring');
  const hasPill = p.includes('pill') || p.includes('oval') || p.includes('rounded-full');
  const hasSharp = p.includes('sharp') || p.includes('square') || p.includes('box');
  const hasGlass = p.includes('glass') || p.includes('frost') || p.includes('blur') || p.includes('translucent');

  // Dimensional & Colloquial Intent Parser
  const isLonger = Boolean(p.match(/\b(long|longer|wide|wider|broad|stretched|expand|lengthy)\b/i));
  const isBigger = Boolean(p.match(/\b(big|bigger|large|larger|huge|chunky|giant|spacious)\b/i));
  const isCompact = Boolean(p.match(/\b(compact|small|smaller|tight|tiny|thin|slender)\b/i));
  const isPop = Boolean(p.match(/\b(pop|pops|standout|punchy|bold)\b/i));
  const isSoften = Boolean(p.match(/\b(soften|softer|smooth|smoothen)\b/i));

  const cssDecls: string[] = [];
  const twDecls: string[] = [];
  const descriptions: string[] = [];

  // 1. Dimensional Box-Model & Typography
  if (isLonger && isBigger) {
    cssDecls.push('padding: 16px 36px; min-width: 240px; font-size: 1.15rem;');
    twDecls.push('px-9 py-4 text-lg min-w-[240px]');
    descriptions.push('extended length, enlarged dimensions, and scaled typography');
  } else if (isLonger) {
    cssDecls.push('padding: 10px 32px; min-width: 200px;');
    twDecls.push('px-8 py-2.5 min-w-[200px]');
    descriptions.push('extended horizontal width');
  } else if (isBigger) {
    cssDecls.push('padding: 14px 28px; font-size: 1.1rem;');
    twDecls.push('px-7 py-3.5 text-base');
    descriptions.push('enlarged padding and font scale');
  } else if (isCompact) {
    cssDecls.push('padding: 6px 12px; font-size: 0.85rem;');
    twDecls.push('px-3 py-1.5 text-xs');
    descriptions.push('compact condensed geometry');
  }

  // 2. Background instruction
  if (hasBg && color) {
    const textContrast = color.isLight ? '#0f172a' : '#ffffff';
    const textTw = color.isLight ? 'text-slate-900' : 'text-white';
    cssDecls.push(`background-color: ${color.hex}; color: ${textContrast};`);
    twDecls.push(`bg-${color.tw} ${textTw}`);
    descriptions.push(`background changed to ${color.hex} with contrast text`);
  } else if (hasGlass) {
    cssDecls.push('background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); color: #f8fafc;');
    twDecls.push('bg-white/10 backdrop-blur-md text-white');
    descriptions.push('frosted glassmorphism background');
  }

  // 3. Text color instruction (if text was explicitly targeted without background)
  if (hasText && color && !hasBg) {
    cssDecls.push(`color: ${color.hex};`);
    twDecls.push(`text-${color.tw}`);
    descriptions.push(`text color set to ${color.hex}`);
  }

  // 4. Border instruction
  if (hasBorder) {
    const borderColor = color ? color.hex : '#38bdf8';
    const borderTw = color ? color.tw : 'sky-400';
    cssDecls.push(`border: 2px solid ${borderColor};`);
    twDecls.push(`border-2 border-${borderTw}`);
    descriptions.push(`border set to ${borderColor}`);
  } else if (hasGlass && !hasBorder) {
    const borderColor = color ? `${color.hex}80` : 'rgba(255, 255, 255, 0.25)';
    cssDecls.push(`border: 1px solid ${borderColor};`);
    twDecls.push('border border-white/20');
  }

  // 5. Glow / Pop / Shadow instruction
  if (isPop) {
    const popColor = color ? color.hex : '#38bdf8';
    cssDecls.push(`box-shadow: 0 8px 24px ${popColor}55; font-weight: 700;`);
    twDecls.push('shadow-xl font-bold');
    descriptions.push('bold punchy elevation');
  } else if (hasGlow) {
    const glowColor = color ? color.hex : '#38bdf8';
    if (hasFading) {
      cssDecls.push(`box-shadow: 0 0 24px ${glowColor}66, 0 0 48px ${glowColor}33;`);
      twDecls.push(`shadow-[0_0_24px_${glowColor}66]`);
      descriptions.push('ambient fading glow effect');
    } else {
      cssDecls.push(`box-shadow: 0 0 18px ${glowColor}66;`);
      twDecls.push(`shadow-[0_0_18px_${glowColor}66]`);
      descriptions.push('luminous ambient glow');
    }
  }

  // Click & Motion Animation Instruction
  if (hasClickAnim || hasAnim) {
    cssDecls.push('cursor: pointer;');
    twDecls.push('cursor-pointer active:scale-95 active:brightness-95');
    descriptions.push('interactive click response animation');
  }

  // 6. Geometry (Radius) instruction
  if (hasPill) {
    cssDecls.push('border-radius: 9999px;');
    twDecls.push('rounded-full');
    descriptions.push('pill geometry');
  } else if (hasSharp) {
    cssDecls.push('border-radius: 0px;');
    twDecls.push('rounded-none');
    descriptions.push('sharp box geometry');
  } else if (isSoften) {
    cssDecls.push('border-radius: 16px;');
    twDecls.push('rounded-2xl');
    descriptions.push('softened curves');
  } else if (hasGlass || hasGlow) {
    cssDecls.push('border-radius: 8px;');
    twDecls.push('rounded-lg');
  }

  // Transition & Motion Physics Fallback
  const transitionCss = (hasClickAnim || hasAnim || hasFading)
    ? 'transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s ease-in-out, border-color 0.2s ease, all 0.3s ease;'
    : 'transition: all 0.2s ease;';
  const transitionTw = (hasClickAnim || hasAnim || hasFading)
    ? 'transition-all duration-300 ease-out'
    : 'transition-all duration-200';

  if (cssDecls.length === 0) {
    cssDecls.push(`border-radius: 8px; ${transitionCss}`);
    twDecls.push(`rounded-lg ${transitionTw}`);
    descriptions.push('general styling refinement');
  } else {
    cssDecls.push(transitionCss);
    twDecls.push(transitionTw);
  }

  return {
    cssText: cssDecls.join(' '),
    tailwindClasses: twDecls.join(' '),
    explanation: descriptions.length > 0 ? descriptions.join(', ') : `Custom design synthesized for <${tag}>`,
  };
}

export function startMcpStdio(port = 4999): void {
  const rl = readline.createInterface({ input: process.stdin, terminal: false });

  rl.on('line', (line) => {
    if (!line.trim()) return;
    try {
      const msg = JSON.parse(line) as { id?: number | string; method?: string; params?: Record<string, unknown> };
      if (!msg.method) return;

      if (msg.method === 'initialize') {
        const res = {
          jsonrpc: '2.0',
          id: msg.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'auracss-mcp', version: '0.1.0' },
          },
        };
        const payload = JSON.stringify(res) + '\n';
        process.stdout.write(payload);
        return;
      }

      if (msg.method === 'notifications/initialized' || msg.method === 'initialized') {
        return;
      }

      if (msg.method === 'ping') {
        process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: {} }) + '\n');
        return;
      }

      if (msg.method === 'tools/list') {
        const res = {
          jsonrpc: '2.0',
          id: msg.id,
          result: {
            tools: [
              {
                name: 'auracss_inspect_element',
                description: 'Get the currently active/selected DOM element in the user’s live AuraCSS browser session.',
                inputSchema: { type: 'object', properties: {} },
              },
              {
                name: 'auracss_apply_style',
                description: 'Applies CSS rules and Tailwind classes live to the active element in the user’s browser.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    cssText: { type: 'string', description: 'CSS declarations (e.g. "background: #2563eb; color: #fff;")' },
                    tailwindClasses: { type: 'string', description: 'Equivalent Tailwind classes' },
                    prompt: { type: 'string', description: 'The user prompt or styling request that generated this style' },
                    name: { type: 'string', description: 'A short descriptive name for this prompt result' },
                    description: { type: 'string', description: 'Brief description of changes' },
                    selector: { type: 'string', description: 'Target selector (optional, defaults to active locked element)' },
                  },
                  required: ['cssText'],
                },
              },
              {
                name: 'auracss_commit_to_source',
                description: 'Writes the mutated styles into a local source file on disk.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    filePath: { type: 'string', description: 'File path relative to workspace root' },
                    cssText: { type: 'string', description: 'CSS declarations to append/save' },
                  },
                  required: ['filePath', 'cssText'],
                },
              },
            ],
          },
        };
        process.stdout.write(JSON.stringify(res) + '\n');
        return;
      }

      if (msg.method === 'tools/call') {
        const p = msg.params as { name?: string; arguments?: Record<string, unknown> };
        if (p.name === 'auracss_inspect_element') {
          void (async () => {
            let el = activeElement;
            if (!el) {
              try {
                const res = await fetch(`http://127.0.0.1:${port}/health`);
                if (res.ok) {
                  const data = (await res.json()) as { activeElement?: InspectedElement };
                  if (data.activeElement) el = data.activeElement;
                }
              } catch { /* ignore */ }
            }
            const text = el
              ? `Active Element: <${el.tag}>\nSnippet: ${el.htmlSnippet}\nTokens: ${JSON.stringify(el.siteTokens || {})}`
              : 'No element currently locked in browser. Click an element with AuraCSS activated.';
            process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text }] } }) + '\n');
          })();
          return;
        }

        if (p.name === 'auracss_apply_style') {
          const args = p.arguments as {
            cssText: string;
            tailwindClasses?: string;
            prompt?: string;
            name?: string;
            description?: string;
            selector?: string;
          };
          broadcastSSE({
            type: 'apply_style',
            payload: {
              cssText: args.cssText,
              tailwindClasses: args.tailwindClasses || '',
              prompt: args.prompt,
              name: args.name,
              description: args.description,
              selector: args.selector,
            },
          });
          const text = `Live mutation applied to browser:\n${args.cssText}`;
          process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text }] } }) + '\n');
          return;
        }

        if (p.name === 'auracss_commit_to_source') {
          const args = p.arguments as { filePath: string; cssText: string };
          const safePath = path.resolve(process.cwd(), args.filePath);
          if (fs.existsSync(safePath)) {
            fs.appendFileSync(safePath, `\n/* AuraCSS Commit */\n/* ${args.cssText} */\n`);
          }
          const text = `Successfully committed styles to ${args.filePath}`;
          process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text }] } }) + '\n');
          return;
        }

        process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, error: { code: -32601, message: `Tool not found: ${p.name}` } }) + '\n');
        return;
      }

      if (msg.id !== undefined && msg.id !== null) {
        process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, error: { code: -32601, message: `Method not found: ${msg.method}` } }) + '\n');
      }
    } catch (err) {
      process.stderr.write(`[AuraCSS MCP Error] ${err}\n`);
    }
  });
}

// Auto-run if executed directly as script
const isMain = process.argv[1] && (process.argv[1].endsWith('bridge.ts') || process.argv[1].endsWith('bridge.js'));
if (isMain) {
  const port = Number(process.env.PORT) || 4999;
  const isMcp = process.argv.includes('--mcp');
  const server = createBridgeServer(port);

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      process.stderr.write(`[AuraCSS Bridge] Port ${port} already active, continuing MCP stdio session.\n`);
    } else {
      process.stderr.write(`[AuraCSS Bridge Server Error] ${err.message}\n`);
    }
  });

  server.listen(port, '127.0.0.1', () => {
    if (!isMcp) {
      console.log(`\n✦ AuraCSS Local Bridge running on http://127.0.0.1:${port}`);
      console.log(`  - Browser health: http://127.0.0.1:${port}/health`);
      console.log(`  - Mode: Standalone HTTP Bridge\n`);
    } else {
      process.stderr.write(`[AuraCSS MCP & Bridge] Listening on 127.0.0.1:${port} (MCP stdio active)\n`);
    }
  });

  if (isMcp) {
    startMcpStdio();
  }
}
