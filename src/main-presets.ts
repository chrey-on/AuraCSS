import type { StylePreset, StylePatch } from './types';
import type { CommandHistory } from './command';
import type { VariationDock } from './suggester';
import type { OverlayManager } from './overlay';
import { formatElementLabel } from './hierarchy';
import { injectLiveRules } from './style-mutator';

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

export function clearActivePeek(): void {
  activePeekElement = null;
  activePeekOriginalCss = null;
}

export function peekPresetHelper(
  ctx: PresetContext,
  el: HTMLElement,
  preset: StylePreset,
  isComparing: boolean
): void {
  if (!el?.isConnected || isComparing) return;
  if (!activePeekElement) {
    activePeekElement = el;
    activePeekOriginalCss = el.style.cssText;
  }
  el.style.cssText = preset.cssText;
  if (preset.activeState || preset.hoverState || preset.keyframes) {
    injectLiveRules(formatElementLabel(el), preset);
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
  if (patch) {
    injectLiveRules(formatElementLabel(el), {});
  } else {
    injectLiveRules('', {});
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
    selectorPath: formatElementLabel(el),
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
  clearActivePeek();
  ctx.activePresetIdMap.set(el, preset.id);
  ctx.variationDock.setActivePresetId(preset.id);
  if (preset.activeState || preset.hoverState || preset.keyframes) {
    injectLiveRules(formatElementLabel(el), preset);
  }
  const current = ctx.stylePatches.get(el);
  if (current && current.appliedCssText === preset.cssText) return;
  const prevCss = el.style.cssText;
  el.style.cssText = preset.cssText;
  commitStyleChange(ctx, el, preset.cssText, preset.tailwindClasses, prevCss);
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
  injectLiveRules('', {});
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
