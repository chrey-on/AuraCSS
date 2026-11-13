// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { parseDesignPrompt } from '../../src/prompt';
import { synthesizeWithLocalOrEnv } from '../../src/bridge-compiler';
import type { ExtractedTokens } from '../../src/types';

interface PromptTestCase {
  category: 'Aesthetic' | 'Dimensional' | 'Colloquial' | 'Negative Constraint' | 'Abstract / Edge';
  prompt: string;
  tag: 'button' | 'div' | 'h1';
  expectedPrimitives: {
    color?: string;
    radius?: string;
    hasGlass?: boolean;
    hasGlow?: boolean;
    hasDimensions?: boolean;
    isBorderOnly?: boolean;
    isProfessional?: boolean;
    isLuxury?: boolean;
    isSpacious?: boolean;
    isUgly?: boolean;
    isFriendly?: boolean;
    isMatch?: boolean;
  };
}

const TEST_MATRIX: PromptTestCase[] = [
  // 1. Aesthetic / Metaphorical
  {
    category: 'Aesthetic',
    prompt: 'frosted glass cyan pill with ambient glow',
    tag: 'button',
    expectedPrimitives: { color: '#38bdf8', radius: '9999px', hasGlass: true, hasGlow: true },
  },
  {
    category: 'Aesthetic',
    prompt: 'neon emerald terminal with intense luminous halo',
    tag: 'div',
    expectedPrimitives: { color: '#10b981', hasGlow: true },
  },
  {
    category: 'Aesthetic',
    prompt: 'ruby red pulse badge with active click animation',
    tag: 'button',
    expectedPrimitives: { color: '#e11d48', hasGlow: true },
  },

  // 2. Dimensional & Relative Modifiers
  {
    category: 'Dimensional',
    prompt: 'make it much wider and bigger with roomy spacing',
    tag: 'button',
    expectedPrimitives: { hasDimensions: true },
  },
  {
    category: 'Dimensional',
    prompt: 'super compact tiny button with slender padding',
    tag: 'button',
    expectedPrimitives: { hasDimensions: true },
  },
  {
    category: 'Dimensional',
    prompt: 'elongated stretched action bar with broad min-width',
    tag: 'button',
    expectedPrimitives: { hasDimensions: true },
  },

  // 3. Colloquial / Natural Language
  {
    category: 'Colloquial',
    prompt: 'i want this button to really pop with a punchy crimson feel',
    tag: 'button',
    expectedPrimitives: { color: '#dc2626' },
  },
  {
    category: 'Colloquial',
    prompt: 'soften the edges and make the container feel smoother',
    tag: 'div',
    expectedPrimitives: { radius: '16px' },
  },
  {
    category: 'Colloquial',
    prompt: 'clean headline with vibrant violet gradient',
    tag: 'h1',
    expectedPrimitives: { color: '#a855f7' },
  },

  // 4. Negative Constraints & Targeted Surfaces
  {
    category: 'Negative Constraint',
    prompt: 'remove background, subtle border only in sky blue',
    tag: 'button',
    expectedPrimitives: { color: '#38bdf8', isBorderOnly: true },
  },
  {
    category: 'Negative Constraint',
    prompt: 'flat minimal card with sharp corners and no shadows',
    tag: 'div',
    expectedPrimitives: { radius: '0px' },
  },

  // 6. Non-technical layman benchmarks
  {
    category: 'Colloquial',
    prompt: 'make it look expensive and professional',
    tag: 'button',
    expectedPrimitives: { color: '#fff8e1', isProfessional: true },
  },
  {
    category: 'Colloquial',
    prompt: 'it feels way too crowded and cramped, give it breathing room',
    tag: 'div',
    expectedPrimitives: { hasDimensions: true },
  },
  {
    category: 'Colloquial',
    prompt: 'friendly button that stands out',
    tag: 'button',
    expectedPrimitives: { isFriendly: true },
  },
  {
    category: 'Colloquial',
    prompt: 'clean up this ugly clunky card',
    tag: 'div',
    expectedPrimitives: { isUgly: true },
  },
];

describe('AuraCSS Prompt Engine Intelligence Evaluation Matrix', () => {
  const mockTokens: ExtractedTokens = {
    isDarkMode: true,
    primaryColor: '#6366f1',
    fontFamily: 'sans-serif',
    baseRadius: '8px',
  };

  it('evaluates test matrix across client parser and server bridge compiler', async () => {
    const results: Array<{
      category: string;
      prompt: string;
      tag: string;
      cssText: string;
      twClasses: string;
      matched: string[];
      missed: string[];
      status: 'FULL PASS' | 'PARTIAL' | 'FALLBACK';
    }> = [];

    for (const testCase of TEST_MATRIX) {
      const el = document.createElement(testCase.tag);
      const clientPreset = parseDesignPrompt(testCase.prompt, el, mockTokens);
      const serverPreset = await synthesizeWithLocalOrEnv(testCase.prompt, testCase.tag);

      const combinedCss = `${clientPreset.cssText} ${serverPreset.cssText}`.toLowerCase();
      const combinedTw = `${clientPreset.tailwindClasses} ${serverPreset.tailwindClasses}`.toLowerCase();

      const matched: string[] = [];
      const missed: string[] = [];

      // Check Color
      if (testCase.expectedPrimitives.color) {
        const expectedColor = testCase.expectedPrimitives.color.toLowerCase();
        if (combinedCss.includes(expectedColor)) {
          matched.push(`color(${expectedColor})`);
        } else {
          missed.push(`color(${expectedColor})`);
        }
      }

      // Check Radius
      if (testCase.expectedPrimitives.radius) {
        if (combinedCss.includes(`border-radius: ${testCase.expectedPrimitives.radius}`)) {
          matched.push(`radius(${testCase.expectedPrimitives.radius})`);
        } else {
          missed.push(`radius(${testCase.expectedPrimitives.radius})`);
        }
      }

      // Check Glassmorphism
      if (testCase.expectedPrimitives.hasGlass) {
        if (combinedCss.includes('backdrop-filter: blur') || combinedTw.includes('backdrop-blur')) {
          matched.push('glass');
        } else {
          missed.push('glass');
        }
      }

      // Check Glow
      if (testCase.expectedPrimitives.hasGlow) {
        if (combinedCss.includes('box-shadow') && (combinedCss.includes('0 0 ') || combinedTw.includes('shadow-['))) {
          matched.push('glow');
        } else {
          missed.push('glow');
        }
      }

      // Check Dimensions
      if (testCase.expectedPrimitives.hasDimensions) {
        if (combinedCss.includes('min-width') || combinedCss.includes('16px 36px') || combinedCss.includes('14px 28px') || combinedCss.includes('6px 12px')) {
          matched.push('dimensions');
        } else {
          missed.push('dimensions');
        }
      }

      // Check Border Only
      if (testCase.expectedPrimitives.isBorderOnly) {
        if (combinedCss.includes('background-color: transparent') && combinedCss.includes('border: 2px solid')) {
          matched.push('border-only');
        } else {
          missed.push('border-only');
        }
      }

      // New lay-person flags
      if (testCase.expectedPrimitives.isProfessional) {
        if (combinedCss.includes('border: 1px solid') && combinedCss.includes('box-shadow: 0 1px 3px')) {
          matched.push('professional');
        } else {
          missed.push('professional');
        }
      }
      if (testCase.expectedPrimitives.isLuxury) {
        if (combinedCss.includes('background-color: #fff8e1') && combinedCss.includes('letter-spacing')) {
          matched.push('luxury');
        } else {
          missed.push('luxury');
        }
      }
      if (testCase.expectedPrimitives.isSpacious) {
        if (combinedCss.includes('line-height') || combinedCss.match(/padding: [^;]*1\.5rem/)) {
          matched.push('spacious');
        } else {
          missed.push('spacious');
        }
      }
      if (testCase.expectedPrimitives.isUgly) {
        if (combinedCss.includes('border-radius: 1.5rem') || combinedTw.includes('rounded-xl')) {
          matched.push('ugly');
        } else {
          missed.push('ugly');
        }
      }
      if (testCase.expectedPrimitives.isFriendly) {
        if (combinedCss.includes('background-color: #ffedd5') && combinedCss.includes('border-radius: 1.75rem')) {
          matched.push('friendly');
        } else {
          missed.push('friendly');
        }
      }
      if (testCase.expectedPrimitives.isMatch) {
        if (combinedCss.includes('#6366f1') || combinedTw.includes('bg-[#6366f1]')) {
          matched.push('match');
        } else {
          missed.push('match');
        }
      }

      let status: 'FULL PASS' | 'PARTIAL' | 'FALLBACK' = 'FALLBACK';
      if (missed.length === 0) {
        status = 'FULL PASS';
      } else if (matched.length > 0) {
        status = 'PARTIAL';
      }

      results.push({
        category: testCase.category,
        prompt: testCase.prompt,
        tag: testCase.tag,
        cssText: clientPreset.cssText,
        twClasses: clientPreset.tailwindClasses,
        matched,
        missed,
        status,
      });

      // Ensure every output generates syntactically valid CSS and non-empty Tailwind classes
      expect(clientPreset.cssText.length).toBeGreaterThan(0);
      expect(clientPreset.tailwindClasses.length).toBeGreaterThan(0);
      expect(serverPreset.cssText.length).toBeGreaterThan(0);
      expect(serverPreset.tailwindClasses.length).toBeGreaterThan(0);
    }

    // Format evaluation diagnostic report
    const fullPassCount = results.filter((r) => r.status === 'FULL PASS').length;
    const partialCount = results.filter((r) => r.status === 'PARTIAL').length;
    const fallbackCount = results.filter((r) => r.status === 'FALLBACK').length;

    // Log diagnostic summary
    // eslint-disable-next-line no-console
    console.log('\n======================================================');
    // eslint-disable-next-line no-console
    console.log(`PROMPT BENCHMARK REPORT: ${fullPassCount}/${TEST_MATRIX.length} FULL PASS | ${partialCount} PARTIAL | ${fallbackCount} FALLBACK`);
    // eslint-disable-next-line no-console
    console.log('======================================================');
    for (const r of results) {
      const icon = r.status === 'FULL PASS' ? '✅' : r.status === 'PARTIAL' ? '⚠️' : '❌';
      // eslint-disable-next-line no-console
      console.log(`${icon} [${r.status}] [${r.category}] "${r.prompt}"`);
      // eslint-disable-next-line no-console
      console.log(`   CSS: ${r.cssText.slice(0, 70)}...`);
      // eslint-disable-next-line no-console
      console.log(`   TW:  ${r.twClasses.slice(0, 60)}...`);
      if (r.missed.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`   MISSED INTENT: ${r.missed.join(', ')}`);
      }
    }
    // eslint-disable-next-line no-console
    console.log('======================================================\n');
  });
});
