// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuraCSSApp } from '../../src/main';

describe('Variation Selection & Deselection Mechanics', () => {
  let app: AuraCSSApp;
  let testEl: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    testEl = document.createElement('button');
    testEl.id = 'target-btn';
    testEl.textContent = 'Target Button';
    document.body.appendChild(testEl);

    app = new AuraCSSApp();
    app.init();
    app.activate();
  });

  afterEach(() => {
    app.destroy();
  });

  it('allows clicking an active preset card to toggle and deselect it', async () => {
    testEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    const cards = shadow?.querySelectorAll('.auracss-preset-card') as NodeListOf<HTMLElement>;
    const firstCard = cards[0]!;

    // 1. First Click -> Selects preset
    firstCard.click();
    expect(firstCard.classList.contains('active')).toBe(true);
    expect(testEl.style.cssText).not.toBe('');

    // 2. Second Click on same card -> Deselects preset
    firstCard.click();
    expect(firstCard.classList.contains('active')).toBe(false);
    expect(testEl.style.cssText).toBe('');

    // 3. Third Click -> Re-selects preset
    firstCard.click();
    expect(firstCard.classList.contains('active')).toBe(true);
    expect(testEl.style.cssText).not.toBe('');
  });

  it('preserves the active dock presets when clicking Revert', async () => {
    testEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    const cardsBefore = shadow?.querySelectorAll('.auracss-preset-name');
    const firstCardTitle = cardsBefore?.[0]?.textContent;

    // Click first card
    const firstCard = shadow?.querySelectorAll('.auracss-preset-card')?.[0] as HTMLElement;
    firstCard.click();

    // Click Revert button
    const revertBtn = shadow?.querySelector('.auracss-preset-reset') as HTMLElement;
    expect(revertBtn).not.toBeNull();
    revertBtn.click();

    // Element is unstyled
    expect(testEl.style.cssText).toBe('');

    // Dock presets are preserved
    const cardsAfter = shadow?.querySelectorAll('.auracss-preset-name');
    expect(cardsAfter?.[0]?.textContent).toBe(firstCardTitle);
  });

  it('preserves AI variation cards in the dock when selecting and deselecting a variation', async () => {
    testEl.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = document.getElementById('auracss-root')?.shadowRoot;

    // Simulate AI variations arriving in the dock
    const aiPresets = [
      { id: 'ai-var-1', name: 'AI Sunset Flame', description: 'Warm sunset gradient', cssText: 'background: orange;', tailwindClasses: 'bg-orange-500' },
      { id: 'ai-var-2', name: 'AI Frosted Glass', description: 'Translucent glass', cssText: 'background: rgba(255,255,255,0.1);', tailwindClasses: 'bg-white/10' },
      { id: 'ai-var-3', name: 'AI Cyberpunk Emerald', description: 'High contrast emerald', cssText: 'background: #022c22;', tailwindClasses: 'bg-emerald-950' },
      { id: 'ai-var-4', name: 'AI Obsidian Void', description: 'Deep obsidian', cssText: 'background: #020617;', tailwindClasses: 'bg-slate-950' },
    ];

    (app as unknown as { renderDock: (el: HTMLElement, p: unknown[], isMod: boolean, setIdx: number) => void }).renderDock(
      testEl,
      aiPresets,
      false,
      0
    );

    let cards = shadow?.querySelectorAll('.auracss-preset-card') as NodeListOf<HTMLElement>;
    let titles = shadow?.querySelectorAll('.auracss-preset-name') as NodeListOf<HTMLElement>;
    expect(titles[0]!.textContent).toBe('AI Sunset Flame');
    expect(titles[1]!.textContent).toBe('AI Frosted Glass');

    // 1. Select Card 0 -> It should apply style, become active, AND cards must NOT reset to default suggester
    cards[0]!.click();
    expect(cards[0]!.classList.contains('active')).toBe(true);
    expect(testEl.style.cssText).toContain('background: orange');

    // Re-query cards after re-render caused by commitStyleChange
    cards = shadow?.querySelectorAll('.auracss-preset-card') as NodeListOf<HTMLElement>;
    titles = shadow?.querySelectorAll('.auracss-preset-name') as NodeListOf<HTMLElement>;
    expect(titles[0]!.textContent).toBe('AI Sunset Flame');
    expect(titles[1]!.textContent).toBe('AI Frosted Glass');
    expect(titles[2]!.textContent).toBe('AI Cyberpunk Emerald');
    expect(titles[3]!.textContent).toBe('AI Obsidian Void');
    expect(cards[0]!.classList.contains('active')).toBe(true);

    // 2. Click Card 1 -> Switches selection to Card 1
    cards[1]!.click();
    expect(testEl.style.cssText).toContain('rgba(255, 255, 255, 0.1)');

    cards = shadow?.querySelectorAll('.auracss-preset-card') as NodeListOf<HTMLElement>;
    titles = shadow?.querySelectorAll('.auracss-preset-name') as NodeListOf<HTMLElement>;
    expect(titles[0]!.textContent).toBe('AI Sunset Flame');
    expect(cards[1]!.classList.contains('active')).toBe(true);
    expect(cards[0]!.classList.contains('active')).toBe(false);

    // 3. Click Card 1 again -> Deselects and reverts, cards STILL preserved
    cards[1]!.click();
    expect(testEl.style.cssText).toBe('');

    cards = shadow?.querySelectorAll('.auracss-preset-card') as NodeListOf<HTMLElement>;
    titles = shadow?.querySelectorAll('.auracss-preset-name') as NodeListOf<HTMLElement>;
    expect(titles[0]!.textContent).toBe('AI Sunset Flame');
    expect(cards[1]!.classList.contains('active')).toBe(false);
  });
});
