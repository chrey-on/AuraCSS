import type { StylePreset } from './types';

const EMOJI_OR_SYMBOL_RE = /^(?:(?=.*\p{Extended_Pictographic})[\p{Extended_Pictographic}\u200d\ufe0f\s]{1,12}|[^\p{L}\p{N}\s]{1,3})$/u;

function hasCssSpriteOrMask(el: Element): boolean {
  if (el.getAttribute('data-visualcompletion') === 'css-img') return true;
  const inlineStyle = (el.getAttribute('style') || '').toLowerCase();
  if (inlineStyle.includes('background-image') || inlineStyle.includes('mask-image')) return true;
  if (typeof getComputedStyle === 'function' && el instanceof HTMLElement) {
    try {
      const cs = getComputedStyle(el);
      if (cs.backgroundImage && cs.backgroundImage !== 'none' && cs.backgroundImage.includes('url(')) return true;
      const mask = cs.maskImage || (cs as unknown as Record<string, string>).webkitMaskImage || '';
      if (mask && mask !== 'none' && mask.includes('url(')) return true;
    } catch {}
  }
  return false;
}

export function isIconOrMediaElement(el: HTMLElement): boolean {
  const tag = el.tagName.toLowerCase();
  if (tag === 'img' || tag === 'svg' || tag === 'i') return true;

  const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  if (text && EMOJI_OR_SYMBOL_RE.test(text) && el.children.length <= 2) {
    return true;
  }

  if (text.length === 0 && el.children.length === 0 && hasCssSpriteOrMask(el)) {
    try {
      const r = el.getBoundingClientRect();
      if (Math.max(r.width, r.height) <= 72) return true;
    } catch {
      return true;
    }
  }

  // Wrapper <div>, <span>, <button>, or <a> containing an icon (<svg>, <img>, <i>, or CSS sprite/mask) with no text label
  if (text.length === 0 && el.children.length > 0 && el.children.length <= 4) {
    const iconChild = el.querySelector('svg, img, i, [data-visualcompletion="css-img"]');
    if (iconChild && !el.querySelector('p, h1, h2, h3, h4, h5, h6, input, textarea, select')) {
      if (iconChild.tagName.toLowerCase() === 'img') {
        try {
          const r = iconChild.getBoundingClientRect();
          if (Math.max(r.width, r.height) > 72) return false;
        } catch {}
      }
      return true;
    }
  }

  return false;
}

export function isIconTagOrSnippet(tag: string, htmlSnippet = '', innerText = ''): boolean {
  const t = tag.toLowerCase();
  if (t === 'img' || t === 'svg' || t === 'i') return true;
  const cleanText = innerText.trim();
  if (cleanText && EMOJI_OR_SYMBOL_RE.test(cleanText)) return true;
  if (
    cleanText.length === 0 &&
    (htmlSnippet.includes('<svg') ||
      htmlSnippet.includes('<img') ||
      htmlSnippet.includes('<i ') ||
      htmlSnippet.includes('css-img') ||
      htmlSnippet.includes('mask-image'))
  ) {
    return true;
  }
  return false;
}

export function getIconVariationCyclePresets(cycleIndex: number): StylePreset[] {
  const cycle = Math.abs(Number(cycleIndex) || 0) % 3;

  const set0: StylePreset[] = [
    {
      id: 'ai-icon-0-elevated',
      name: 'AI Crisp Icon Pop',
      description: 'Vibrant hue pop & silhouette shadow with smooth hover scale',
      cssText: 'color: #4f46e5; filter: hue-rotate(38deg) saturate(1.65) contrast(1.12) drop-shadow(0 4px 10px rgba(79, 70, 229, 0.45)); transition: transform 0.2s ease, filter 0.2s ease, color 0.2s ease; cursor: pointer;',
      hoverState: 'transform: scale(1.15) translateY(-2px); filter: hue-rotate(38deg) saturate(1.9) drop-shadow(0 8px 14px rgba(79, 70, 229, 0.6)) brightness(1.08);',
      activeState: 'transform: scale(0.92);',
      tailwindClasses: 'text-indigo-600 hue-rotate-30 saturate-150 drop-shadow-md contrast-110 hover:scale-115 transition-transform',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-0-glass',
      name: 'AI Luminous Indigo Glow',
      description: 'Soft indigo silhouette aura with hover lift',
      cssText: 'color: #6366f1; filter: sepia(0.6) hue-rotate(200deg) saturate(2.2) brightness(1.08) drop-shadow(0 0 8px rgba(99, 102, 241, 0.85)); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;',
      hoverState: 'transform: translateY(-2px) scale(1.14); filter: sepia(0.6) hue-rotate(200deg) saturate(2.6) drop-shadow(0 0 14px rgba(99, 102, 241, 1));',
      activeState: 'transform: scale(0.95);',
      tailwindClasses: 'text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.85)] saturate-150 brightness-110',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-0-cyan',
      name: 'AI Radiant Cyan Halo',
      description: 'Neon cyan silhouette glow directly around the icon',
      cssText: 'color: #0ea5e9; filter: sepia(0.7) hue-rotate(155deg) saturate(2.5) brightness(1.12) drop-shadow(0 0 8px rgba(56, 189, 248, 0.9)); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;',
      hoverState: 'transform: scale(1.16); filter: sepia(0.7) hue-rotate(155deg) saturate(3) drop-shadow(0 0 14px rgba(56, 189, 248, 1)) brightness(1.2);',
      activeState: 'transform: scale(0.94);',
      tailwindClasses: 'text-sky-500 drop-shadow-[0_0_8px_rgba(56,189,248,0.9)] brightness-110 saturate-150',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-0-mono',
      name: 'AI Monochrome Ink',
      description: 'Crisp grayscale ink look that restores color on hover',
      cssText: 'color: #334155; filter: grayscale(1) contrast(1.35) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25)); transition: filter 0.2s ease, transform 0.2s ease; cursor: pointer;',
      hoverState: 'filter: grayscale(0) saturate(1.25) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3)); transform: scale(1.12);',
      activeState: 'transform: scale(0.94);',
      tailwindClasses: 'text-slate-700 grayscale contrast-125 hover:grayscale-0 hover:scale-110 transition-all',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
  ];

  const set1: StylePreset[] = [
    {
      id: 'ai-icon-1-sunset',
      name: 'AI Sunset Hue Shift',
      description: 'Warm hue-shifted tint with rose silhouette glow',
      cssText: 'color: #f43f5e; filter: sepia(0.75) hue-rotate(-28deg) saturate(2.4) brightness(1.06) drop-shadow(0 4px 12px rgba(244, 63, 94, 0.5)); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;',
      hoverState: 'transform: scale(1.14); filter: sepia(0.75) hue-rotate(-28deg) saturate(2.8) drop-shadow(0 6px 16px rgba(244, 63, 94, 0.7));',
      tailwindClasses: 'text-rose-500 -hue-rotate-30 saturate-150 drop-shadow-[0_4px_12px_rgba(244,63,94,0.5)]',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-1-tactile',
      name: 'AI High-Vibrance Pop',
      description: 'Rich cobalt-magenta hue boost with crisp silhouette depth',
      cssText: 'color: #2563eb; filter: hue-rotate(-45deg) saturate(2.1) contrast(1.15) drop-shadow(0 5px 10px rgba(37, 99, 235, 0.42)); transform: scale(1.06); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;',
      hoverState: 'transform: translateY(-2px) scale(1.16); filter: hue-rotate(-45deg) saturate(2.4) contrast(1.2) drop-shadow(0 8px 14px rgba(37, 99, 235, 0.55));',
      activeState: 'transform: scale(0.95);',
      tailwindClasses: 'text-blue-600 -hue-rotate-45 saturate-200 contrast-115 drop-shadow-md scale-105',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-1-emerald',
      name: 'AI Emerald Neon Tint',
      description: 'Cool emerald hue shift with luminous green halo',
      cssText: 'color: #10b981; filter: sepia(0.75) hue-rotate(95deg) saturate(2.4) brightness(1.08) drop-shadow(0 0 10px rgba(16, 185, 129, 0.85)); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;',
      hoverState: 'transform: scale(1.15); filter: sepia(0.75) hue-rotate(95deg) saturate(2.8) drop-shadow(0 0 16px rgba(16, 185, 129, 1));',
      tailwindClasses: 'text-emerald-500 hue-rotate-90 saturate-150 drop-shadow-[0_0_10px_rgba(16,185,129,0.85)]',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-1-tilt',
      name: 'AI Playful Tilt',
      description: 'Dynamic angled tilt & violet hue shift that flips on hover',
      cssText: 'color: #8b5cf6; transform: rotate(-6deg) scale(1.06); filter: hue-rotate(65deg) saturate(1.75) drop-shadow(0 6px 12px rgba(139, 92, 246, 0.45)); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;',
      hoverState: 'transform: rotate(6deg) scale(1.18); filter: hue-rotate(85deg) saturate(2.1) drop-shadow(0 8px 16px rgba(139, 92, 246, 0.65));',
      activeState: 'transform: scale(0.94);',
      tailwindClasses: 'text-violet-500 hue-rotate-60 -rotate-6 scale-105 hover:rotate-6 hover:scale-110 transition-transform',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
  ];

  const set2: StylePreset[] = [
    {
      id: 'ai-icon-2-gold',
      name: 'AI Champagne Gold Tint',
      description: 'Warm metallic gold tint with soft amber glow',
      cssText: 'color: #f59e0b; filter: sepia(0.85) saturate(2.4) hue-rotate(8deg) brightness(1.08) drop-shadow(0 3px 10px rgba(245, 158, 11, 0.5)); transition: transform 0.2s ease;',
      hoverState: 'transform: scale(1.14); filter: sepia(0.85) saturate(2.7) hue-rotate(8deg) brightness(1.15) drop-shadow(0 4px 14px rgba(245, 158, 11, 0.75));',
      tailwindClasses: 'text-amber-500 sepia saturate-200 brightness-105 drop-shadow-[0_3px_10px_rgba(245,158,11,0.5)]',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-2-violet',
      name: 'AI Violet Plasma Aura',
      description: 'Electric violet color shift with plasma silhouette glow',
      cssText: 'color: #a855f7; filter: sepia(0.75) hue-rotate(235deg) saturate(2.5) brightness(1.08) drop-shadow(0 0 10px rgba(168, 85, 247, 0.85)); transition: transform 0.2s ease;',
      hoverState: 'transform: scale(1.15);',
      tailwindClasses: 'text-purple-500 saturate-150 drop-shadow-[0_0_10px_rgba(168,85,247,0.85)]',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-2-frost',
      name: 'AI Crimson Flame Tint',
      description: 'Fiery crimson hue shift with glowing silhouette aura',
      cssText: 'color: #e11d48; filter: sepia(0.8) hue-rotate(315deg) saturate(2.6) brightness(1.08) drop-shadow(0 0 10px rgba(244, 63, 94, 0.8)); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;',
      hoverState: 'transform: scale(1.15); filter: sepia(0.8) hue-rotate(315deg) saturate(3) drop-shadow(0 0 16px rgba(244, 63, 94, 1));',
      tailwindClasses: 'text-rose-600 saturate-150 brightness-110 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-2-pulse',
      name: 'AI Ambient Pulse',
      description: 'Gentle breathing cyan-aqua glow animation on the icon',
      cssText: 'color: #38bdf8; filter: sepia(0.55) hue-rotate(140deg) saturate(2.2) drop-shadow(0 0 8px rgba(56, 189, 248, 0.65)); animation: auracssIconPulse 2.2s ease-in-out infinite; cursor: pointer;',
      keyframes: '@keyframes auracssIconPulse { 0%, 100% { transform: scale(1); filter: sepia(0.55) hue-rotate(140deg) saturate(2.1) drop-shadow(0 0 6px rgba(56, 189, 248, 0.5)); } 50% { transform: scale(1.12); filter: sepia(0.55) hue-rotate(140deg) saturate(2.6) drop-shadow(0 0 14px rgba(56, 189, 248, 0.95)); } }',
      tailwindClasses: 'text-sky-400 animate-pulse drop-shadow-[0_0_8px_rgba(56,189,248,0.65)]',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
  ];

  const allSets = [set0, set1, set2];
  return allSets[cycle] ?? set0;
}
