// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ActionStrategy,
  ContainerStrategy,
  TypographyStrategy,
  AuraSuggester,
  VariationDock,
} from '../../src/suggester';
import type { ExtractedTokens } from '../../src/types';

describe('AuraSuggester & Strategies (Design Variation Synthesis)', () => {
  const mockTokens: ExtractedTokens = {
    isDarkMode: true,
    primaryColor: 'rgb(79, 70, 229)',
    fontFamily: 'Inter',
    baseRadius: '10px',
  };

  it('ActionStrategy supports buttons/links and yields 4 distinct presets', () => {
    const strategy = new ActionStrategy();
    const btn = document.createElement('button');
    const link = document.createElement('a');
    const div = document.createElement('div');

    expect(strategy.supports(btn)).toBe(true);
    expect(strategy.supports(link)).toBe(true);
    expect(strategy.supports(div)).toBe(false);

    const presets = strategy.generatePresets(btn, mockTokens);
    expect(presets.length).toBe(4);
    expect(presets.map((p) => p.id)).toEqual([
      'action-modern-primary',
      'action-glass-outline',
      'action-ambient-glow',
      'action-subtle-ghost',
    ]);

    for (const preset of presets) {
      expect(preset.cssText).toContain('border-radius: 10px');
      expect(preset.tailwindClasses.length).toBeGreaterThan(0);
    }
  });

  it('ContainerStrategy supports containers and yields 4 distinct presets', () => {
    const strategy = new ContainerStrategy();
    const section = document.createElement('section');
    const card = document.createElement('div');
    card.className = 'card';

    expect(strategy.supports(section)).toBe(true);
    expect(strategy.supports(card)).toBe(true);

    const presets = strategy.generatePresets(section, mockTokens);
    expect(presets.length).toBe(4);
    expect(presets[0]?.id).toBe('container-elevated-card');
    expect(presets[1]?.id).toBe('container-frosted-glass');
    expect(presets[2]?.id).toBe('container-ambient-glow');
    expect(presets[3]?.id).toBe('container-flat-minimal');
  });

  it('TypographyStrategy distinguishes headings from body copy', () => {
    const strategy = new TypographyStrategy();
    const h1 = document.createElement('h1');
    const p = document.createElement('p');

    expect(strategy.supports(h1)).toBe(true);
    expect(strategy.supports(p)).toBe(true);

    const h1Presets = strategy.generatePresets(h1, mockTokens);
    expect(h1Presets.length).toBe(4);
    expect(h1Presets[0]?.id).toBe('text-gradient-hero');

    const pPresets = strategy.generatePresets(p, mockTokens);
    expect(pPresets.length).toBe(4);
    expect(pPresets[0]?.id).toBe('text-body-high-contrast');
  });

  it('AuraSuggester routes element to proper strategy', () => {
    const suggester = new AuraSuggester();
    const btn = document.createElement('button');
    const presets = suggester.suggest(btn, mockTokens);
    expect(presets[0]?.id).toBe('action-modern-primary');
  });
});

describe('VariationDock (Interactive Selection in Shadow DOM)', () => {
  let dock: VariationDock;
  let shadow: ShadowRoot;

  beforeEach(() => {
    document.body.innerHTML = '';
    const host = document.createElement('div');
    shadow = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);

    dock = new VariationDock();
    dock.mount(shadow);
  });

  it('renders preset cards into shadow root and handles selection', () => {
    const onSelect = vi.fn();
    const presets = [
      {
        id: 'p1',
        name: 'Preset 1',
        description: 'Description 1',
        cssText: 'color: red;',
        tailwindClasses: 'text-red-500',
      },
      {
        id: 'p2',
        name: 'Preset 2',
        description: 'Description 2',
        cssText: 'color: blue;',
        tailwindClasses: 'text-blue-500',
      },
    ];

    dock.render(presets, onSelect);

    const dockEl = shadow.querySelector('.auracss-variation-dock');
    expect(dockEl?.classList.contains('visible')).toBe(true);

    const cards = shadow.querySelectorAll('.auracss-preset-card');
    expect(cards.length).toBe(2);

    (cards[1] as HTMLElement).click();
    expect(onSelect).toHaveBeenCalledWith(presets[1]);
    expect(cards[1]?.classList.contains('active')).toBe(true);
  });
});
