import readline from 'readline';
import fs from 'fs';
import path from 'path';
import type { InspectedElement, BridgePayload } from './bridge-types';
import { resolveSafeCssPath } from './bridge-security';
import { sanitizeCssText } from './style-mutator';

export function formatMcpClientName(raw?: string): string {
  if (!raw || typeof raw !== 'string') return '';
  const lower = raw.toLowerCase();
  if (lower.includes('antigravity')) return 'Antigravity';
  if (lower.includes('cursor')) return 'Cursor';
  if (lower.includes('claude')) return 'Claude';
  if (lower.includes('windsurf')) return 'Windsurf';
  if (lower.includes('vscode') || lower.includes('copilot')) return 'VS Code';
  return raw.trim().slice(0, 32);
}

export function startMcpStdio(
  port: number,
  getActiveElement: () => InspectedElement | null,
  broadcastSSE: (event: { type: string; payload: unknown }) => void,
  getWorkspaceRoot = (): string => process.cwd(),
  onClientConnected?: (clientName: string) => void
): readline.Interface {
  const rl = readline.createInterface({ input: process.stdin, terminal: false });

  const shutdown = () => { rl.close(); process.exit(0); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  rl.on('line', (line) => {
    if (!line.trim()) return;
    try {
      const msg = JSON.parse(line) as { id?: number | string; method?: string; params?: Record<string, unknown> };
      if (!msg.method) return;

      if (msg.method === 'initialize') {
        const info = msg.params?.clientInfo as { name?: string } | undefined;
        const clientName = formatMcpClientName(info?.name);
        if (clientName) {
          onClientConnected?.(clientName);
          void fetch(`http://127.0.0.1:${port}/api/mcp-client`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientName }),
          }).catch(() => {});
        }
        const res = {
          jsonrpc: '2.0',
          id: msg.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {} },
            serverInfo: { name: 'auracss-mcp', version: '0.1.0' },
          },
        };
        process.stdout.write(JSON.stringify(res) + '\n');
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
                description: 'Get the currently active/selected DOM element in the user’s live AuraCSS browser session, including prior mutations and last prompt.',
                inputSchema: { type: 'object', properties: {} },
              },
              {
                name: 'auracss_apply_style',
                description: 'Applies CSS rules and Tailwind classes live to the active element in the user’s browser. Supports mode (replace vs patch), interactive pseudo-classes (:active, :hover), keyframe animations, and click behavior toggles.',
                inputSchema: {
                  type: 'object',
                  properties: {
                    cssText: { type: 'string', description: 'Base CSS declarations (e.g. "background: #2563eb; color: #fff; padding: 12px 24px;")' },
                    mode: {
                      type: 'string',
                      enum: ['replace', 'patch'],
                      description: 'Set "replace" (default) to clear previous experiment styles and style from baseline HTML. Set "patch" only when incrementally updating specific existing properties.',
                    },
                    activeState: {
                      type: 'string',
                      description: 'CSS declarations for :active pseudo-class (e.g. "transform: translateY(-8px) scale(1.06);")',
                    },
                    hoverState: {
                      type: 'string',
                      description: 'CSS declarations for :hover pseudo-class (e.g. "box-shadow: 0 0 24px rgba(56, 189, 248, 0.6);")',
                    },
                    keyframes: {
                      type: 'string',
                      description: 'Complete @keyframes block for breathing/pulsing ambient glows (e.g. "@keyframes glow { 0%,100% { box-shadow: ... } 50% { box-shadow: ... } }")',
                    },
                    interaction: {
                      type: 'object',
                      description: 'Interactive click behavior (e.g. click-to-toggle visibility)',
                      properties: {
                        type: { type: 'string', enum: ['toggle-visibility', 'toggle-class'], description: 'Type of click interaction' },
                        className: { type: 'string', description: 'Class name to toggle if type is toggle-class' },
                      },
                    },
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
                    cssText: { type: 'string', description: 'CSS declarations to save' },
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
            let el = getActiveElement();
            if (!el) {
              try {
                const res = await fetch(`http://127.0.0.1:${port}/health`);
                if (res.ok) {
                  const data = (await res.json()) as { activeElement?: InspectedElement };
                  if (data.activeElement) el = data.activeElement;
                }
              } catch { /* ignore */ }
            }
            let text = el
              ? [
                  `Active Element: <${el.tag}> (${el.role || 'element'})`,
                  `Selector: ${el.selector || el.tag}`,
                  el.innerText ? `Visible Text: "${el.innerText}"` : null,
                  el.rect ? `Size: ${el.rect.width}x${el.rect.height}px` : null,
                  el.parentLayout ? `Parent Layout: ${el.parentLayout}` : null,
                  el.childSummary ? `Contents: ${el.childSummary}` : null,
                  el.effectiveBackground
                    ? `Surface Background: ${el.effectiveBackground.color} (${el.effectiveBackground.isDark ? 'dark surface' : 'light surface'})`
                    : null,
                  el.computedStyles ? `Current Computed Styles: ${JSON.stringify(el.computedStyles)}` : null,
                  `Site Tokens: ${JSON.stringify(el.siteTokens || {})}`,
                  `HTML Snippet: ${el.htmlSnippet}`,
                ]
                  .filter(Boolean)
                  .join('\n')
              : '⚠️ AuraCSS is turned OFF or no element is currently selected in your browser. Please toggle AuraCSS to ON and click an element to select it first.';
            if (el?.currentMutations) {
              text += `\nPrior Applied Mutations:\n- Last Prompt: "${el.currentMutations.lastPrompt || 'None'}"\n- Current CSS: ${el.currentMutations.appliedCssText || 'None'}`;
            }
            process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text }] } }) + '\n');
          })();
          return;
        }

        if (p.name === 'auracss_apply_style') {
          void (async () => {
            let activeEl = getActiveElement();
            if (!activeEl) {
              try {
                const res = await fetch(`http://127.0.0.1:${port}/health`);
                if (res.ok) {
                  const data = (await res.json()) as { activeElement?: InspectedElement };
                  if (data.activeElement) activeEl = data.activeElement;
                }
              } catch { /* ignore */ }
            }

            if (!activeEl) {
              const reminder = '⚠️ Cannot apply styles: AuraCSS is turned OFF or no element is currently selected in your browser.\n\nPlease toggle AuraCSS to ON and click an element to select it first.';
              process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text: reminder }] } }) + '\n');
              return;
            }

            const args = p.arguments as Partial<BridgePayload>;
            const mode = args.mode || 'replace';
            const payload: BridgePayload = {
              cssText: args.cssText || '',
              mode,
              activeState: args.activeState,
              hoverState: args.hoverState,
              keyframes: args.keyframes,
              interaction: args.interaction,
              tailwindClasses: args.tailwindClasses || '',
              prompt: args.prompt,
              name: args.name,
              description: args.description,
              selector: args.selector || activeEl.selector,
            };

            broadcastSSE({ type: 'apply_style', payload });
            try {
              await fetch(`http://127.0.0.1:${port}/api/patch`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
            } catch { /* ignore */ }

            const text = `Live mutation applied to browser (mode: ${mode}):\n${args.cssText}${args.activeState ? `\n:active { ${args.activeState} }` : ''}${args.keyframes ? '\n[Keyframes attached]' : ''}${args.interaction ? `\n[Interaction: ${args.interaction.type}]` : ''}`;
            process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text }] } }) + '\n');
          })();
          return;
        }

        if (p.name === 'auracss_commit_to_source') {
          try {
            const args = p.arguments as { filePath: string; cssText: string };
            const root = getWorkspaceRoot();
            const safePath = resolveSafeCssPath(root, args.filePath || 'auracss-mutations.css');
            const safeCss = sanitizeCssText(args.cssText || '');
            fs.mkdirSync(path.dirname(safePath), { recursive: true });
            const header = `/* === AuraCSS Mutated Styles (${new Date().toISOString()}) === */\n`;
            fs.writeFileSync(safePath, `${header}${safeCss}\n`);
            const text = `Successfully committed styles to ${safePath}`;
            process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text }] } }) + '\n');
          } catch (err) {
            process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, error: { code: -32602, message: String(err) } }) + '\n');
          }
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
  return rl;
}
