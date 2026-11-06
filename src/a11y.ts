import { calculateLuminance, type RGB } from './harvester';

export function computeContrastRatio(fg: RGB, bg: RGB): number {
  const l1 = calculateLuminance(fg);
  const l2 = calculateLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function getContrastRating(ratio: number, isLargeText = false): 'AAA' | 'AA' | 'FAIL' {
  if (ratio >= 7.0) return 'AAA';
  if (isLargeText ? ratio >= 3.0 : ratio >= 4.5) return 'AA';
  return 'FAIL';
}

/**
 * Adjusts foreground color lightness toward pure white or pure black
 * to reach target contrast ratio (default: 4.5 for WCAG AA).
 */
export function autoCorrectContrast(fg: RGB, bg: RGB, targetRatio = 4.5): RGB {
  const currentRatio = computeContrastRatio(fg, bg);
  if (currentRatio >= targetRatio) {
    return fg;
  }

  const bgLum = calculateLuminance(bg);
  // If background is dark (lum < 0.5), shift toward white; otherwise shift toward black
  const targetChannel = bgLum < 0.5 ? 255 : 0;
  let adjusted: RGB = { ...fg };

  for (let step = 1; step <= 20; step++) {
    const factor = step / 20;
    adjusted = {
      r: Math.round(fg.r + (targetChannel - fg.r) * factor),
      g: Math.round(fg.g + (targetChannel - fg.g) * factor),
      b: Math.round(fg.b + (targetChannel - fg.b) * factor),
      a: fg.a,
    };

    if (computeContrastRatio(adjusted, bg) >= targetRatio) {
      break;
    }
  }

  return adjusted;
}

export function formatContrastLabel(ratio: number): string {
  return `${ratio.toFixed(1)}:1`;
}
