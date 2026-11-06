// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import {
  computeContrastRatio,
  getContrastRating,
  autoCorrectContrast,
  formatContrastLabel,
} from '../../src/a11y';

describe('WCAG 2.2 Contrast & Accessibility Engine (a11y)', () => {
  const white = { r: 255, g: 255, b: 255, a: 1 };
  const black = { r: 0, g: 0, b: 0, a: 1 };
  const darkSlate = { r: 15, g: 23, b: 42, a: 1 };
  const lowContrastGray = { r: 40, g: 45, b: 55, a: 1 };

  it('computes 21:1 for pure black on pure white', () => {
    const ratio = computeContrastRatio(black, white);
    expect(ratio).toBeCloseTo(21, 0);
    expect(formatContrastLabel(ratio)).toBe('21.0:1');
  });

  it('computes 1:1 for identical colors', () => {
    const ratio = computeContrastRatio(white, white);
    expect(ratio).toBeCloseTo(1, 1);
  });

  it('evaluates AAA, AA, and FAIL ratings according to WCAG 2.2 thresholds', () => {
    expect(getContrastRating(8.5)).toBe('AAA');
    expect(getContrastRating(7.0)).toBe('AAA');
    expect(getContrastRating(4.6)).toBe('AA');
    expect(getContrastRating(4.5)).toBe('AA');
    expect(getContrastRating(3.5)).toBe('FAIL');
    expect(getContrastRating(3.5, true)).toBe('AA'); // large text
  });

  it('auto-corrects low contrast foreground colors to satisfy WCAG AA (>= 4.5)', () => {
    // lowContrastGray on darkSlate has a very poor ratio
    const initialRatio = computeContrastRatio(lowContrastGray, darkSlate);
    expect(initialRatio).toBeLessThan(4.5);

    const correctedFg = autoCorrectContrast(lowContrastGray, darkSlate, 4.5);
    const correctedRatio = computeContrastRatio(correctedFg, darkSlate);

    expect(correctedRatio).toBeGreaterThanOrEqual(4.5);
  });
});
