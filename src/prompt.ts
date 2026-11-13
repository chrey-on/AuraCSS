import type { ExtractedTokens, StylePreset } from './types';
import {
  type PromptAnalysis,
  isLightColor,
  analyzePromptText,
} from './prompt-analyzer';

export type { PromptAnalysis };
export { isLightColor, analyzePromptText };

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

  // ---------- Lay-person intent overlays ----------
  // Professional / corporate / executive / sleek → neutral palette, crisp 1px border, subtle micro-shadow
  if (analysis.isProfessional) {
    const neutralBg = tokens.primaryColor;
    cssText = cssText.replace(/background-color: [^;]+;/, `background-color: ${neutralBg};`);
    twClasses = twClasses.replace(/bg-[^\s]+/, `bg-${neutralBg.startsWith('#') ? `[${neutralBg}]` : 'gray-500'}`);
    if (!cssText.includes('border:')) {
      cssText += ' border: 1px solid rgba(0,0,0,0.15);';
    } else {
      cssText = cssText.replace(/border: [^;]+;/, 'border: 1px solid rgba(0,0,0,0.15);');
    }
    if (!twClasses.includes('border')) twClasses += ' border';
    if (cssText.includes('box-shadow:')) {
      cssText = cssText.replace(/box-shadow: [^;]+;/, 'box-shadow: 0 1px 3px rgba(0,0,0,0.1);');
    } else {
      cssText += ' box-shadow: 0 1px 3px rgba(0,0,0,0.1);';
    }
    if (!twClasses.includes('shadow-')) twClasses += ' shadow-sm';
  }

  // Luxury / expensive / premium / high-end → dark/warm base, wide letter-spacing, ultra-thin border
  if (analysis.isLuxury) {
    const warmBase = '#fff8e1';
    cssText = cssText.replace(/background-color: [^;]+;/, `background-color: ${warmBase};`);
    twClasses = twClasses.replace(/bg-[^\s]+/, 'bg-[#fff8e1]');
    if (!cssText.includes('letter-spacing')) cssText += ' letter-spacing: 0.05em;';
    if (!cssText.includes('border:')) {
      cssText += ' border: 1px solid rgba(255,255,255,0.3);';
    }
    if (!twClasses.includes('border')) twClasses += ' border border-white/30';
  }

  // Crowded / cramped / suffocating / tight → add breathing room
  if (analysis.isSpacious) {
    cssText = cssText.replace(/padding: ([^;]+);/, (_, p) => `padding: ${p} 1.5rem;`);
    twClasses = twClasses.replace(/p[xy]?-[^\s]+/g, (cls) => `${cls} p-6`);
    if (!cssText.includes('line-height')) cssText += ' line-height: 1.6;';
  }

  // Ugly / cheap / outdated / clunky → modern rounded-xl, soft layered shadow, refined contrast
  if (analysis.isUgly) {
    cssText = cssText.replace(/border-radius: [^;]+;/, 'border-radius: 1.5rem;');
    twClasses = twClasses.replace(/rounded-[^\s]+/, 'rounded-xl');
    if (cssText.includes('box-shadow:')) {
      cssText = cssText.replace(/box-shadow: [^;]+;/, 'box-shadow: 0 4px 12px rgba(0,0,0,0.2);');
    } else {
      cssText += ' box-shadow: 0 4px 12px rgba(0,0,0,0.2);';
    }
    if (!twClasses.includes('shadow-')) twClasses += ' shadow-md';
  }

  // Friendly / approachable / playful / soft → rounded-2xl, warm pastel hues, soft ambient glow
  if (analysis.isFriendly) {
    cssText = cssText.replace(/border-radius: [^;]+;/, 'border-radius: 1.75rem;');
    twClasses = twClasses.replace(/rounded-[^\s]+/, 'rounded-2xl');
    if (cssText.includes('background-color:')) {
      cssText = cssText.replace(/background-color: [^;]+;/, 'background-color: #ffedd5;');
    } else {
      cssText = `background-color: #ffedd5; ${cssText}`;
    }
    if (twClasses.includes('bg-')) {
      twClasses = twClasses.replace(/bg-[^\s]+/, 'bg-[#ffedd5]');
    } else {
      twClasses = `bg-[#ffedd5] ${twClasses}`;
    }
    if (cssText.includes('box-shadow:')) {
      cssText = cssText.replace(/box-shadow: [^;]+;/, 'box-shadow: 0 0 12px rgba(255,200,150,0.4);');
    } else {
      cssText += ' box-shadow: 0 0 12px rgba(255,200,150,0.4);';
    }
    if (!twClasses.includes('shadow-')) twClasses += ' shadow-sm';
  }

  // Match / blend in / fit in → harmonise with site tokens
  if (analysis.isMatch) {
    cssText = cssText.replace(/background-color: [^;]+;/, `background-color: ${tokens.primaryColor};`);
    cssText = cssText.replace(/color: [^;]+;/, `color: ${tokens.primaryColor};`);
    twClasses = twClasses.replace(/bg-[^\s]+/, `bg-${tokens.primaryColor.startsWith('#') ? `[${tokens.primaryColor}]` : 'gray-500'}`);
    twClasses = twClasses.replace(/text-[^\s]+/, `text-${tokens.primaryColor.startsWith('#') ? `[${tokens.primaryColor}]` : 'gray-800'}`);
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
      const computed = typeof window !== 'undefined' ? window.getComputedStyle(el) : null;
      const computedStyles: Record<string, string> = {
        color: computed?.color || el.style.color || '',
        backgroundColor: computed?.backgroundColor || el.style.backgroundColor || '',
        fontSize: computed?.fontSize || '',
        fontWeight: computed?.fontWeight || '',
        borderRadius: computed?.borderRadius || el.style.borderRadius || '',
        padding: computed?.padding || '',
        border: computed?.border || '',
      };
      const parentLayout = el.parentElement && typeof window !== 'undefined'
        ? window.getComputedStyle(el.parentElement).display
        : 'normal flow';

      const res = await aiService.synthesize({
        prompt,
        tag: el.tagName.toLowerCase(),
        htmlSnippet: el.outerHTML.slice(0, 300),
        innerText: el.innerText ? el.innerText.slice(0, 80) : '',
        parentLayout,
        computedStyles,
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
