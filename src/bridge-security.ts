import fs from 'fs';
import path from 'path';

export function isValidLocalHost(host?: string): boolean {
  if (!host) return false;
  const h = host.toLowerCase().split(':')[0];
  return h === '127.0.0.1' || h === 'localhost' || h === '[::1]';
}

export function isAllowedOrigin(origin?: string): boolean {
  if (!origin) return true; // Non-browser / direct loopback / service worker fetch without Origin
  try {
    if (origin.startsWith('chrome-extension://') || origin.startsWith('moz-extension://')) {
      return /^[\w-]+:\/\/[a-z0-9_-]+$/i.test(origin);
    }
    const parsed = new URL(origin);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    const h = parsed.hostname.toLowerCase();
    return h === '127.0.0.1' || h === 'localhost' || h === '[::1]' || h === '::1';
  } catch {
    return false;
  }
}

export function getCorsHeaders(origin?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Private-Network': 'true',
    Vary: 'Origin',
  };
  if (origin && isAllowedOrigin(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function resolveRealAncestor(targetPath: string): string {
  let curr = path.dirname(targetPath);
  const tail: string[] = [path.basename(targetPath)];
  while (!fs.existsSync(curr)) {
    const parent = path.dirname(curr);
    if (parent === curr) break;
    tail.unshift(path.basename(curr));
    curr = parent;
  }
  const realBase = fs.existsSync(curr) ? fs.realpathSync(curr) : curr;
  return path.join(realBase, ...tail);
}

export function resolveSafeCssPath(root: string, filePath: string): string {
  const realRoot = fs.existsSync(root) ? fs.realpathSync(root) : path.resolve(root);
  const candidate = path.resolve(realRoot, filePath || 'auracss-mutations.css');
  const rel = path.relative(realRoot, candidate);
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error('Path traversal forbidden: target must reside within workspace');
  }
  if (!candidate.toLowerCase().endsWith('.css')) {
    throw new Error('Security policy violation: only .css files may be committed to source');
  }
  if (/(^|[/\\])\./.test(rel) || rel.split(/[/\\]/).includes('node_modules')) {
    throw new Error('Security policy violation: hidden or system directory modification forbidden');
  }
  const realCandidate = resolveRealAncestor(candidate);
  const realRel = path.relative(realRoot, realCandidate);
  if (!realRel || realRel.startsWith('..') || path.isAbsolute(realRel)) {
    throw new Error('Path traversal forbidden: symlink escape detected');
  }
  return candidate;
}

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxPerMin = 60): boolean {
  const now = Date.now();
  const entry = rateBuckets.get(key);
  if (!entry || now > entry.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= maxPerMin) return false;
  entry.count += 1;
  return true;
}
