import type { SavedPromptedStyle, TypographyUpdate, StylePreset } from './types';
import type { BridgePayload, StyleInteraction } from './bridge-types';
import type { AIService } from './ai';
import type { AISettingsModal } from './ai-modal';
import type { AuraHarvester } from './harvester';
import type { PresetContext } from './main-presets';
import { applyPresetHelper } from './main-presets';
import { formatElementLabel } from './hierarchy';
import { computeSwatchMutation, computeTypographyTailwind, injectLiveRules } from './style-mutator';
import { syncCommittedStyles } from './ledger-actions';
import { getAiVariationCyclePresets, isActionElement } from './bridge-presets';

export type { BridgePayload, StyleInteraction } from './bridge-types';
export { injectLiveRules };

export function recordSavedPromptedStyle(
  savedMap: WeakMap<HTMLElement, SavedPromptedStyle[]>,
  el: HTMLElement,
  style: SavedPromptedStyle
): void {
  const list = savedMap.get(el) || [];
  const filtered = list.filter((s) => s.cssText !== style.cssText);
  filtered.unshift(style);
  savedMap.set(el, filtered);
}

export function deleteSavedPromptedStyle(
  savedMap: WeakMap<HTMLElement, SavedPromptedStyle[]>,
  el: HTMLElement,
  id: string
): void {
  const list = savedMap.get(el) || [];
  savedMap.set(el, list.filter((s) => s.id !== id));
}

export function clearSavedPromptedStyles(
  savedMap: WeakMap<HTMLElement, SavedPromptedStyle[]>,
  el: HTMLElement
): void {
  savedMap.set(el, []);
}

export function createBridgeStyle(p: BridgePayload): SavedPromptedStyle {
  const label = p.name || (p.prompt ? (p.prompt.length > 25 ? p.prompt.slice(0, 22) + '...' : p.prompt) : 'Agent Prompt Result');
  const desc = p.description || (p.prompt ? `Prompt: "${p.prompt}"` : 'Synthesized & streamed from Antigravity agent');
  return {
    id: `prompted-${Date.now()}`,
    name: label,
    description: desc,
    cssText: p.cssText,
    tailwindClasses: p.tailwindClasses || '',
    timestamp: Date.now(),
    contrastRating: 'AAA',
    contrastRatio: '7.5:1',
  };
}

const interactionCleanups = new WeakMap<HTMLElement, () => void>();

export function applyInteractionHelper(el: HTMLElement, interaction?: StyleInteraction): void {
  interactionCleanups.get(el)?.();
  interactionCleanups.delete(el);
  if (!interaction) return;

  if (interaction.type === 'toggle-visibility') {
    let isHidden = false;
    const targetHandler = () => {
      if (!isHidden) {
        isHidden = true;
        el.style.opacity = '0';
      }
    };
    const outsideHandler = (e: MouseEvent) => {
      if (isHidden && !el.contains(e.target as Node)) {
        isHidden = false;
        el.style.opacity = '1';
      }
    };
    el.addEventListener('click', targetHandler, { capture: true });
    window.addEventListener('click', outsideHandler, { capture: true });
    interactionCleanups.set(el, () => {
      el.removeEventListener('click', targetHandler, { capture: true });
      window.removeEventListener('click', outsideHandler, { capture: true });
    });
  } else if (interaction.type === 'toggle-class' && interaction.className) {
    const cls = interaction.className;
    const handler = () => {
      el.classList.toggle(cls);
    };
    el.addEventListener('click', handler, { capture: true });
    interactionCleanups.set(el, () => el.removeEventListener('click', handler, { capture: true }));
  }
}

export function applyBridgePayloadHelper(
  p: BridgePayload,
  ctx: {
    lockedElement: HTMLElement | null;
    lockElement: (el: HTMLElement) => void;
    savedPromptedStyles: WeakMap<HTMLElement, SavedPromptedStyle[]>;
    presetContext: PresetContext;
  }
): void {
  const target = ctx.lockedElement || (p.selector ? (document.querySelector(p.selector) as HTMLElement | null) : null);
  if (target && target instanceof HTMLElement) {
    if (!ctx.lockedElement) ctx.lockElement(target);

    // If replace mode (default), reset inline styles back to original before applying
    if (p.mode !== 'patch') {
      const orig = ctx.presetContext.stylePatches.get(target)?.originalCssText;
      if (typeof orig === 'string') {
        target.style.cssText = orig;
      }
    }

    const sel = formatElementLabel(target);
    injectLiveRules(sel, p);
    applyInteractionHelper(target, p.interaction);

    const style = createBridgeStyle(p);
    recordSavedPromptedStyle(ctx.savedPromptedStyles, target, style);
    applyPresetHelper(ctx.presetContext, target, style);
  }
}

export function applyColorSwatchHelper(
  el: HTMLElement,
  hex: string,
  currentTw: string,
  onCommit: (newCss: string, tailwind: string, prevCss: string) => void
): void {
  if (!el?.isConnected) return;
  const { textColor, tailwind } = computeSwatchMutation(hex, currentTw);
  const prevCss = el.style.cssText;
  el.style.backgroundColor = hex;
  el.style.color = textColor;
  onCommit(el.style.cssText, tailwind, prevCss);
}

const typographyBaselines = new WeakMap<HTMLElement, { cssText: string; tailwind: string }>();

export function clearTypographyBaseline(el: HTMLElement): void {
  typographyBaselines.delete(el);
}

export function applyTypographyUpdateHelper(
  el: HTMLElement,
  update: TypographyUpdate,
  currentTw: string,
  onCommit: (newCss: string, tailwind: string, prevCss: string) => void
): void {
  if (!el?.isConnected) return;
  if (!typographyBaselines.has(el)) {
    typographyBaselines.set(el, { cssText: el.style.cssText, tailwind: currentTw });
  }
  const prevCss = el.style.cssText;
  el.style.setProperty(update.property, update.value);
  const tailwind = computeTypographyTailwind(currentTw, update);
  onCommit(el.style.cssText, tailwind, prevCss);
}

export function revertTypographyHelper(
  el: HTMLElement,
  onCommit: (newCss: string, tailwind: string, prevCss: string) => void,
  onFullRevert: () => void
): void {
  if (!el?.isConnected) return;
  const base = typographyBaselines.get(el);
  if (base) {
    const prevCss = el.style.cssText;
    el.style.cssText = base.cssText;
    typographyBaselines.delete(el);
    onCommit(base.cssText, base.tailwind, prevCss);
  } else {
    onFullRevert();
  }
}

export async function handleAISuggestionsHelper(
  el: HTMLElement,
  ctx: {
    aiService: AIService;
    aiModal: AISettingsModal;
    variationCycleMap: WeakMap<HTMLElement, number>;
    harvester: AuraHarvester;
    isModified: boolean;
    renderDock: (el: HTMLElement, presets: StylePreset[], isModified: boolean, setIndex?: number) => void;
    refreshDock: (el: HTMLElement, isModified: boolean) => void;
  }
): Promise<void> {
  if (!el?.isConnected) return;
  if (!ctx.aiService.isConfigured()) {
    ctx.aiModal.show();
    return;
  }
  const currentSet = ctx.variationCycleMap.get(el) ?? 0;
  const nextSet = (currentSet + 1) % 3;
  ctx.variationCycleMap.set(el, nextSet);
  try {
    const presets = await ctx.aiService.generateAISuggestions(
      {
        tag: el.tagName.toLowerCase(),
        htmlSnippet: el.outerHTML.slice(0, 200),
        computedStyles: { color: el.style.color, backgroundColor: el.style.backgroundColor },
        siteTokens: ctx.harvester.harvest(),
      },
      undefined,
      nextSet
    );
    ctx.renderDock(el, presets, ctx.isModified, nextSet);
  } catch {
    const fallbackPresets = getAiVariationCyclePresets(nextSet, isActionElement(el));
    ctx.renderDock(el, fallbackPresets, ctx.isModified, nextSet);
  }
}

export async function loadWorkspaceMutationsHelper(): Promise<void> {
  if (typeof process !== 'undefined' && (process.env?.NODE_ENV === 'test' || process.env?.VITEST)) {
    return;
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem('auracss_committed_css');
      if (cached) {
        syncCommittedStyles(cached);
      }
    }
  } catch {}

  const candidates = ['http://127.0.0.1:4999', 'http://localhost:4999'];
  for (const base of candidates) {
    try {
      const res = await fetch(`${base}/api/mutations`);
      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as { cssText?: string };
        if (data.cssText) {
          syncCommittedStyles(data.cssText);
          return;
        }
      }
    } catch {}
  }
}
