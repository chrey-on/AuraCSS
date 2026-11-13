import type { TypographyUpdate } from './types';
import { parseColor, calculateLuminance } from './harvester';

export function computeSwatchMutation(hex: string, prevTw = ''): { textColor: string; tailwind: string } {
  const parsed = parseColor(hex);
  const lum = parsed ? calculateLuminance(parsed) : 0;
  const isLight = lum > 0.4;
  const textColor = isLight ? '#0f172a' : '#ffffff';

  const filteredTw = prevTw
    .split(/\s+/)
    .filter((cls) => cls && !cls.startsWith('bg-') && !cls.startsWith('text-'))
    .join(' ')
    .trim();

  const tailwind = filteredTw
    ? `${filteredTw} bg-[${hex}] text-[${textColor}]`
    : `bg-[${hex}] text-[${textColor}]`;

  return { textColor, tailwind };
}

export function computeTypographyTailwind(prevTw: string, update: TypographyUpdate): string {
  let filteredTw = prevTw;
  if (update.property === 'color') {
    filteredTw = prevTw.split(/\s+/).filter((c) => c && !c.startsWith('text-')).join(' ');
  } else if (update.property === 'font-size') {
    filteredTw = prevTw
      .split(/\s+/)
      .filter((c) => c && !c.startsWith('text-xs') && !c.startsWith('text-sm') && !c.startsWith('text-base') && !c.startsWith('text-lg') && !c.startsWith('text-xl') && !c.startsWith('text-2xl'))
      .join(' ');
  } else if (update.property === 'font-family') {
    filteredTw = prevTw
      .split(/\s+/)
      .filter((c) => c && !c.startsWith('font-sans') && !c.startsWith('font-mono') && !c.startsWith('font-serif') && !c.startsWith('font-display'))
      .join(' ');
  } else if (update.property === 'font-weight') {
    filteredTw = prevTw
      .split(/\s+/)
      .filter((c) => c && !c.startsWith('font-normal') && !c.startsWith('font-medium') && !c.startsWith('font-semibold') && !c.startsWith('font-bold') && !c.startsWith('font-extrabold'))
      .join(' ');
  } else if (update.property === 'letter-spacing') {
    filteredTw = prevTw.split(/\s+/).filter((c) => c && !c.startsWith('tracking-')).join(' ');
  } else if (update.property === 'line-height') {
    filteredTw = prevTw.split(/\s+/).filter((c) => c && !c.startsWith('leading-')).join(' ');
  } else if (update.property === 'text-align') {
    filteredTw = prevTw.split(/\s+/).filter((c) => c && !['text-left', 'text-center', 'text-right', 'text-justify'].includes(c)).join(' ');
  } else if (update.property === 'text-decoration') {
    filteredTw = prevTw.split(/\s+/).filter((c) => c && !['underline', 'line-through', 'no-underline'].includes(c)).join(' ');
  }

  return filteredTw ? `${filteredTw.trim()} ${update.tailwind}`.trim() : update.tailwind;
}

export interface LiveRulePayload {
  keyframes?: string;
  hoverState?: string;
  activeState?: string;
}

export function injectLiveRules(selector: string, p: LiveRulePayload): void {
  if (typeof document === 'undefined') return;
  let styleEl = document.getElementById('auracss-live-rules') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'auracss-live-rules';
    document.head.appendChild(styleEl);
  }
  let rules = '';
  if (p.keyframes) {
    rules += `\n${p.keyframes}\n`;
  }
  if (p.hoverState) {
    rules += `\n${selector}:hover { ${p.hoverState} }\n`;
  }
  if (p.activeState) {
    const activeCss = p.activeState
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (s.includes('!important') ? s : `${s} !important`))
      .join('; ');
    rules += `\n${selector}:active { ${activeCss}; }\n`;
  }
  styleEl.textContent = rules;
}
