// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { analyzePromptText, parseDesignPrompt } from '../../src/prompt';
import type { ExtractedTokens } from '../../src/types';

describe('Prompt Parser & Natural Language Synthesis', () => {
  const mockTokens: ExtractedTokens = {
    isDarkMode: true,
    primaryColor: '#6366f1',
    fontFamily: 'sans-serif',
    baseRadius: '8px',
  };

  describe('analyzePromptText', () => {
    it('extracts color keywords accurately', () => {
      expect(analyzePromptText('emerald pill button', '#000').colorHex).toBe('#10b981');
      expect(analyzePromptText('cyan glass card', '#000').colorHex).toBe('#38bdf8');
      expect(analyzePromptText('rose gradient text', '#000').colorHex).toBe('#f43f5e');
      expect(analyzePromptText('purple neon glow', '#000').colorHex).toBe('#a855f7');
      expect(analyzePromptText('amber badge', '#000').colorHex).toBe('#f59e0b');
      expect(analyzePromptText('dark slate container', '#000').colorHex).toBe('#0f172a');
    });

    it('extracts paradigm flags', () => {
      const res = analyzePromptText('frosted glass with neon glow and gradient mesh', '#000');
      expect(res.isGlass).toBe(true);
      expect(res.isGlow).toBe(true);
      expect(res.isGradient).toBe(true);
      expect(res.isMinimal).toBe(false);

      const minimalRes = analyzePromptText('sharp clean flat outline', '#000');
      expect(minimalRes.isMinimal).toBe(true);
      expect(minimalRes.radius).toBe('0px');
    });

    it('extracts geometry and spacing modifiers', () => {
      const pill = analyzePromptText('pill oval round', '#000');
      expect(pill.radius).toBe('9999px');
      expect(pill.twRadius).toBe('rounded-full');

      const sharp = analyzePromptText('sharp square box', '#000');
      expect(sharp.radius).toBe('0px');
      expect(sharp.twRadius).toBe('rounded-none');

      const compact = analyzePromptText('compact small tight', '#000');
      expect(compact.padding).toBe('6px 12px');

      const large = analyzePromptText('large spacious big', '#000');
      expect(large.padding).toBe('14px 28px');
    });
  });

  describe('parseDesignPrompt', () => {
    it('synthesizes high-fidelity style preset for action elements', () => {
      const btn = document.createElement('button');
      const preset = parseDesignPrompt('glass cyan pill button with glow', btn, mockTokens);

      expect(preset.name).toContain('glass cyan pill button with glow');
      expect(preset.cssText).toContain('backdrop-filter: blur(12px)');
      expect(preset.cssText).toContain('border-radius: 9999px');
      expect(preset.cssText).toContain('#38bdf8');
      expect(preset.tailwindClasses).toContain('backdrop-blur-md');
      expect(preset.tailwindClasses).toContain('rounded-full');
      expect(preset.contrastRating).toBe('AAA');
    });

    it('synthesizes text-gradient preset for heading elements', () => {
      const h1 = document.createElement('h1');
      const preset = parseDesignPrompt('gradient violet headline', h1, mockTokens);

      expect(preset.cssText).toContain('-webkit-background-clip: text');
      expect(preset.cssText).toContain('-webkit-text-fill-color: transparent');
      expect(preset.tailwindClasses).toContain('bg-clip-text text-transparent');
    });

    it('synthesizes container presets for div/cards', () => {
      const div = document.createElement('div');
      const preset = parseDesignPrompt('glass card with glow', div, mockTokens);

      expect(preset.cssText).toContain('backdrop-filter: blur(16px)');
      expect(preset.cssText).toContain('box-shadow');
      expect(preset.tailwindClasses).toContain('backdrop-blur-xl');
    });

    it('accurately changes container background color when background is prompted', () => {
      const div = document.createElement('div');
      const preset = parseDesignPrompt('make the background color blue', div, mockTokens);

      expect(preset.cssText).toContain('background-color: #2563eb');
      expect(preset.cssText).toContain('color: #ffffff');
      expect(preset.tailwindClasses).toContain('bg-blue-600');
    });

    it('accurately targets border when border intent is prompted', () => {
      const div = document.createElement('div');
      const preset = parseDesignPrompt('make the border color blue', div, mockTokens);

      expect(preset.cssText).toContain('border: 2px solid #2563eb');
      expect(preset.tailwindClasses).toContain('border-2 border-blue-600');
    });

    it('accurately changes button background color to true red when prompted', () => {
      const btn = document.createElement('button');
      const preset = parseDesignPrompt('make the background color red', btn, mockTokens);

      expect(preset.cssText).toContain('background-color: #ef4444');
      expect(preset.cssText).toContain('color: #ffffff');
      expect(preset.tailwindClasses).toContain('bg-red-500 text-white');
    });

    it('accurately compiles colloquial dimensional prompt "just make it long and bigger"', () => {
      const btn = document.createElement('button');
      const preset = parseDesignPrompt('just make it long and bigger', btn, mockTokens);

      expect(preset.cssText).toContain('min-width: 240px');
      expect(preset.cssText).toContain('font-size: 1.15rem');
      expect(preset.cssText).toContain('padding: 16px 36px');
      expect(preset.tailwindClasses).toContain('px-9 py-4 text-lg');
      expect(preset.tailwindClasses).toContain('min-w-[200px]');
    });

    it('accurately compiles "make it pop with glowing shadow"', () => {
      const btn = document.createElement('button');
      const preset = parseDesignPrompt('make it pop with glowing shadow', btn, mockTokens);

      expect(preset.cssText).toContain('box-shadow: 0 8px 24px');
    });

    it('synthesizes fading glow effect and click animation on container', () => {
      const article = document.createElement('article');
      const preset = parseDesignPrompt('add a fading glow effect, add animations when clicking', article, mockTokens);

      expect(preset.cssText).toContain('box-shadow: 0 0 24px');
      expect(preset.cssText).toContain('cursor: pointer;');
      expect(preset.cssText).toContain('cubic-bezier(0.4, 0, 0.2, 1)');
      expect(preset.tailwindClasses).toContain('cursor-pointer');
      expect(preset.tailwindClasses).toContain('active:scale-95');
    });
  });
});
