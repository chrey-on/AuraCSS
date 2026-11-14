import type { StylePreset } from './types';

const EMOJI_ONLY_RE = /^(?=.*\p{Extended_Pictographic})[\p{Extended_Pictographic}\u200d\ufe0f\s]{1,12}$/u;

export function isIconOrMediaElement(el: HTMLElement): boolean {
  const tag = el.tagName.toLowerCase();
  if (tag === 'img' || tag === 'svg' || tag === 'i') return true;
  if (el.children.length === 0) {
    const text = (el.textContent || '').trim();
    if (text && EMOJI_ONLY_RE.test(text)) return true;
  }
  return false;
}

export function isIconTagOrSnippet(tag: string, htmlSnippet = ''): boolean {
  const t = tag.toLowerCase();
  if (t === 'img' || t === 'svg' || t === 'i') return true;
  return htmlSnippet.includes('<img') || htmlSnippet.includes('<svg');
}

export function getIconVariationCyclePresets(cycleIndex: number): StylePreset[] {
  const cycle = Math.abs(Number(cycleIndex) || 0) % 3;

  const set0: StylePreset[] = [
    {
      id: 'ai-icon-0-elevated',
      name: 'AI Crisp Icon Pop',
      description: 'Silhouette drop-shadow with smooth hover scale',
      cssText: 'filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35)) contrast(1.08) saturate(1.15); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;',
      hoverState: 'transform: scale(1.15) translateY(-2px); filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.45)) brightness(1.08);',
      activeState: 'transform: scale(0.92);',
      tailwindClasses: 'drop-shadow-md contrast-110 hover:scale-115 transition-transform',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-0-glass',
      name: 'AI Frosted Glass Badge',
      description: 'Compact frosted pill frame with soft icon shadow',
      cssText: 'padding: 6px; border-radius: 9999px; background: rgba(255, 255, 255, 0.16); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.2)); transition: transform 0.2s ease;',
      hoverState: 'transform: scale(1.1); background: rgba(255, 255, 255, 0.26);',
      activeState: 'transform: scale(0.95);',
      tailwindClasses: 'p-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 drop-shadow',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-0-cyan',
      name: 'AI Radiant Cyan Halo',
      description: 'Neon cyan silhouette glow directly around the icon',
      cssText: 'filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.9)) brightness(1.12) saturate(1.25); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;',
      hoverState: 'transform: scale(1.16); filter: drop-shadow(0 0 14px rgba(56, 189, 248, 1)) brightness(1.2);',
      activeState: 'transform: scale(0.94);',
      tailwindClasses: 'drop-shadow-[0_0_8px_rgba(56,189,248,0.9)] brightness-110 saturate-125',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-0-mono',
      name: 'AI Monochrome Ink',
      description: 'Crisp grayscale ink look that restores color on hover',
      cssText: 'filter: grayscale(1) contrast(1.35) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25)); transition: filter 0.2s ease, transform 0.2s ease; cursor: pointer;',
      hoverState: 'filter: grayscale(0) saturate(1.25) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3)); transform: scale(1.12);',
      activeState: 'transform: scale(0.94);',
      tailwindClasses: 'grayscale contrast-125 hover:grayscale-0 hover:scale-110 transition-all',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
  ];

  const set1: StylePreset[] = [
    {
      id: 'ai-icon-1-sunset',
      name: 'AI Sunset Hue Shift',
      description: 'Warm hue-shifted tint with rose silhouette glow',
      cssText: 'filter: hue-rotate(-28deg) saturate(1.5) drop-shadow(0 4px 12px rgba(244, 63, 94, 0.5)); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;',
      hoverState: 'transform: scale(1.14); filter: hue-rotate(-28deg) saturate(1.7) drop-shadow(0 6px 16px rgba(244, 63, 94, 0.7));',
      tailwindClasses: '-hue-rotate-30 saturate-150 drop-shadow-[0_4px_12px_rgba(244,63,94,0.5)]',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-1-tactile',
      name: 'AI Soft Tactile Chip',
      description: 'Compact raised rounded chip around the icon',
      cssText: 'padding: 6px; border-radius: 12px; background: #e2e8f0; box-shadow: 4px 4px 10px #94a3b8, -3px -3px 8px #ffffff; filter: saturate(1.15); transition: transform 0.2s ease;',
      hoverState: 'transform: translateY(-2px) scale(1.06);',
      activeState: 'transform: scale(0.95);',
      tailwindClasses: 'p-1.5 rounded-xl bg-slate-200 shadow-md saturate-110',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-1-emerald',
      name: 'AI Emerald Neon Tint',
      description: 'Cool emerald hue shift with luminous green halo',
      cssText: 'filter: hue-rotate(115deg) saturate(1.55) drop-shadow(0 0 10px rgba(16, 185, 129, 0.85)); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;',
      hoverState: 'transform: scale(1.15); filter: hue-rotate(115deg) saturate(1.75) drop-shadow(0 0 16px rgba(16, 185, 129, 1));',
      tailwindClasses: 'hue-rotate-90 saturate-150 drop-shadow-[0_0_10px_rgba(16,185,129,0.85)]',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-1-tilt',
      name: 'AI Playful Tilt',
      description: 'Dynamic angled tilt that flips playfully on hover',
      cssText: 'transform: rotate(-6deg) scale(1.06); filter: drop-shadow(0 6px 12px rgba(99, 102, 241, 0.4)); transition: transform 0.2s ease; cursor: pointer;',
      hoverState: 'transform: rotate(6deg) scale(1.18);',
      activeState: 'transform: scale(0.94);',
      tailwindClasses: '-rotate-6 scale-105 hover:rotate-6 hover:scale-110 transition-transform',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
  ];

  const set2: StylePreset[] = [
    {
      id: 'ai-icon-2-gold',
      name: 'AI Champagne Gold Tint',
      description: 'Warm metallic gold tint with soft amber glow',
      cssText: 'filter: sepia(0.75) saturate(2.1) hue-rotate(8deg) brightness(1.05) drop-shadow(0 3px 10px rgba(245, 158, 11, 0.5)); transition: transform 0.2s ease;',
      hoverState: 'transform: scale(1.14); filter: sepia(0.75) saturate(2.3) hue-rotate(8deg) brightness(1.12) drop-shadow(0 4px 14px rgba(245, 158, 11, 0.75));',
      tailwindClasses: 'sepia saturate-200 brightness-105 drop-shadow-[0_3px_10px_rgba(245,158,11,0.5)]',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-2-violet',
      name: 'AI Violet Plasma Aura',
      description: 'Electric violet color shift with plasma silhouette glow',
      cssText: 'filter: hue-rotate(245deg) saturate(1.55) drop-shadow(0 0 10px rgba(168, 85, 247, 0.85)); transition: transform 0.2s ease;',
      hoverState: 'transform: scale(1.15);',
      tailwindClasses: 'saturate-150 drop-shadow-[0_0_10px_rgba(168,85,247,0.85)]',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-2-frost',
      name: 'AI Crisp Frost Frame',
      description: 'Subtle translucent border frame keeping icon crisp',
      cssText: 'padding: 5px; border-radius: 10px; background: rgba(15, 23, 42, 0.08); border: 1px solid rgba(148, 163, 184, 0.35); filter: contrast(1.1) saturate(1.15); transition: transform 0.2s ease;',
      hoverState: 'transform: scale(1.08); border-color: rgba(56, 189, 248, 0.6);',
      tailwindClasses: 'p-1.5 rounded-lg bg-slate-900/10 border border-slate-400/35 contrast-110',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: 'ai-icon-2-pulse',
      name: 'AI Ambient Pulse',
      description: 'Gentle breathing glow animation on the icon',
      cssText: 'filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.65)); animation: auracssIconPulse 2.2s ease-in-out infinite; cursor: pointer;',
      keyframes: '@keyframes auracssIconPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.5)); } 50% { transform: scale(1.1); filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.95)); } }',
      tailwindClasses: 'animate-pulse drop-shadow-[0_0_8px_rgba(56,189,248,0.65)]',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
  ];

  const allSets = [set0, set1, set2];
  return allSets[cycle] ?? set0;
}
