import type { ExtractedTokens } from './types';

export interface RGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function parseColor(colorStr: string): RGB | null {
  if (!colorStr || colorStr === 'transparent' || colorStr === 'inherit') {
    return null;
  }

  // Handle rgb(r, g, b) and rgba(r, g, b, a)
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1] ?? '0', 10);
    const g = parseInt(rgbMatch[2] ?? '0', 10);
    const b = parseInt(rgbMatch[3] ?? '0', 10);
    const a = rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1;
    return { r, g, b, a };
  }

  // Handle hex #rgb, #rgba, #rrggbb, #rrggbbaa
  const hexMatch = colorStr.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    const raw = hexMatch[1] ?? '';
    if (raw.length === 3 || raw.length === 4) {
      const r = parseInt((raw[0] ?? '0').repeat(2), 16);
      const g = parseInt((raw[1] ?? '0').repeat(2), 16);
      const b = parseInt((raw[2] ?? '0').repeat(2), 16);
      const a = raw.length === 4 ? parseInt((raw[3] ?? 'f').repeat(2), 16) / 255 : 1;
      return { r, g, b, a };
    }
    if (raw.length === 6 || raw.length === 8) {
      const r = parseInt(raw.slice(0, 2), 16);
      const g = parseInt(raw.slice(2, 4), 16);
      const b = parseInt(raw.slice(4, 6), 16);
      const a = raw.length === 8 ? parseInt(raw.slice(6, 8), 16) / 255 : 1;
      return { r, g, b, a };
    }
  }

  return null;
}

/**
 * Calculates standard sRGB relative luminance according to WCAG 2.2 / ITU-R BT.709
 * L = 0.2126R + 0.7152G + 0.0722B (where channels are linear sRGB components)
 */
export function calculateLuminance(rgb: RGB): number {
  const toLinear = (c: number): number => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  const lr = toLinear(rgb.r);
  const lg = toLinear(rgb.g);
  const lb = toLinear(rgb.b);

  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/**
 * Computes color saturation from 0 to 1
 */
function calculateSaturation(rgb: RGB): number {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === min) return 0;
  const l = (max + min) / 2;
  const d = max - min;
  return l > 0.5 ? d / (2 - max - min) : d / (max + min);
}

export class AuraHarvester {
  private cachedTokens: ExtractedTokens | null = null;

  public harvest(forceFresh = false): ExtractedTokens {
    if (this.cachedTokens && !forceFresh) {
      return this.cachedTokens;
    }

    // Default fallbacks
    let isDarkMode = false;
    let primaryColor = '#4f46e5';
    let fontFamily = 'system-ui, sans-serif';
    let baseRadius = '8px';

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return { isDarkMode, primaryColor, fontFamily, baseRadius };
    }

    // 1. Determine background luminance from body / html
    const rootBg = this.resolveEffectiveBackground(document.body || document.documentElement);
    if (rootBg) {
      const lum = calculateLuminance(rootBg);
      isDarkMode = lum < 0.45;
    }

    // 2. Sub-linear sampling: sample at most k <= 50 landmark elements
    const selector = 'button, a, nav, header, h1, h2, h3, [class*="btn"], [class*="primary"]';
    const rawLandmarks = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const sample = rawLandmarks.slice(0, 50);

    let maxSaturation = 0.25; // Minimum saturation threshold to qualify as brand color
    const fontFreq = new Map<string, number>();
    const radiusFreq = new Map<string, number>();

    for (const el of sample) {
      if (!el.isConnected || el.id === 'auracss-root' || el.closest('#auracss-root')) {
        continue;
      }

      const style = window.getComputedStyle(el);

      // Collect dominant font
      if (style.fontFamily) {
        const primaryFont = style.fontFamily.split(',')[0]?.trim().replace(/['"]/g, '') ?? '';
        if (primaryFont) {
          fontFreq.set(primaryFont, (fontFreq.get(primaryFont) ?? 0) + 1);
        }
      }

      // Collect base border-radius
      if (style.borderRadius && style.borderRadius !== '0px') {
        radiusFreq.set(style.borderRadius, (radiusFreq.get(style.borderRadius) ?? 0) + 1);
      }

      // Detect prominent brand color from backgrounds & borders
      const bg = parseColor(style.backgroundColor);
      if (bg && bg.a > 0.6) {
        const sat = calculateSaturation(bg);
        if (sat > maxSaturation) {
          maxSaturation = sat;
          primaryColor = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
        }
      }

      const border = parseColor(style.borderColor);
      if (border && border.a > 0.6) {
        const sat = calculateSaturation(border);
        if (sat > maxSaturation) {
          maxSaturation = sat;
          primaryColor = `rgb(${border.r}, ${border.g}, ${border.b})`;
        }
      }
    }

    // Extract highest frequency font
    let topFontCount = 0;
    for (const [font, count] of fontFreq.entries()) {
      if (count > topFontCount) {
        topFontCount = count;
        fontFamily = font;
      }
    }

    // Extract highest frequency radius
    let topRadiusCount = 0;
    for (const [radius, count] of radiusFreq.entries()) {
      if (count > topRadiusCount) {
        topRadiusCount = count;
        baseRadius = radius;
      }
    }

    const tokens: ExtractedTokens = {
      isDarkMode,
      primaryColor,
      fontFamily,
      baseRadius,
    };

    this.cachedTokens = tokens;
    return tokens;
  }

  private resolveEffectiveBackground(el: HTMLElement | null): RGB | null {
    let curr = el;
    while (curr && curr !== document.documentElement) {
      const style = window.getComputedStyle(curr);
      const parsed = parseColor(style.backgroundColor);
      if (parsed && parsed.a > 0.8) {
        return parsed;
      }
      curr = curr.parentElement;
    }
    return { r: 15, g: 23, b: 42, a: 1 }; // Default dark slate fallback
  }

  public clearCache(): void {
    this.cachedTokens = null;
  }
}
