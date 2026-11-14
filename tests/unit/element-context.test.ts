import { describe, it, expect, beforeEach } from 'vitest';
import { collectElementContext, getUniqueSelector } from '../../src/element-context';
import { isIconOrMediaElement, getIconVariationCyclePresets } from '../../src/icon-presets';
import { classifyElement } from '../../src/element-classifier';
import { getArchetypeVariationPresets } from '../../src/archetype-presets';
import { parseDesignPrompt } from '../../src/prompt';
import { injectLiveRules, clearLiveRules } from '../../src/style-mutator';
import { applyBridgePayloadHelper } from '../../src/main-actions';
import { CommandHistory } from '../../src/command';
import { OverlayManager } from '../../src/overlay';
import { VariationDock } from '../../src/suggester';

describe('collectElementContext', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('captures role, innerText, computedStyles, parentLayout, and childSummary', () => {
    const header = document.createElement('header');
    header.style.display = 'flex';
    header.style.flexDirection = 'row';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.gap = '16px';
    header.style.backgroundColor = 'rgb(15, 23, 42)';

    const btn = document.createElement('button');
    btn.textContent = '  Get   Started  ';
    btn.style.color = 'rgb(255, 255, 255)';
    btn.style.padding = '10px 20px';
    btn.style.borderRadius = '8px';

    const sibling = document.createElement('a');
    sibling.textContent = 'Docs';
    header.append(btn, sibling);
    document.body.appendChild(header);

    const ctx = collectElementContext(btn);
    expect(ctx.tag).toBe('button');
    expect(ctx.role).toBe('interactive button');
    expect(ctx.innerText).toBe('Get Started');
    expect(ctx.childSummary).toBe('text-only');
    expect(ctx.computedStyles.color).toBe('rgb(255, 255, 255)');
    expect(ctx.computedStyles.borderRadius).toBe('8px');
    expect(ctx.parentLayout).toContain('<header>');
    expect(ctx.parentLayout).toContain('display: flex');
    expect(ctx.parentLayout).toContain('siblings: 1');
    expect(ctx.effectiveBackground.isDark).toBe(true);
  });

  it('strips noisy data-attributes and long SVG paths from htmlSnippet and summarizes children', () => {
    const card = document.createElement('div');
    card.setAttribute('data-testid', 'pricing-card-123');
    card.innerHTML = `
      <h3>Pro Plan</h3>
      <p>Everything included</p>
      <svg><path d="M10 10 L20 20 L30 30 L40 40 L50 50 L60 60 L70 70 Z"></path></svg>
    `;
    document.body.appendChild(card);

    const ctx = collectElementContext(card);
    expect(ctx.role).toBe('card / container');
    expect(ctx.childSummary).toBe('1 <h3>, 1 <p>, 1 <svg>');
    expect(ctx.htmlSnippet).not.toContain('data-testid');
    expect(ctx.htmlSnippet).toContain('d="..."');
  });

  it('falls back to light surface when no opaque ancestor background exists', () => {
    const span = document.createElement('span');
    span.textContent = 'Badge';
    document.body.appendChild(span);

    const ctx = collectElementContext(span);
    expect(ctx.effectiveBackground).toEqual({ color: 'rgb(255, 255, 255)', isDark: false });
  });
});

describe('live rules & malformed selector resilience', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    clearLiveRules();
  });

  it('preserves :hover/:active rules across different selectors instead of overwriting', () => {
    injectLiveRules('.btn-a', { hoverState: 'opacity: 0.9;' });
    injectLiveRules('.btn-b', { activeState: 'transform: scale(0.95);' });

    const styleEl = document.getElementById('auracss-live-rules');
    expect(styleEl?.textContent).toContain('.btn-a:hover');
    expect(styleEl?.textContent).toContain('.btn-b:active');
    expect(styleEl?.textContent).toContain('!important');
  });

  it('does not throw when applyBridgePayloadHelper receives a malformed selector', () => {
    expect(() =>
      applyBridgePayloadHelper(
        { cssText: 'color: red;', selector: 'button.bg-[#fff]:invalid((' },
        {
          lockedElement: null,
          lockElement: () => {},
          savedPromptedStyles: new WeakMap(),
          presetContext: {
            stylePatches: new WeakMap(),
            activePresetIdMap: new WeakMap(),
            commandHistory: new CommandHistory(),
            variationDock: new VariationDock(),
            overlay: new OverlayManager(),
            updateLedgerCount: () => {},
            refreshDock: () => {},
          },
        }
      )
    ).not.toThrow();
  });

  it('generates DOM-unique selectors for elements sharing atomic classes like Facebook', () => {
    const wrapper = document.createElement('div');
    const card1 = document.createElement('div');
    card1.className = 'x9f619 x1ja2u2z';
    const card2 = document.createElement('div');
    card2.className = 'x9f619 x1ja2u2z';
    wrapper.append(card1, card2);
    document.body.appendChild(wrapper);

    const sel1 = getUniqueSelector(card1);
    const sel2 = getUniqueSelector(card2);
    expect(sel1).not.toBe(sel2);
    expect(document.querySelectorAll(sel1)).toHaveLength(1);
    expect(document.querySelectorAll(sel2)).toHaveLength(1);
    expect(document.querySelector(sel1)).toBe(card1);
    expect(document.querySelector(sel2)).toBe(card2);
  });

  it('detects img/svg/emoji elements and serves filter/transform icon presets instead of card padding', () => {
    const img = document.createElement('img');
    const emoji = document.createElement('span');
    emoji.textContent = '🔥';
    const box = document.createElement('div');
    box.textContent = 'Regular Card';

    expect(isIconOrMediaElement(img)).toBe(true);
    expect(isIconOrMediaElement(emoji)).toBe(true);
    expect(isIconOrMediaElement(box)).toBe(false);

    const cycle0 = getIconVariationCyclePresets(0);
    const cycle1 = getIconVariationCyclePresets(1);
    expect(cycle0).toHaveLength(4);
    expect(cycle0[2]!.cssText).toContain('drop-shadow');
    expect(cycle0[0]!.cssText).not.toContain('padding: 24px');
    expect(cycle1[0]!.cssText).toContain('hue-rotate');
  });

  it('classifies all 8 element archetypes and adapts both variations and offline prompts', () => {
    const h1 = document.createElement('h1');
    h1.textContent = 'Hero Title';
    const input = document.createElement('input');
    const badge = document.createElement('span');
    badge.textContent = 'New';
    const prose = document.createElement('p');
    prose.textContent = 'This is a longer paragraph of readable body copy for testing.';
    const btn = document.createElement('button');
    btn.textContent = 'Click';
    const card = document.createElement('section');
    card.innerHTML = '<div>A</div><div>B</div>';
    const img = document.createElement('img');

    expect(classifyElement(h1)).toBe('heading-title');
    expect(classifyElement(input)).toBe('input-control');
    expect(classifyElement(badge)).toBe('badge-pill');
    expect(classifyElement(prose)).toBe('text-prose');
    expect(classifyElement(btn)).toBe('button-action');
    expect(classifyElement(card)).toBe('card-container');
    expect(classifyElement(img)).toBe('icon-emoji');

    expect(getArchetypeVariationPresets('heading-title', 0)[0]!.cssText).toContain('-webkit-background-clip: text');
    expect(getArchetypeVariationPresets('input-control', 0)[0]!.cssText).toContain('outline: none');
    expect(getArchetypeVariationPresets('badge-pill', 0)[0]!.cssText).toContain('border-radius: 9999px');
    expect(getArchetypeVariationPresets('text-prose', 0)[0]!.cssText).toContain('line-height: 1.65');

    const iconPrompt = parseDesignPrompt('make it glow cyan', img, {
      isDarkMode: true,
      primaryColor: '#38bdf8',
      fontFamily: 'Inter',
      baseRadius: '8px',
    });
    expect(iconPrompt.cssText).toContain('drop-shadow');
  });
});
