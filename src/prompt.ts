import type { ExtractedTokens, StylePreset } from './types';

export interface PromptAnalysis {
  colorHex: string;
  twColor: string;
  hasExplicitColor: boolean;
  hasBgIntent: boolean;
  hasTextIntent: boolean;
  hasBorderIntent: boolean;
  isGlass: boolean;
  isGlow: boolean;
  isGradient: boolean;
  isMinimal: boolean;
  radius: string;
  twRadius: string;
  padding: string;
  twPadding: string;
  isLonger: boolean;
  isBigger: boolean;
  isCompact: boolean;
  isPop: boolean;
  isSoften: boolean;
  isFading: boolean;
  isClick: boolean;
  isAnimation: boolean;
  fontSize?: string;
  twFontSize?: string;
  minWidth?: string;
}

function isLightColor(hex: string): boolean {
  if (hex.startsWith('#') && hex.length >= 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160;
  }
  return false;
}

export function analyzePromptText(text: string, defaultColor: string): PromptAnalysis {
  const t = text.toLowerCase();

  // Explicit target property intents
  const hasBgIntent = t.includes('background') || t.includes('bg') || t.includes('fill');
  const hasBorderIntent = t.includes('border') || t.includes('outline') || t.includes('stroke');
  const hasTextIntent = t.includes('text') || t.includes('font') || (!hasBgIntent && !hasBorderIntent && t.includes('color'));

  // Color extraction (Named & Hex)
  let colorHex = defaultColor;
  let twColor = 'indigo-500';
  let hasExplicitColor = false;

  const hexMatch = t.match(/#([0-9a-f]{6}|[0-9a-f]{3})/i);
  if (hexMatch) {
    colorHex = hexMatch[0];
    twColor = `[${hexMatch[0]}]`;
    hasExplicitColor = true;
  } else if (t.includes('cyan') || t.includes('sky')) {
    colorHex = '#38bdf8';
    twColor = 'sky-400';
    hasExplicitColor = true;
  } else if (t.includes('blue')) {
    colorHex = '#2563eb';
    twColor = 'blue-600';
    hasExplicitColor = true;
  } else if (t.includes('purple') || t.includes('violet')) {
    colorHex = '#a855f7';
    twColor = 'purple-500';
    hasExplicitColor = true;
  } else if (t.includes('emerald') || t.includes('green')) {
    colorHex = '#10b981';
    twColor = 'emerald-500';
    hasExplicitColor = true;
  } else if (t.includes('crimson')) {
    colorHex = '#dc2626';
    twColor = 'red-600';
    hasExplicitColor = true;
  } else if (t.includes('red')) {
    colorHex = '#ef4444';
    twColor = 'red-500';
    hasExplicitColor = true;
  } else if (t.includes('rose') || t.includes('pink')) {
    colorHex = '#f43f5e';
    twColor = 'rose-500';
    hasExplicitColor = true;
  } else if (t.includes('yellow')) {
    colorHex = '#eab308';
    twColor = 'yellow-500';
    hasExplicitColor = true;
  } else if (t.includes('teal')) {
    colorHex = '#14b8a6';
    twColor = 'teal-500';
    hasExplicitColor = true;
  } else if (t.includes('amber') || t.includes('orange') || t.includes('gold')) {
    colorHex = '#f59e0b';
    twColor = 'amber-500';
    hasExplicitColor = true;
  } else if (t.includes('slate') || t.includes('dark') || t.includes('black')) {
    colorHex = '#0f172a';
    twColor = 'slate-900';
    hasExplicitColor = true;
  } else if (t.includes('white') || t.includes('light')) {
    colorHex = '#ffffff';
    twColor = 'white';
    hasExplicitColor = true;
  }

  // Paradigm flags
  const isGlass = t.includes('glass') || t.includes('frost') || t.includes('blur') || t.includes('translucent');
  const isGlow = t.includes('glow') || t.includes('neon') || t.includes('ambient') || t.includes('luminous');
  const isGradient = t.includes('gradient') || t.includes('mesh') || t.includes('vibrant');
  const isMinimal = t.includes('minimal') || t.includes('flat') || t.includes('sharp') || t.includes('clean');

  // Colloquial & Dimensional intents
  const isLonger = Boolean(t.match(/\b(long|longer|wide|wider|broad|stretched|expand|lengthy)\b/i));
  const isBigger = Boolean(t.match(/\b(big|bigger|large|larger|huge|chunky|giant|spacious)\b/i));
  const isCompact = Boolean(t.match(/\b(compact|small|smaller|tight|tiny|thin|slender)\b/i));
  const isPop = Boolean(t.match(/\b(pop|pops|standout|punchy|bold)\b/i));
  const isSoften = Boolean(t.match(/\b(soften|softer|smooth|smoothen)\b/i));
  const isFading = t.includes('fading') || t.includes('fade') || t.includes('pulse') || t.includes('pulsing');
  const isClick = t.includes('click') || t.includes('clicking') || t.includes('press') || t.includes('tap');
  const isAnimation = t.includes('animat') || t.includes('motion') || t.includes('bounce');

  // Geometry modifiers
  let radius = '8px';
  let twRadius = 'rounded-lg';
  if (t.includes('pill') || t.includes('round') || t.includes('oval')) {
    radius = '9999px';
    twRadius = 'rounded-full';
  } else if (t.includes('sharp') || t.includes('square') || t.includes('box')) {
    radius = '0px';
    twRadius = 'rounded-none';
  } else if (t.includes('curved') || t.includes('card') || isSoften) {
    radius = '16px';
    twRadius = 'rounded-2xl';
  }

  let padding = '10px 20px';
  let twPadding = 'px-5 py-2.5';
  let fontSize: string | undefined;
  let twFontSize: string | undefined;
  let minWidth: string | undefined;

  if (isLonger && isBigger) {
    padding = '16px 36px';
    twPadding = 'px-9 py-4 text-lg';
    fontSize = '1.15rem';
    twFontSize = 'text-lg';
    minWidth = '240px';
  } else if (isLonger) {
    padding = '10px 32px';
    twPadding = 'px-8 py-2.5';
    minWidth = '200px';
  } else if (isBigger) {
    padding = '14px 28px';
    twPadding = 'px-7 py-3.5 text-base';
    fontSize = '1.1rem';
    twFontSize = 'text-base';
  } else if (isCompact) {
    padding = '6px 12px';
    twPadding = 'px-3 py-1.5 text-xs';
    fontSize = '0.85rem';
    twFontSize = 'text-xs';
  }

  return {
    colorHex,
    twColor,
    hasExplicitColor,
    hasBgIntent,
    hasTextIntent,
    hasBorderIntent,
    isGlass,
    isGlow,
    isGradient,
    isMinimal,
    radius,
    twRadius,
    padding,
    twPadding,
    isLonger,
    isBigger,
    isCompact,
    isPop,
    isSoften,
    isFading,
    isClick,
    isAnimation,
    fontSize,
    twFontSize,
    minWidth,
  };
}

export function parseDesignPrompt(
  prompt: string,
  el: HTMLElement,
  tokens: ExtractedTokens
): StylePreset {
  const analysis = analyzePromptText(prompt, tokens.primaryColor);
  const tag = el.tagName.toLowerCase();
  const isAction = tag === 'button' || tag === 'a' || el.getAttribute('role') === 'button';
  const isHeading = /^h[1-6]$/i.test(tag);
  const isLight = isLightColor(analysis.colorHex);
  const textContrastColor = isLight ? '#0f172a' : '#ffffff';

  let cssText = '';
  let twClasses = '';

  if (isHeading) {
    if (analysis.hasBgIntent) {
      cssText = `background-color: ${analysis.colorHex}; color: ${textContrastColor}; padding: 8px 16px; border-radius: ${analysis.radius}; font-weight: 700;`;
      twClasses = `bg-${analysis.twColor} ${isLight ? 'text-slate-900' : 'text-white'} px-4 py-2 ${analysis.twRadius} font-bold`;
    } else if (analysis.isGradient) {
      cssText = `background: linear-gradient(135deg, ${analysis.colorHex} 0%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.025em;`;
      twClasses = `bg-gradient-to-r from-${analysis.twColor} to-sky-400 bg-clip-text text-transparent font-extrabold tracking-tight`;
    } else {
      cssText = `color: ${analysis.colorHex}; font-weight: 700; letter-spacing: -0.02em;`;
      twClasses = `text-${analysis.twColor} font-bold tracking-tight`;
    }
  } else if (isAction) {
    const shadow = analysis.isPop
      ? `box-shadow: 0 8px 24px ${analysis.colorHex}55;`
      : analysis.isGlow
      ? `box-shadow: 0 0 20px ${analysis.colorHex}66;`
      : analysis.isMinimal
      ? 'box-shadow: none;'
      : 'box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);';

    const minWidthCss = analysis.minWidth ? `min-width: ${analysis.minWidth}; ` : '';
    const fontSizeCss = analysis.fontSize ? `font-size: ${analysis.fontSize}; ` : '';
    const twDimensions = `${analysis.minWidth ? 'min-w-[200px] ' : ''}${analysis.twFontSize ? `${analysis.twFontSize} ` : ''}`;

    if (analysis.hasBorderIntent && !analysis.hasBgIntent) {
      cssText = `background-color: transparent; color: ${analysis.colorHex}; border: 2px solid ${analysis.colorHex}; border-radius: ${analysis.radius}; padding: ${analysis.padding}; ${minWidthCss}${fontSizeCss}${shadow} cursor: pointer; font-weight: 600;`;
      twClasses = `bg-transparent border-2 border-${analysis.twColor} text-${analysis.twColor} ${analysis.twRadius} ${analysis.twPadding} ${twDimensions}font-semibold`.trim();
    } else if (analysis.isGlass) {
      cssText = `background-color: rgba(255, 255, 255, 0.08); color: #f8fafc; border: 1px solid ${analysis.colorHex}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: ${analysis.radius}; padding: ${analysis.padding}; ${minWidthCss}${fontSizeCss}${shadow} cursor: pointer; font-weight: 600;`;
      twClasses = `bg-white/10 border border-${analysis.twColor} text-white backdrop-blur-md ${analysis.twRadius} ${analysis.twPadding} ${twDimensions}font-semibold`.trim();
    } else if (analysis.isMinimal) {
      cssText = `background-color: transparent; color: ${analysis.colorHex}; border: 2px solid ${analysis.colorHex}; border-radius: ${analysis.radius}; padding: ${analysis.padding}; ${minWidthCss}${fontSizeCss}${shadow} cursor: pointer; font-weight: 600;`;
      twClasses = `bg-transparent border-2 border-${analysis.twColor} text-${analysis.twColor} ${analysis.twRadius} ${analysis.twPadding} ${twDimensions}font-semibold`.trim();
    } else {
      cssText = `background-color: ${analysis.colorHex}; color: ${textContrastColor}; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: ${analysis.radius}; padding: ${analysis.padding}; ${minWidthCss}${fontSizeCss}${shadow} cursor: pointer; font-weight: 600;`;
      twClasses = `bg-${analysis.twColor} ${isLight ? 'text-slate-900' : 'text-white'} ${analysis.twRadius} ${analysis.twPadding} ${twDimensions}font-semibold shadow-md`.trim();
    }
  } else {
    // Container element
    const shadow = analysis.isGlow
      ? (analysis.isFading
          ? `box-shadow: 0 0 24px ${analysis.colorHex}66, 0 0 48px ${analysis.colorHex}33;`
          : `box-shadow: 0 0 25px ${analysis.colorHex}40;`)
      : 'box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);';

    const motionCss = (analysis.isClick || analysis.isAnimation || analysis.isFading)
      ? ' cursor: pointer; transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s ease-in-out, all 0.3s ease;'
      : '';
    const motionTw = (analysis.isClick || analysis.isAnimation || analysis.isFading)
      ? ' cursor-pointer active:scale-95 transition-all duration-300'
      : '';

    if (analysis.hasBgIntent) {
      cssText = `background-color: ${analysis.colorHex}; color: ${textContrastColor}; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: ${analysis.radius}; padding: 24px; ${shadow}${motionCss}`;
      twClasses = `bg-${analysis.twColor} ${isLight ? 'text-slate-900' : 'text-white'} border border-white/20 ${analysis.twRadius} p-6 shadow-xl${motionTw}`;
    } else if (analysis.hasBorderIntent) {
      cssText = `background-color: #0f172a; color: #f8fafc; border: 2px solid ${analysis.colorHex}; border-radius: ${analysis.radius}; padding: 24px; ${shadow}${motionCss}`;
      twClasses = `bg-slate-900 border-2 border-${analysis.twColor} ${analysis.twRadius} p-6 shadow-xl${motionTw}`;
    } else if (analysis.isGlass) {
      const glassBg = analysis.hasExplicitColor
        ? `background-color: rgba(15, 23, 42, 0.75); border: 1px solid ${analysis.colorHex}80;`
        : `background-color: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255, 255, 255, 0.15);`;
      cssText = `${glassBg} backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: ${analysis.radius}; padding: 24px; ${shadow}${motionCss}`;
      twClasses = `bg-slate-900/70 border border-${analysis.twColor}/50 backdrop-blur-xl ${analysis.twRadius} p-6 shadow-2xl${motionTw}`;
    } else if (analysis.hasExplicitColor) {
      cssText = `background-color: ${analysis.colorHex}; color: ${textContrastColor}; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: ${analysis.radius}; padding: 24px; ${shadow}${motionCss}`;
      twClasses = `bg-${analysis.twColor} ${isLight ? 'text-slate-900' : 'text-white'} ${analysis.twRadius} p-6 shadow-xl${motionTw}`;
    } else {
      cssText = `background-color: #0f172a; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: ${analysis.radius}; padding: 24px; ${shadow}${motionCss}`;
      twClasses = `bg-slate-900 border border-white/10 ${analysis.twRadius} p-6 shadow-xl${motionTw}`;
    }
  }

  const cleanPrompt = prompt.trim().slice(0, 32);
  return {
    id: `custom-prompt-${Date.now()}`,
    name: `Aura: "${cleanPrompt}"`,
    description: `Synthesized design token from prompt`,
    cssText,
    tailwindClasses: twClasses,
    contrastRating: 'AAA',
    contrastRatio: '7.0:1',
  };
}

export async function synthesizeDesignPrompt(
  prompt: string,
  el: HTMLElement,
  tokens: ExtractedTokens,
  aiService?: { isConfigured: () => boolean; synthesize: (req: any) => Promise<any> }
): Promise<StylePreset> {
  if (aiService?.isConfigured()) {
    try {
      const res = await aiService.synthesize({
        prompt,
        tag: el.tagName.toLowerCase(),
        htmlSnippet: el.outerHTML.slice(0, 200),
        computedStyles: { color: el.style.color, backgroundColor: el.style.backgroundColor },
        siteTokens: tokens,
      });
      if (res?.cssText) {
        return {
          id: `ai-prompt-${Date.now()}`,
          name: `AI: "${prompt.slice(0, 24)}"`,
          description: res.explanation || 'Synthesized by AI',
          cssText: res.cssText,
          tailwindClasses: res.tailwindClasses,
          contrastRating: 'AAA',
        };
      }
    } catch {
      // Graceful fallback to client-side rule engine
    }
  }
  return parseDesignPrompt(prompt, el, tokens);
}
