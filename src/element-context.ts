import { parseColor, calculateLuminance } from './harvester';

export interface ElementVisualContext {
  tag: string;
  role: string;
  htmlSnippet: string;
  innerText: string;
  rect: { width: number; height: number };
  computedStyles: Record<string, string>;
  parentLayout: string;
  effectiveBackground: { color: string; isDark: boolean };
  childSummary: string;
}

const ALWAYS_INCLUDE_STYLES = new Set([
  'display', 'color', 'backgroundColor', 'fontSize', 'fontWeight', 'padding', 'borderRadius',
]);

const OPTIONAL_STYLES = [
  'fontFamily', 'lineHeight', 'letterSpacing', 'margin', 'border', 'boxShadow', 'opacity', 'width', 'height', 'gap',
] as const;

const SKIP_DEFAULTS = new Set(['none', 'normal', 'auto', '0px', 'rgba(0, 0, 0, 0)', 'transparent']);

function inferElementRole(el: HTMLElement, cs: CSSStyleDeclaration | null): string {
  const explicitRole = el.getAttribute('role');
  if (explicitRole) return explicitRole;

  const tag = el.tagName.toLowerCase();
  if (tag === 'button' || (tag === 'input' && ['button', 'submit', 'reset'].includes((el as HTMLInputElement).type))) {
    return 'interactive button';
  }
  if (tag === 'a') return 'navigation link';
  if (/^h[1-6]$/.test(tag)) return `heading (${tag})`;
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return 'form input';
  if (tag === 'img' || tag === 'svg') return 'visual media';
  if (tag === 'nav' || tag === 'header' || tag === 'footer') return `${tag} landmark`;
  if (cs?.cursor === 'pointer') return 'clickable control';
  if (el.children.length >= 2) return 'card / container';
  return 'text / block element';
}

function cleanHtmlSnippet(html: string): string {
  const stripped = html
    .replace(/\s+data-[a-z0-9-]+="[^"]*"/gi, '')
    .replace(/data:image\/[^"'\s)]+/gi, 'data:image/...')
    .replace(/(<path\b[^>]*\bd=")[^"]{40,}(")/gi, '$1...$2')
    .replace(/\s+/g, ' ')
    .trim();
  return stripped.length > 400 ? `${stripped.slice(0, 397)}...` : stripped;
}

function summarizeChildren(el: HTMLElement): string {
  if (el.children.length === 0) return 'text-only';
  const counts = new Map<string, number>();
  for (let i = 0; i < Math.min(el.children.length, 40); i++) {
    const t = el.children[i]!.tagName.toLowerCase();
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([t, n]) => `${n} <${t}>`)
    .join(', ');
}

function detectEffectiveBackground(el: HTMLElement): { color: string; isDark: boolean } {
  let curr: HTMLElement | null = el;
  while (curr && typeof getComputedStyle === 'function') {
    const bg = getComputedStyle(curr).backgroundColor;
    const parsed = parseColor(bg);
    if (parsed && parsed.a > 0.15) {
      return { color: bg, isDark: calculateLuminance(parsed) < 0.35 };
    }
    curr = curr.parentElement;
  }
  return { color: 'rgb(255, 255, 255)', isDark: false };
}

function describeParentLayout(el: HTMLElement): string {
  const parent = el.parentElement;
  if (!parent || typeof getComputedStyle !== 'function') return 'root / normal flow';
  const pcs = getComputedStyle(parent);
  const pTag = parent.tagName.toLowerCase();
  const siblings = Math.max(0, parent.children.length - 1);
  const parts = [`<${pTag}>`, `display: ${pcs.display || 'block'}`];
  if (pcs.display?.includes('flex')) {
    parts.push(`direction: ${pcs.flexDirection || 'row'}`, `justify: ${pcs.justifyContent || 'normal'}`, `align: ${pcs.alignItems || 'normal'}`);
  } else if (pcs.display?.includes('grid')) {
    parts.push(`columns: ${pcs.gridTemplateColumns || 'auto'}`);
  }
  if (pcs.gap && pcs.gap !== 'normal' && pcs.gap !== '0px') parts.push(`gap: ${pcs.gap}`);
  parts.push(`siblings: ${siblings}`);
  return parts.join(', ');
}

export function collectElementContext(el: HTMLElement): ElementVisualContext {
  const cs = typeof getComputedStyle === 'function' ? getComputedStyle(el) : null;
  const computedStyles: Record<string, string> = {};

  if (cs) {
    for (const prop of ALWAYS_INCLUDE_STYLES) {
      const val = cs[prop as keyof CSSStyleDeclaration] as string;
      if (val) computedStyles[prop] = val;
    }
    for (const prop of OPTIONAL_STYLES) {
      const val = cs[prop as keyof CSSStyleDeclaration] as string;
      if (val && !SKIP_DEFAULTS.has(val)) computedStyles[prop] = val;
    }
  } else {
    if (el.style.color) computedStyles.color = el.style.color;
    if (el.style.backgroundColor) computedStyles.backgroundColor = el.style.backgroundColor;
  }

  let rawRect = { width: 0, height: 0 };
  try {
    if (typeof el.getBoundingClientRect === 'function') rawRect = el.getBoundingClientRect();
  } catch { /* ignore detached/SVG rect errors */ }
  const rawText = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();

  return {
    tag: el.tagName.toLowerCase(),
    role: inferElementRole(el, cs),
    htmlSnippet: cleanHtmlSnippet(el.outerHTML || ''),
    innerText: rawText.length > 140 ? `${rawText.slice(0, 137)}...` : rawText,
    rect: { width: Math.round(rawRect.width), height: Math.round(rawRect.height) },
    computedStyles,
    parentLayout: describeParentLayout(el),
    effectiveBackground: detectEffectiveBackground(el),
    childSummary: summarizeChildren(el),
  };
}
