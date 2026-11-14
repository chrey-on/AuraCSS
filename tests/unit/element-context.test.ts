import { describe, it, expect, beforeEach } from 'vitest';
import { collectElementContext, getUniqueSelector } from '../../src/element-context';
import { isIconOrMediaElement, getIconVariationCyclePresets } from '../../src/icon-presets';
import { classifyElement } from '../../src/element-classifier';
import { getArchetypeVariationPresets } from '../../src/archetype-presets';
import { parseDesignPrompt } from '../../src/prompt';
import { injectLiveRules, clearLiveRules } from '../../src/style-mutator';
import { applyBridgePayloadHelper, handleAISuggestionsHelper } from '../../src/main-actions';
import { peekPresetHelper, applyPresetHelper, revertElementHelper } from '../../src/main-presets';
import { AIService } from '../../src/ai';
import { AISettingsModal } from '../../src/ai-modal';
import { AuraHarvester } from '../../src/harvester';
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

  it('cycles all 3 AI variation sets (1/3 -> 2/3 -> 3/3 -> 1/3) using the selected element archetype consistently', async () => {
    const img = document.createElement('img');
    document.body.appendChild(img);

    const aiService = new AIService();
    const aiModal = new AISettingsModal(aiService);
    const harvester = new AuraHarvester();
    const variationCycleMap = new WeakMap<HTMLElement, number>();
    variationCycleMap.set(img, 0);

    const renderedSets: Array<{ setIndex?: number; ids: string[]; css: string[] }> = [];
    const ctx = {
      aiService,
      aiModal,
      variationCycleMap,
      harvester,
      isModified: false,
      renderDock: (_el: HTMLElement, presets: Array<{ id: string; cssText: string }>, _mod: boolean, setIndex?: number) => {
        renderedSets.push({
          setIndex,
          ids: presets.map((p) => p.id),
          css: presets.map((p) => p.cssText),
        });
      },
      refreshDock: () => {},
    };

    // 1/3 (0) -> 2/3 (1) -> 3/3 (2) -> back to 1/3 (0)
    await handleAISuggestionsHelper(img, ctx);
    await handleAISuggestionsHelper(img, ctx);
    await handleAISuggestionsHelper(img, ctx);

    expect(renderedSets).toHaveLength(3);
    expect(renderedSets[0]!.setIndex).toBe(1);
    expect(renderedSets[1]!.setIndex).toBe(2);
    expect(renderedSets[2]!.setIndex).toBe(0);

    // Every single preset across 2/3, 3/3, and back to 1/3 is an icon preset (ai-icon-*) with filter:, never a background box
    for (const batch of renderedSets) {
      for (const id of batch.ids) {
        expect(id).toMatch(/^ai-icon-/);
      }
      for (const css of batch.css) {
        expect(css).toContain('filter:');
        expect(css).not.toContain('background-color:');
      }
    }
    expect(renderedSets[2]!.ids).toEqual(['ai-icon-0-elevated', 'ai-icon-0-glass', 'ai-icon-0-cyan', 'ai-icon-0-mono']);
  });

  it('classifies div wrappers containing an svg/img/i icon or symbol as icon-emoji instead of button-action or card-container', () => {
    const messengerBtnDiv = document.createElement('div');
    messengerBtnDiv.setAttribute('role', 'button');
    messengerBtnDiv.className = 'x1i10hfl x1qjc9v5';
    messengerBtnDiv.innerHTML = '<div class="x9f619"><svg viewBox="0 0 28 28"><path d="M14 2C7.373 2 2 6.974 2 13.111"></path></svg></div>';
    expect(classifyElement(messengerBtnDiv)).toBe('icon-emoji');

    const symbolDiv = document.createElement('div');
    symbolDiv.textContent = '★';
    expect(classifyElement(symbolDiv)).toBe('icon-emoji');

    const plusButtonDiv = document.createElement('div');
    plusButtonDiv.setAttribute('role', 'button');
    plusButtonDiv.textContent = '+';
    expect(classifyElement(plusButtonDiv)).toBe('icon-emoji');

    const fbSpriteIcon = document.createElement('i');
    fbSpriteIcon.setAttribute('data-visualcompletion', 'css-img');
    fbSpriteIcon.setAttribute('style', 'background-image: url("https://static.xx.fbcdn.net/rsrc.php/v4/y4/r/sprite.png"); width: 36px; height: 36px;');
    expect(classifyElement(fbSpriteIcon)).toBe('icon-emoji');

    // Every single icon preset across 1/3, 2/3, 3/3 shifts hue/color via hue-rotate, sepia, or grayscale so bitmap/sprite <i> icons visibly transform
    for (const cycle of [0, 1, 2]) {
      for (const preset of getIconVariationCyclePresets(cycle)) {
        expect(preset.cssText).toMatch(/hue-rotate|sepia|grayscale/);
      }
    }
  });

  it('classifies divider lines, scrollbars/tracks, and geometric shapes/dots with dedicated 3-batch variations', () => {
    const hr = document.createElement('hr');
    const thinLineDiv = document.createElement('div');
    thinLineDiv.className = 'section-divider';
    expect(classifyElement(hr)).toBe('divider-line');
    expect(classifyElement(thinLineDiv)).toBe('divider-line');

    const scrollThumb = document.createElement('div');
    scrollThumb.className = 'simplebar-scrollbar scroll-thumb';
    const rangeInput = document.createElement('input');
    rangeInput.type = 'range';
    expect(classifyElement(scrollThumb)).toBe('scrollbar-track');
    expect(classifyElement(rangeInput)).toBe('scrollbar-track');

    const statusDot = document.createElement('span');
    statusDot.className = 'status-dot online-circle';
    const canvas = document.createElement('canvas');
    expect(classifyElement(statusDot)).toBe('shape-graphic');
    expect(classifyElement(canvas)).toBe('shape-graphic');

    for (const cycle of [0, 1, 2]) {
      const linePresets = getArchetypeVariationPresets('divider-line', cycle);
      const scrollPresets = getArchetypeVariationPresets('scrollbar-track', cycle);
      const shapePresets = getArchetypeVariationPresets('shape-graphic', cycle);
      expect(linePresets[0]!.id).toMatch(/^ai-line-/);
      expect(linePresets[0]!.cssText).toContain('padding: 0');
      expect(scrollPresets[0]!.id).toMatch(/^ai-scroll-/);
      expect(scrollPresets[0]!.cssText).toContain('border-radius: 9999px');
      expect(shapePresets[0]!.id).toMatch(/^ai-shape-/);
      expect(shapePresets[0]!.cssText).not.toContain('padding: 24px');
    }
  });

  it('detects Facebook-style custom scrollbar wrapper div (div.x14nfmen.x1s85apg) and styles its inner thumb child', () => {
    const fbScrollWrapper = document.createElement('div');
    fbScrollWrapper.className = 'x14nfmen x1s85apg';
    fbScrollWrapper.setAttribute('style', 'height: 520px; transform: translate3d(0px, 0px, 0px);');
    fbScrollWrapper.innerHTML = '<div class="x19991ni x1s85apg"></div>';
    fbScrollWrapper.getBoundingClientRect = () => ({ width: 16, height: 520, top: 0, left: 0, right: 16, bottom: 520, x: 0, y: 0, toJSON: () => ({}) });
    document.body.appendChild(fbScrollWrapper);

    expect(classifyElement(fbScrollWrapper)).toBe('scrollbar-track');

    const presetCtx = {
      stylePatches: new WeakMap(),
      activePresetIdMap: new WeakMap(),
      commandHistory: new CommandHistory(),
      variationDock: new VariationDock(),
      overlay: new OverlayManager(),
      updateLedgerCount: () => {},
      refreshDock: () => {},
    };

    const scrollPresets = getArchetypeVariationPresets('scrollbar-track', 0);
    applyPresetHelper(presetCtx, fbScrollWrapper, scrollPresets[0]!);

    // Preserves outer wrapper inline height & transform without turning outer 16px wrapper into a solid block
    expect(fbScrollWrapper.style.height).toBe('520px');
    expect(fbScrollWrapper.style.background).toBe('');

    // Injects !important thumb styling onto the inner child div (> *)
    const liveRules = document.getElementById('auracss-live-rules')?.textContent || '';
    expect(liveRules).toContain('> *');
    expect(liveRules).toContain('border-radius: 9999px !important');
  });

  it('preserves original inline dimensions and background-image sprite on <i> icons during hover-peek, apply, and revert', () => {
    const icon = document.createElement('i');
    const origInline = 'background-image: url("https://static.xx.fbcdn.net/rsrc.php/v4/y4/r/sprite.png"); background-position: 0px -304px; width: 36px; height: 36px; display: inline-block;';
    icon.setAttribute('style', origInline);
    document.body.appendChild(icon);

    const presetCtx = {
      stylePatches: new WeakMap(),
      activePresetIdMap: new WeakMap(),
      commandHistory: new CommandHistory(),
      variationDock: new VariationDock(),
      overlay: new OverlayManager(),
      updateLedgerCount: () => {},
      refreshDock: () => {},
    };

    const presets = getIconVariationCyclePresets(0);
    // 1. Hover-peek must keep width/height/background-image while adding filter
    peekPresetHelper(presetCtx, icon, presets[0]!, false);
    expect(icon.style.width).toBe('36px');
    expect(icon.style.height).toBe('36px');
    expect(icon.style.display).toBe('inline-block');
    expect(icon.style.backgroundImage).toContain('sprite.png');
    expect(icon.style.filter).toContain('hue-rotate');

    // 2. Clicking preset while peeking must preserve original inline CSS and record pre-peek baseline
    applyPresetHelper(presetCtx, icon, presets[0]!);
    expect(icon.style.width).toBe('36px');
    expect(icon.style.height).toBe('36px');
    expect(icon.style.backgroundImage).toContain('sprite.png');
    expect(icon.style.filter).toContain('hue-rotate');

    // 3. Reverting restores original inline CSS without filter
    revertElementHelper(presetCtx, icon, () => {});
    expect(icon.style.width).toBe('36px');
    expect(icon.style.height).toBe('36px');
    expect(icon.style.backgroundImage).toContain('sprite.png');
    expect(icon.style.filter).toBe('');
  });
});
