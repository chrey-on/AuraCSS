import type { StylePreset, StylePatch } from './types';
import type { CommandHistory } from './command';
import type { VariationDock } from './suggester';
import type { OverlayManager } from './overlay';
import { injectLiveRules, clearLiveRules, type LiveRulePayload } from './style-mutator';
import { getUniqueSelector } from './element-context';
import { classifyElement } from './element-classifier';

export interface PresetContext {
  stylePatches: WeakMap<HTMLElement, StylePatch>;
  activePresetIdMap: WeakMap<HTMLElement, string | null>;
  commandHistory: CommandHistory;
  variationDock: VariationDock;
  overlay: OverlayManager;
  updateLedgerCount: () => void;
  refreshDock: (el: HTMLElement, isModified: boolean) => void;
}

let activePeekElement: HTMLElement | null = null;
let activePeekOriginalCss: string | null = null;
const committedLivePayloads = new WeakMap<HTMLElement, LiveRulePayload>();

export function clearActivePeek(): void {
  activePeekElement = null;
  activePeekOriginalCss = null;
}

function mergeWithOriginalInlineCss(originalCss: string, presetCss: string): string {
  const base = (originalCss || '').trim().replace(/;+\s*$/, '');
  if (!base) return presetCss;
  return `${base}; ${presetCss}`;
}

function resolveElementAndLivePayload(
  el: HTMLElement,
  preset: StylePreset
): { inlineCss: string; livePayload: LiveRulePayload } {
  const isScrollbarWrapper = el.children.length > 0 && classifyElement(el) === 'scrollbar-track';
  if (isScrollbarWrapper) {
    return {
      inlineCss: `--auracss-thumb-preset: ${preset.id}; scrollbar-width: thin;`,
      livePayload: {
        keyframes: preset.keyframes,
        hoverState: preset.hoverState,
        activeState: preset.activeState,
        childState: preset.cssText,
      },
    };
  }
  return {
    inlineCss: preset.cssText,
    livePayload: {
      keyframes: preset.keyframes,
      hoverState: preset.hoverState,
      activeState: preset.activeState,
    },
  };
}

export function peekPresetHelper(
  ctx: PresetContext,
  el: HTMLElement,
  preset: StylePreset,
  isComparing: boolean
): void {
  if (!el?.isConnected || isComparing) return;
  if (!activePeekElement || activePeekElement !== el) {
    activePeekElement = el;
    activePeekOriginalCss = el.style.cssText;
  }
  const baseOriginal = ctx.stylePatches.get(el)?.originalCssText ?? activePeekOriginalCss ?? '';
  const { inlineCss, livePayload } = resolveElementAndLivePayload(el, preset);
  el.style.cssText = mergeWithOriginalInlineCss(baseOriginal, inlineCss);
  if (livePayload.activeState || livePayload.hoverState || livePayload.keyframes || livePayload.childState) {
    injectLiveRules(getUniqueSelector(el), livePayload);
  }
  ctx.overlay.updateHighlight(el, true);
}

export function unpeekPresetHelper(
  ctx: PresetContext,
  el: HTMLElement,
  isComparing: boolean
): void {
  if (!activePeekElement || activePeekElement !== el || isComparing) return;
  const patch = ctx.stylePatches.get(el);
  if (patch) {
    el.style.cssText = patch.appliedCssText;
  } else if (activePeekOriginalCss) {
    el.style.cssText = activePeekOriginalCss;
  } else {
    el.removeAttribute('style');
  }
  activePeekElement = null;
  activePeekOriginalCss = null;
  const sel = getUniqueSelector(el);
  const committedLive = committedLivePayloads.get(el);
  if (patch && committedLive) {
    injectLiveRules(sel, committedLive);
  } else {
    clearLiveRules(sel);
  }
  ctx.overlay.updateHighlight(el, true);
}

export function commitStyleChange(
  ctx: PresetContext,
  el: HTMLElement,
  newCss: string,
  tw: string,
  prevCss: string
): void {
  clearActivePeek();
  const original = ctx.stylePatches.get(el)?.originalCssText ?? prevCss;
  ctx.stylePatches.set(el, { originalCssText: original, appliedCssText: newCss, tailwindClasses: tw });
  ctx.commandHistory.execute({
    element: el,
    selectorPath: getUniqueSelector(el),
    previousCssText: prevCss,
    appliedCssText: newCss,
    tailwindClasses: tw,
    timestamp: Date.now(),
  });
  ctx.updateLedgerCount();
  ctx.overlay.updateHighlight(el, true);
  ctx.refreshDock(el, true);
}

export function applyPresetHelper(
  ctx: PresetContext,
  el: HTMLElement,
  preset: StylePreset
): void {
  if (!el?.isConnected) return;
  const truePrevCss =
    activePeekElement === el && activePeekOriginalCss !== null
      ? activePeekOriginalCss
      : el.style.cssText;
  clearActivePeek();
  ctx.activePresetIdMap.set(el, preset.id);
  ctx.variationDock.setActivePresetId(preset.id);
  const { inlineCss, livePayload } = resolveElementAndLivePayload(el, preset);
  const sel = getUniqueSelector(el);
  if (livePayload.activeState || livePayload.hoverState || livePayload.keyframes || livePayload.childState) {
    committedLivePayloads.set(el, livePayload);
    injectLiveRules(sel, livePayload);
  } else {
    committedLivePayloads.delete(el);
    clearLiveRules(sel);
  }
  const current = ctx.stylePatches.get(el);
  const baseOriginal = current?.originalCssText ?? truePrevCss;
  const mergedCss = mergeWithOriginalInlineCss(baseOriginal, inlineCss);
  if (current && current.appliedCssText === mergedCss) return;
  el.style.cssText = mergedCss;
  commitStyleChange(ctx, el, mergedCss, preset.tailwindClasses, truePrevCss);
}

export function applyIncrementalPresetHelper(
  ctx: PresetContext,
  el: HTMLElement,
  preset: StylePreset
): void {
  if (!el?.isConnected) return;
  clearActivePeek();
  const prevCss = el.style.cssText;
  const temp = document.createElement('div');
  temp.style.cssText = preset.cssText;
  for (let i = 0; i < temp.style.length; i++) {
    const prop = temp.style[i]!;
    el.style.setProperty(prop, temp.style.getPropertyValue(prop), temp.style.getPropertyPriority(prop));
  }
  const finalCss = el.style.cssText;
  const p = ctx.stylePatches.get(el);
  const finalTw = p ? `${p.tailwindClasses} ${preset.tailwindClasses}`.trim() : preset.tailwindClasses;
  commitStyleChange(ctx, el, finalCss, finalTw, prevCss);
}

export function revertElementHelper(
  ctx: PresetContext,
  el: HTMLElement,
  onFinishRevert: () => void
): void {
  clearActivePeek();
  committedLivePayloads.delete(el);
  clearLiveRules(getUniqueSelector(el));
  clearLiveRules();
  const patch = ctx.stylePatches.get(el);
  if (!patch) return;
  el.style.cssText = patch.originalCssText;
  ctx.stylePatches.delete(el);
  ctx.commandHistory.removeElement(el);
  ctx.activePresetIdMap.set(el, null);
  ctx.variationDock.setActivePresetId(null);
  ctx.updateLedgerCount();
  ctx.overlay.updateHighlight(el, true);
  onFinishRevert();
}
