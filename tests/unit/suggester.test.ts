// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ActionStrategy,
  ContainerStrategy,
  TypographyStrategy,
  BadgeStrategy,
  InputStrategy,
  branchPreset,
  AuraSuggester,
  VariationDock,
} from '../../src/suggester';
import { getAiVariationCyclePresets } from '../../src/bridge-presets';
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

  it('AuraSuggester immediately provides AI variation Set 0 presets upon element selection', () => {
    const suggester = new AuraSuggester();
    const btn = document.createElement('button');
    const presets = suggester.suggest(btn, mockTokens);
    expect(presets.length).toBe(4);
    expect(presets.map((p) => p.id)).toEqual([
      'ai-cycle-0-elevated',
      'ai-cycle-0-glass',
      'ai-cycle-0-neon',
      'ai-cycle-0-brutalist',
    ]);
    expect(presets[0]?.name).toBe('AI Modern Elevated Solid');
  });

  it('BadgeStrategy supports status chips and tags', () => {
    const strategy = new BadgeStrategy();
    const tagSpan = document.createElement('span');
    tagSpan.className = 'tag';
    tagSpan.textContent = 'v1.0';

    expect(strategy.supports(tagSpan)).toBe(true);
    const presets = strategy.generatePresets(tagSpan, mockTokens);
    expect(presets.length).toBe(4);
    expect(presets[0]?.id).toBe('badge-breathing-status');
    expect(presets[0]?.hoverState).toBeDefined();
    expect(presets[0]?.activeState).toBeDefined();
  });

  it('InputStrategy supports text inputs and textareas', () => {
    const strategy = new InputStrategy();
    const input = document.createElement('input');
    input.type = 'text';
    const textarea = document.createElement('textarea');
    const btnInput = document.createElement('input');
    btnInput.type = 'submit';

    expect(strategy.supports(input)).toBe(true);
    expect(strategy.supports(textarea)).toBe(true);
    expect(strategy.supports(btnInput)).toBe(false);

    const presets = strategy.generatePresets(input, mockTokens);
    expect(presets.length).toBe(4);
    expect(presets[0]?.id).toBe('input-focus-glow');
  });

  it('branchPreset generates 4 nuanced sub-variations from a base preset', () => {
    const btn = document.createElement('button');
    const basePreset = {
      id: 'action-glass-outline',
      name: 'Frosted Glass Outline',
      description: 'Translucent glass surface with delicate alpha border',
      cssText: 'background-color: rgba(255, 255, 255, 0.08); backdrop-filter: blur(8px);',
      tailwindClasses: 'bg-white/10 backdrop-blur-md',
    };

    const branches = branchPreset(basePreset, btn, mockTokens);
    expect(branches.length).toBe(4);
    expect(branches[0]?.name).toContain('(Deep Frost)');
    expect(branches[1]?.name).toContain('(Crystal Rim)');
    expect(branches[2]?.name).toContain('(Brand Tint)');
    expect(branches[3]?.name).toContain('(Pill Contour)');

    for (const b of branches) {
      expect(b.hoverState).toBeDefined();
      expect(b.activeState).toBeDefined();
    }
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

  it('handles Live Hover-Peek (mouseenter/mouseleave) and Preset Bookmark toggling', () => {
    const onSelect = vi.fn();
    const onPeek = vi.fn();
    const onUnpeek = vi.fn();
    const onToggleBookmark = vi.fn();

    const presets = [
      {
        id: 'p1',
        name: 'Preset 1',
        description: 'Description 1',
        cssText: 'color: red;',
        tailwindClasses: 'text-red-500',
      },
    ];

    dock.render(
      presets,
      onSelect,
      undefined,
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      onPeek,
      onUnpeek,
      onToggleBookmark,
      new Set(['p1'])
    );

    const card = shadow.querySelector('.auracss-preset-card') as HTMLElement;
    expect(card).toBeDefined();
    expect(card.classList.contains('bookmarked')).toBe(true);

    // Mouseenter triggers onPeek
    card.dispatchEvent(new MouseEvent('mouseenter'));
    expect(onPeek).toHaveBeenCalledWith(presets[0]);

    // Mouseleave triggers onUnpeek
    card.dispatchEvent(new MouseEvent('mouseleave'));
    expect(onUnpeek).toHaveBeenCalled();

    // Bookmark button triggers onToggleBookmark
    const bookmarkBtn = card.querySelector('.auracss-preset-bookmark') as HTMLElement;
    expect(bookmarkBtn).toBeDefined();
    expect(bookmarkBtn.innerHTML).toBe('★');
    bookmarkBtn.click();
    expect(onToggleBookmark).toHaveBeenCalledWith(presets[0]);

    // updateBookmarks dynamically updates visual state
    dock.updateBookmarks(new Set());
    expect(card.classList.contains('bookmarked')).toBe(false);
    expect(bookmarkBtn.innerHTML).toBe('☆');
  });

  it('getAiVariationCyclePresets produces identical, deterministic IDs across repeated cycles ensuring bookmark persistence', () => {
    const cycle0First = getAiVariationCyclePresets(0, true);
    const cycle1 = getAiVariationCyclePresets(1, true);
    const cycle2 = getAiVariationCyclePresets(2, true);
    const cycle0Second = getAiVariationCyclePresets(3, true); // cycle 3 mod 3 = 0

    expect(cycle0First.map((p) => p.id)).toEqual([
      'ai-cycle-0-elevated',
      'ai-cycle-0-glass',
      'ai-cycle-0-neon',
      'ai-cycle-0-brutalist',
    ]);

    expect(cycle1.map((p) => p.id)).toEqual([
      'ai-cycle-1-sunset',
      'ai-cycle-1-clay',
      'ai-cycle-1-crimson',
      'ai-cycle-1-wire',
    ]);

    expect(cycle2.map((p) => p.id)).toEqual([
      'ai-cycle-2-emerald',
      'ai-cycle-2-obsidian',
      'ai-cycle-2-violet',
      'ai-cycle-2-hyper',
    ]);

    // Cycling back to 0 yields exact identical IDs, preserving bookmarks
    expect(cycle0First.map((p) => p.id)).toEqual(cycle0Second.map((p) => p.id));
  });

  it('handles drag-scrolling on track without permanently locking out hover-peek', async () => {
    const onPeek = vi.fn();
    const presets = [
      {
        id: 'p-drag',
        name: 'Drag Test',
        description: 'Testing drag recovery',
        cssText: 'color: green;',
        tailwindClasses: 'text-green-500',
      },
    ];

    dock.render(
      presets,
      vi.fn(),
      undefined,
      false,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      onPeek
    );

    const track = shadow.querySelector('.auracss-cards-track') as HTMLElement;
    const card = shadow.querySelector('.auracss-preset-card') as HTMLElement;

    // Simulate drag gesture
    track.dispatchEvent(new MouseEvent('mousedown', { pageX: 200, bubbles: true } as unknown as MouseEventInit));
    window.dispatchEvent(new MouseEvent('mousemove', { pageX: 100, bubbles: true } as unknown as MouseEventInit));
    window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    // Wait 60ms for synthetic drag suppression timeout to clear
    await new Promise((resolve) => setTimeout(resolve, 60));

    // Hover-peek should work immediately without needing a card click
    card.dispatchEvent(new MouseEvent('mouseenter'));
    expect(onPeek).toHaveBeenCalledWith(presets[0]);
  });
});
