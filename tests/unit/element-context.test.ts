import { describe, it, expect, beforeEach } from 'vitest';
import { collectElementContext } from '../../src/element-context';
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
});
