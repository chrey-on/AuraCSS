import http from 'http';
import fs from 'fs';
import path from 'path';
import type { InspectedElement, ElementContextSnapshot, BridgePayload } from './bridge-types';
import { synthesizeWithLocalOrEnv } from './bridge-compiler';
import { synthesizeWithGemini } from './bridge-gemini';
import { startMcpStdio } from './bridge-mcp';

try {
  if (typeof process.loadEnvFile === 'function') process.loadEnvFile();
} catch {}

export type { InspectedElement, BridgeConfig } from './bridge-types';
export { startMcpStdio } from './bridge-mcp';

let activeElement: InspectedElement | null = null;
const sseClients = new Set<http.ServerResponse>();

export function getActiveElement(): InspectedElement | null {
  return activeElement;
}

export function setActiveElement(el: InspectedElement | null): void {
  activeElement = el;
}

export function broadcastSSE(event: { type: string; payload: unknown }): void {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of sseClients) {
    try { res.write(data); } catch { sseClients.delete(res); }
  }
}

export function gracefulShutdown(server: http.Server, callback?: () => void): void {
  for (const res of sseClients) try { res.end(); } catch {}
  sseClients.clear();
  server.close(callback);
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Private-Network': 'true',
};

const sendJson = (res: http.ServerResponse, code: number, data: unknown): void => {
  res.writeHead(code, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

export function getWorkspaceRoot(): string {
  const env = process.env.AURACSS_WORKSPACE_ROOT;
  if (env && fs.existsSync(env)) return env;
  if (fs.existsSync(path.resolve(process.cwd(), 'package.json'))) return process.cwd();
  const scriptDir = typeof __dirname !== 'undefined' ? __dirname : path.dirname(process.argv[1] || '');
  const parentDir = path.resolve(scriptDir, '..');
  return fs.existsSync(path.resolve(parentDir, 'package.json')) ? parentDir : process.cwd();
}

function isValidLocalHost(host?: string): boolean {
  if (!host) return false;
  const h = host.toLowerCase().split(':')[0];
  return h === '127.0.0.1' || h === 'localhost' || h === '[::1]';
}

const MAX_PAYLOAD_BYTES = 1024 * 1024; // 1MB payload ceiling
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '', bytes = 0;
    req.on('data', (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_PAYLOAD_BYTES) {
        req.destroy();
        reject(new Error('Payload Too Large: exceeded 1MB limit'));
      } else {
        body += chunk;
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

export function createBridgeServer(port = 4999): http.Server {
  const server = http.createServer(async (req, res) => {
    if (!isValidLocalHost(req.headers.host)) {
      sendJson(res, 403, { error: 'Forbidden: Invalid Host header (DNS rebinding rejected)' });
      return;
    }
    const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, CORS_HEADERS);
      res.end();
      return;
    }

    if (url.pathname === '/health' && req.method === 'GET') {
      sendJson(res, 200, {
        status: 'ready',
        mcp: true,
        port,
        hasActiveElement: Boolean(activeElement),
        activeElement,
        hasGemini: Boolean(process.env.GEMINI_API_KEY),
      });
      return;
    }

    if (url.pathname === '/api/active-element' && req.method === 'POST') {
      try {
        const body = JSON.parse(await readBody(req)) as (Partial<InspectedElement> & { clear?: boolean }) | null;
        if (body?.tag && !body.clear) {
          activeElement = {
            tag: body.tag,
            selector: body.selector,
            htmlSnippet: body.htmlSnippet || '',
            innerText: body.innerText,
            computedStyles: body.computedStyles,
            siteTokens: body.siteTokens,
            parentLayout: body.parentLayout,
            currentMutations: body.currentMutations,
            updatedAt: Date.now(),
          };
        } else {
          activeElement = null;
        }
        broadcastSSE({ type: 'active_element', payload: activeElement });
        sendJson(res, 200, { success: true, activeElement });
      } catch (err) {
        sendJson(res, 400, { error: String(err) });
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
        const body = JSON.parse(await readBody(req)) as ElementContextSnapshot;
        const geminiKey = process.env.GEMINI_API_KEY;
        let response = (geminiKey && body.setIndex === undefined) ? await synthesizeWithGemini(body, geminiKey) : null;
        if (!response) {
          response = await synthesizeWithLocalOrEnv(
            body.prompt,
            body.tag,
            body.htmlSnippet,
            body.computedStyles,
            body.siteTokens,
            body.setIndex
          );
        }
        sendJson(res, 200, response);
      } catch (err) {
        sendJson(res, 500, { error: String(err) });
      }
      return;
    }

    if (url.pathname === '/api/patch' && req.method === 'POST') {
      try {
        if (!activeElement) {
          sendJson(res, 400, {
            success: false,
            reminder: '⚠️ Cannot apply styles: AuraCSS is turned OFF or no element is currently selected in your browser. Please toggle AuraCSS to ON and click an element to select it first.',
          });
          return;
        }
        const body = JSON.parse(await readBody(req)) as Partial<BridgePayload>;
        broadcastSSE({
          type: 'apply_style',
          payload: {
            cssText: body.cssText || '',
            mode: body.mode || 'replace',
            activeState: body.activeState,
            hoverState: body.hoverState,
            keyframes: body.keyframes,
            interaction: body.interaction,
            tailwindClasses: body.tailwindClasses || '',
            prompt: body.prompt,
            name: body.name,
            description: body.description,
            selector: body.selector,
          },
        });
        sendJson(res, 200, { success: true, broadcastCount: sseClients.size });
      } catch (err) {
        sendJson(res, 400, { error: String(err) });
      }
      return;
    }

    if (url.pathname === '/api/download' && req.method === 'GET') {
      try {
        const root = getWorkspaceRoot();
        const safePath = path.resolve(root, 'auracss-mutations.css');
        const cssText = url.searchParams.get('css') || (fs.existsSync(safePath) ? fs.readFileSync(safePath, 'utf8') : '/* AuraCSS */\n');
        res.writeHead(200, {
          ...CORS_HEADERS,
          'Content-Type': 'text/css; charset=utf-8',
          'Content-Disposition': 'attachment; filename="auracss-mutations.css"',
        });
        res.end(cssText);
      } catch (err) {
        sendJson(res, 500, { error: String(err) });
      }
      return;
    }

    if (url.pathname === '/api/mutations' && req.method === 'GET') {
      try {
        const root = getWorkspaceRoot();
        const safePath = path.resolve(root, 'auracss-mutations.css');
        const cssText = fs.existsSync(safePath) ? fs.readFileSync(safePath, 'utf8') : '';
        sendJson(res, 200, { success: true, cssText, filePath: safePath });
      } catch (err) {
        sendJson(res, 500, { error: String(err) });
      }
      return;
    }

    if (url.pathname === '/api/commit-to-source' && req.method === 'POST') {
      try {
        const body = JSON.parse(await readBody(req)) as { filePath: string; cssText: string };
        const root = getWorkspaceRoot();
        const safePath = path.resolve(root, body.filePath || 'auracss-mutations.css');
        const rel = path.relative(root, safePath);
        if (rel.startsWith('..') || path.isAbsolute(rel)) {
          throw new Error('Path traversal forbidden: target must reside within workspace');
        }
        if (!safePath.toLowerCase().endsWith('.css')) {
          throw new Error('Security policy violation: only .css files may be committed to source');
        }
        if (/(^|[/\\])\./.test(rel) || rel.includes('node_modules')) {
          throw new Error('Security policy violation: hidden or system directory modification forbidden');
        }
        fs.mkdirSync(path.dirname(safePath), { recursive: true });
        const header = `/* === AuraCSS Mutated Styles (${new Date().toISOString()}) === */\n`;
        fs.writeFileSync(safePath, `${header}${body.cssText}\n`);
        sendJson(res, 200, { success: true, filePath: safePath });
      } catch (err) {
        sendJson(res, 400, { error: String(err) });
      }
      return;
    }
  });

  return server;
}

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
      console.log(`  - Gemini AI Engine: ${process.env.GEMINI_API_KEY ? 'Active (Gemini 2.0 Flash)' : 'Offline (Local Rule Compiler)'}`);
      console.log(`  - Mode: Standalone HTTP Bridge\n`);
    } else {
      process.stderr.write(`[AuraCSS MCP & Bridge] Listening on 127.0.0.1:${port} (MCP stdio active)\n`);
    }
  });

  if (isMcp) {
    startMcpStdio(port, getActiveElement, broadcastSSE, getWorkspaceRoot);
  }

  const shutdown = () => gracefulShutdown(server, () => process.exit(0));
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
