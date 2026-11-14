import { classifySnapshot } from './element-classifier';
import { getArchetypeVariationPresets } from './archetype-presets';
import type { ColorDef, SynthesizeResponse } from './bridge-types';

export const COLOR_MAP: Record<string, ColorDef> = {
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

export function isLightColorHex(hex: string): boolean {
  if (hex.startsWith('#') && hex.length >= 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160;
  }
  return false;
}

export function extractColorDef(text: string): ColorDef | null {
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

export async function synthesizeWithLocalOrEnv(
  prompt: string,
  tag: string,
  _htmlSnippet = '',
  _computedStyles: Record<string, string> = {},
  _siteTokens: Record<string, unknown> = {},
  setIndex = 0,
  innerText = '',
  rect?: { width: number; height: number }
): Promise<SynthesizeResponse> {
  const p = prompt.toLowerCase();
  const archetype = classifySnapshot(tag, _htmlSnippet, innerText, rect);

  if (p.includes('diverse design variations') || p.includes('presets') || p.includes('4 variations')) {
    const presets = getArchetypeVariationPresets(archetype, setIndex);
    return {
      cssText: presets[0]!.cssText,
      tailwindClasses: presets[0]!.tailwindClasses,
      explanation: JSON.stringify({ presets }),
    };
  }

  const color = extractColorDef(p);
  if (archetype === 'icon-emoji') {
    const glowHex = color ? color.hex : '#38bdf8';
    const cssText = p.includes('glow') || p.includes('pop') || p.includes('halo')
      ? `filter: drop-shadow(0 0 10px ${glowHex}) brightness(1.12) saturate(1.25); transition: transform 0.2s ease, filter 0.2s ease;`
      : p.includes('mono') || p.includes('gray') || p.includes('dark')
      ? 'filter: grayscale(1) contrast(1.3); transition: filter 0.2s ease;'
      : 'filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35)) saturate(1.2); transform: scale(1.08); transition: transform 0.2s ease;';
    return {
      cssText,
      tailwindClasses: 'drop-shadow-lg saturate-125 transition-transform',
      explanation: `Applied icon-aware filter & transform styling to <${tag}>`,
    };
  }
  if (archetype === 'photo-media') {
    const radius = p.includes('circle') || p.includes('round') || p.includes('pill') ? '9999px' : '16px';
    return {
      cssText: `border-radius: ${radius}; object-fit: cover; filter: contrast(1.08) saturate(1.15); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);`,
      tailwindClasses: `rounded-2xl object-cover shadow-xl`,
      explanation: `Applied media framing & contrast styling to <${tag}>`,
    };
  }
  const hasNegatedBg = /\b(remove|no|without|clear|transparent)\s+(?:the\s+)?(?:background|bg|fill)\b/i.test(p);
  const hasBg = !hasNegatedBg && (p.includes('background') || p.includes('bg') || p.includes('fill') || (!p.includes('text') && !p.includes('border') && color !== null));
  const hasText = p.includes('text') || p.includes('font') || p.includes('foreground');
  const hasBorder = p.includes('border') || p.includes('outline') || p.includes('stroke') || hasNegatedBg;
  const hasGlow = p.includes('glow') || p.includes('neon') || p.includes('shadow') || p.includes('halo') || p.includes('luminous') || p.includes('pulse');
  const hasFading = p.includes('fading') || p.includes('fade') || p.includes('pulse') || p.includes('pulsing') || p.includes('breathe');
  const hasClickAnim = p.includes('click') || p.includes('clicking') || p.includes('press') || p.includes('tap') || p.includes('active');
  const hasAnim = p.includes('animat') || p.includes('motion') || p.includes('bounce') || p.includes('spring');
  const hasPill = p.includes('pill') || p.includes('oval') || p.includes('rounded-full');
  const hasSharp = p.includes('sharp') || p.includes('square') || p.includes('box') || p.includes('brutalist');
  const hasGlass = p.includes('glass') || p.includes('frost') || p.includes('blur') || p.includes('translucent');

  const isLonger = Boolean(p.match(/\b(long|longer|wide|wider|broad|stretched|expand|lengthy)\b/i));
  const isBigger = Boolean(p.match(/\b(big|bigger|large|larger|huge|chunky|giant|spacious|breathing room|roomy|airiness)\b/i));
  const isCompact = Boolean(p.match(/\b(compact|small|smaller|tight|tiny|thin|slender)\b/i));
  const isPop = Boolean(p.match(/\b(pop|pops|standout|punchy|bold)\b/i));
  const isSoften = Boolean(p.match(/\b(soften|softer|smooth|smoothen)\b/i));
  const isProfessional = Boolean(p.match(/\b(professional|corporate|executive|sleek)\b/i));
  const isLuxury = Boolean(p.match(/\b(expensive|luxury|premium|high[- ]?end)\b/i));
  const isSpacious = Boolean(p.match(/\b(crowded|cramped|suffocating|tight)\b/i));
  const isUgly = Boolean(p.match(/\b(ugly|cheap|outdated|clunky)\b/i));
  const isFriendly = Boolean(p.match(/\b(friendly|approachable|playful|soft)\b/i));

  const cssDecls: string[] = [];
  const twDecls: string[] = [];
  const descriptions: string[] = [];

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

  if (hasNegatedBg) {
    const textColor = color ? color.hex : '#f8fafc';
    const textTw = color ? `text-${color.tw}` : 'text-slate-100';
    cssDecls.push(`background-color: transparent; color: ${textColor};`);
    twDecls.push(`bg-transparent ${textTw}`);
    descriptions.push('transparent background');
  } else if (hasBg && color) {
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

  if (hasText && color && !hasBg) {
    cssDecls.push(`color: ${color.hex};`);
    twDecls.push(`text-${color.tw}`);
    descriptions.push(`text color set to ${color.hex}`);
  }

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

  if (hasClickAnim || hasAnim) {
    cssDecls.push('cursor: pointer;');
    twDecls.push('cursor-pointer active:scale-95 active:brightness-95');
    descriptions.push('interactive click response animation');
  }

  if (isProfessional) {
    cssDecls.push('border: 1px solid rgba(0, 0, 0, 0.15); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);');
    twDecls.push('border shadow-sm');
    descriptions.push('professional corporate styling');
  }

  if (isLuxury) {
    cssDecls.push('background-color: #fff8e1; letter-spacing: 0.05em; border: 1px solid rgba(255, 255, 255, 0.3);');
    twDecls.push('bg-[#fff8e1] border border-white/30');
    descriptions.push('luxury warm aesthetic');
  }

  if (isSpacious) {
    cssDecls.push('padding: 16px 24px; line-height: 1.6;');
    twDecls.push('p-6');
    descriptions.push('relaxed spacing with breathing room');
  }

  if (isUgly) {
    cssDecls.push('border-radius: 1.5rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);');
    twDecls.push('rounded-xl shadow-md');
    descriptions.push('modernized clean aesthetic');
  }

  if (isFriendly) {
    cssDecls.push('border-radius: 1.75rem; background-color: #ffedd5; box-shadow: 0 0 12px rgba(255, 200, 150, 0.4);');
    twDecls.push('rounded-2xl bg-[#ffedd5] shadow-sm');
    descriptions.push('friendly approachable warmth');
  }

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
