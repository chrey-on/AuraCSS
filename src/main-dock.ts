import type { VariationDock } from './suggester';
import type { StylePreset, SavedPromptedStyle, ExtractedTokens, TypographyUpdate } from './types';

export interface DockRenderOptions {
  presets: StylePreset[];
  el: HTMLElement;
  isModified: boolean;
  setIndex?: number;
  activeId?: string | null;
  savedStyles: SavedPromptedStyle[];
  tokens: ExtractedTokens;
  onSelectPreset: (preset: StylePreset) => void;
  onRevert: () => void;
  onDeselect: () => void;
  onTogglePalette: () => void;
  onOpenAISettings: () => void;
  onRequestAISuggestions: () => void;
  onSelectSaved: (style: SavedPromptedStyle) => void;
  onSelectSwatch: (hex: string) => void;
  onApplyTypography: (update: TypographyUpdate) => void;
  onDeleteSaved: (style: SavedPromptedStyle) => void;
  onClearAllSaved: () => void;
  onPeek?: (preset: StylePreset) => void;
  onUnpeek?: () => void;
  onToggleBookmark?: (preset: StylePreset) => void;
  bookmarkedIds?: Set<string>;
  onRevertTypography?: () => void;
}

export function renderAppDock(dock: VariationDock, opts: DockRenderOptions): void {
  dock.render(
    opts.presets,
    opts.onSelectPreset,
    opts.onRevert,
    opts.isModified,
    undefined,
    opts.onTogglePalette,
    opts.onOpenAISettings,
    opts.onRequestAISuggestions,
    opts.setIndex,
    opts.onDeselect,
    opts.savedStyles,
    opts.onSelectSaved,
    opts.tokens,
    opts.onSelectPreset,
    opts.onSelectSwatch,
    opts.onApplyTypography,
    opts.onDeleteSaved,
    opts.onClearAllSaved,
    opts.onPeek,
    opts.onUnpeek,
    opts.onToggleBookmark,
    opts.bookmarkedIds,
    opts.onRevertTypography
  );
  if (opts.activeId) {
    dock.setActivePresetId(opts.activeId);
  }
}

export interface DockContext {
  variationDock: VariationDock;
  harvester: { harvest: () => ExtractedTokens };
  savedPromptedStyles: WeakMap<HTMLElement, SavedPromptedStyle[]>;
  activePresetIdMap: WeakMap<HTMLElement, string | null>;
  currentDockPresets: WeakMap<HTMLElement, StylePreset[]>;
  bookmarkedPresets: WeakMap<HTMLElement, Set<string>>;
  onApplyPreset: (el: HTMLElement, preset: StylePreset) => void;
  onRevert: (el: HTMLElement) => void;
  onApplyTypography: (el: HTMLElement, update: TypographyUpdate) => void;
  onRevertTypography: (el: HTMLElement) => void;
  onApplySwatch: (el: HTMLElement, hex: string) => void;
  onOpenAISettings: (el: HTMLElement) => void;
  onRequestAISuggestions: (el: HTMLElement) => void;
  refreshDock: (el: HTMLElement, isModified: boolean) => void;
  onPeek: (el: HTMLElement, preset: StylePreset) => void;
  onUnpeek: (el: HTMLElement) => void;
}

export function renderDockHelper(
  ctx: DockContext,
  el: HTMLElement,
  presets: StylePreset[],
  isModified: boolean,
  setIndex?: number
): void {
  ctx.currentDockPresets.set(el, presets);
  renderAppDock(ctx.variationDock, {
    presets,
    el,
    isModified,
    setIndex,
    activeId: ctx.activePresetIdMap.get(el),
    savedStyles: ctx.savedPromptedStyles.get(el) || [],
    tokens: ctx.harvester.harvest(),
    onSelectPreset: (p) => ctx.onApplyPreset(el, p),
    onRevert: () => ctx.onRevert(el),
    onDeselect: () => ctx.onRevert(el),
    onTogglePalette: () => ctx.variationDock.togglePalettePopover(
      (u) => ctx.onApplyTypography(el, u),
      () => ctx.onRevertTypography(el)
    ),
    onOpenAISettings: () => ctx.onOpenAISettings(el),
    onRequestAISuggestions: () => ctx.onRequestAISuggestions(el),
    onSelectSaved: (s) => ctx.onApplyPreset(el, s),
    onSelectSwatch: (hex) => ctx.onApplySwatch(el, hex),
    onApplyTypography: (u) => ctx.onApplyTypography(el, u),
    onDeleteSaved: (style) => {
      const list = ctx.savedPromptedStyles.get(el) || [];
      ctx.savedPromptedStyles.set(el, list.filter((s) => s.id !== style.id));
      ctx.refreshDock(el, isModified);
    },
    onClearAllSaved: () => {
      ctx.savedPromptedStyles.set(el, []);
      ctx.refreshDock(el, isModified);
    },
    onPeek: (p) => ctx.onPeek(el, p),
    onUnpeek: () => ctx.onUnpeek(el),
    onToggleBookmark: (p) => {
      let set = ctx.bookmarkedPresets.get(el);
      if (!set) {
        set = new Set<string>();
        ctx.bookmarkedPresets.set(el, set);
      }
      set.has(p.id) ? set.delete(p.id) : set.add(p.id);
      ctx.variationDock.updateBookmarks(set);
    },
    bookmarkedIds: ctx.bookmarkedPresets.get(el) || new Set<string>(),
    onRevertTypography: () => ctx.onRevertTypography(el),
  });
}
