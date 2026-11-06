// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { AuraHarvester, calculateLuminance, parseColor } from '../../src/harvester';

describe('AuraHarvester (Color Math & Landmark Token Sampling)', () => {
  let harvester: AuraHarvester;

  beforeEach(() => {
    document.body.innerHTML = '';
    harvester = new AuraHarvester();
  });

  describe('parseColor', () => {
    it('correctly parses rgb and rgba strings', () => {
      expect(parseColor('rgb(255, 128, 0)')).toEqual({ r: 255, g: 128, b: 0, a: 1 });
      expect(parseColor('rgba(10, 20, 30, 0.5)')).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
    });

    it('correctly parses 3, 4, 6, and 8 digit hex colors', () => {
      expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
      expect(parseColor('#000000')).toEqual({ r: 0, g: 0, b: 0, a: 1 });
      expect(parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    });

    it('returns null for transparent, inherit, or invalid strings', () => {
      expect(parseColor('transparent')).toBeNull();
      expect(parseColor('inherit')).toBeNull();
      expect(parseColor('')).toBeNull();
      expect(parseColor('not-a-color')).toBeNull();
    });
  });

  describe('calculateLuminance', () => {
    it('computes 0 for black and 1 for white', () => {
      expect(calculateLuminance({ r: 0, g: 0, b: 0, a: 1 })).toBe(0);
      expect(calculateLuminance({ r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(1, 4);
    });

    it('computes ITU-R BT.709 sRGB relative luminance weights', () => {
      // Pure Green has the highest luminance contribution (~0.7152)
      const greenLum = calculateLuminance({ r: 0, g: 255, b: 0, a: 1 });
      const redLum = calculateLuminance({ r: 255, g: 0, b: 0, a: 1 });
      const blueLum = calculateLuminance({ r: 0, g: 0, b: 255, a: 1 });

      expect(greenLum).toBeGreaterThan(redLum);
      expect(redLum).toBeGreaterThan(blueLum);
      expect(greenLum).toBeCloseTo(0.7152, 2);
    });
  });

  describe('harvest', () => {
    it('samples high-signal landmarks and extracts ambient tokens', () => {
      document.body.style.backgroundColor = 'rgb(15, 23, 42)'; // Dark background

      const btn = document.createElement('button');
      btn.className = 'btn-primary';
      btn.style.backgroundColor = 'rgb(79, 70, 229)'; // Saturated indigo
      btn.style.fontFamily = 'Inter, sans-serif';
      btn.style.borderRadius = '12px';
      document.body.appendChild(btn);

      const tokens = harvester.harvest(true);

      expect(tokens.isDarkMode).toBe(true);
      expect(tokens.primaryColor).toBe('rgb(79, 70, 229)');
      expect(tokens.fontFamily).toBe('Inter');
      expect(tokens.baseRadius).toBe('12px');
    });

    it('samples at most 50 landmarks without traversing full deep DOM', () => {
      for (let i = 0; i < 70; i++) {
        const btn = document.createElement('button');
        btn.textContent = `Btn ${i}`;
        document.body.appendChild(btn);
      }

      const tokens = harvester.harvest(true);
      expect(tokens).toBeDefined();
      expect(tokens.primaryColor).toBeDefined();
    });
  });
});
