import type { StylePreset, SavedPromptedStyle, ExtractedTokens, TypographyUpdate } from './types';
import { DOCK_STYLES } from './dock-styles';
import { renderPalettePopover } from './dock-typography';
import { renderSavedPopover } from './dock-saved';
import { createCardsTrack, type CardsTrackResult } from './dock-cards';

export class VariationDock {
  private dockEl: HTMLDivElement | null = null;
  private dockContentEl: HTMLDivElement | null = null;
  private savedPopoverEl: HTMLDivElement | null = null;
  private palettePopoverEl: HTMLDivElement | null = null;
  private activePresetId: string | null = null;
  private cardsTrackResult: CardsTrackResult | null = null;

  public mount(shadow: ShadowRoot): void {
    if (this.dockEl) return;
    const styleEl = document.createElement('style');
    styleEl.textContent = DOCK_STYLES;
    shadow.appendChild(styleEl);

    const dock = document.createElement('div');
    dock.className = 'auracss-variation-dock';
    dock.setAttribute('role', 'toolbar');
    dock.setAttribute('aria-label', 'AuraCSS Design Variations');

    this.savedPopoverEl = document.createElement('div');
    this.savedPopoverEl.className = 'auracss-saved-popover';
    this.palettePopoverEl = document.createElement('div');
    this.palettePopoverEl.className = 'auracss-palette-popover';
    this.dockContentEl = document.createElement('div');
    this.dockContentEl.className = 'auracss-dock-content';
    this.dockContentEl.style.cssText = 'display: flex; align-items: center; gap: 8px; width: 100%;';

    dock.append(this.savedPopoverEl, this.palettePopoverEl, this.dockContentEl);
    shadow.appendChild(dock);
    this.dockEl = dock;
  }

  public setActivePresetId(id: string | null): void {
    this.activePresetId = id;
    this.cardsTrackResult?.setActiveId(id);
    if (this.savedPopoverEl) {
      this.savedPopoverEl.querySelectorAll('.auracss-saved-card').forEach((c) => {
        const el = c as HTMLElement;
        el.classList.toggle('active', el.dataset.savedId === id);
      });
    }
  }

  public updateBookmarks(ids: Set<string>): void {
    this.cardsTrackResult?.updateBookmarks(ids);
  }

  public closeAllPopovers(): void {
    this.savedPopoverEl?.classList.remove('visible');
    this.palettePopoverEl?.classList.remove('visible');
  }

  public toggleSavedPopover(
    savedStyles: SavedPromptedStyle[],
    onSelect?: (style: SavedPromptedStyle) => void,
    onDelete?: (style: SavedPromptedStyle) => void,
    onClearAll?: () => void
  ): void {
    if (!this.savedPopoverEl) return;
    const isVisible = this.savedPopoverEl.classList.contains('visible');
    this.closeAllPopovers();
    if (!isVisible) {
      renderSavedPopover(this.savedPopoverEl, savedStyles, this.activePresetId, onSelect, onDelete, onClearAll);
      this.savedPopoverEl.classList.add('visible');
    }
  }

  public togglePalettePopover(
    onApplyTypography?: (update: TypographyUpdate) => void,
    onRevertTypography?: () => void
  ): void {
    if (!this.palettePopoverEl) return;
    const isVisible = this.palettePopoverEl.classList.contains('visible');
    this.closeAllPopovers();
    if (!isVisible) {
      renderPalettePopover(this.palettePopoverEl, onApplyTypography, onRevertTypography);
      this.palettePopoverEl.classList.add('visible');
    }
  }

  public render(
    presets: StylePreset[],
    onSelect: (preset: StylePreset) => void,
    onReset?: () => void,
    isModified = false,
    _onPrompt?: (promptText: string) => void,
    onTogglePalette?: () => void,
    onOpenAISettings?: () => void,
    onRequestAISuggestions?: () => void,
    setIndex?: number,
    onDeselect?: (preset: StylePreset) => void,
    savedPromptedStyles?: SavedPromptedStyle[],
    onSelectSavedPromptedStyle?: (style: SavedPromptedStyle) => void,
    _tokens?: ExtractedTokens,
    _onSelectThemePreset?: (preset: StylePreset) => void,
    _onSelectPaletteColor?: (hex: string) => void,
    onApplyTypography?: (update: TypographyUpdate) => void,
    onDeleteSavedPromptedStyle?: (style: SavedPromptedStyle) => void,
    onClearAllSavedPromptedStyles?: () => void,
    onPeek?: (preset: StylePreset) => void,
    onUnpeek?: () => void,
    onToggleBookmark?: (preset: StylePreset) => void,
    bookmarkedIds?: Set<string>,
    onRevertTypography?: () => void
  ): void {
    if (!this.dockEl || !this.dockContentEl) return;
    this.cardsTrackResult?.cleanup();
    this.cardsTrackResult = null;

    const wasSavedOpen = this.savedPopoverEl?.classList.contains('visible') ?? false;
    const wasPaletteOpen = this.palettePopoverEl?.classList.contains('visible') ?? false;

    this.dockContentEl.innerHTML = '';
    if (!isModified) this.activePresetId = null;

    // Left Stack
    const leftStack = document.createElement('div');
    leftStack.className = 'auracss-dock-stack left';
    if (onRequestAISuggestions) {
      const aiBtn = document.createElement('button');
      aiBtn.className = 'auracss-ai-remodel-btn';
      aiBtn.type = 'button';
      const setLabel = typeof setIndex === 'number' ? `${setIndex + 1}/3` : '1/3';
      aiBtn.title = `AI Variations (Set ${setLabel}) - Click to cycle`;
      aiBtn.innerHTML = `<span>✨</span><span class="auracss-btn-badge">${setLabel}</span>`;
      aiBtn.onclick = (e) => { e.stopPropagation(); aiBtn.innerHTML = `<span>✨</span><span class="auracss-btn-badge">...</span>`; onRequestAISuggestions(); };
      leftStack.appendChild(aiBtn);
    }
    if (onReset) {
      const resetBtn = document.createElement('button');
      resetBtn.className = `auracss-preset-reset${isModified ? '' : ' disabled'}`;
      resetBtn.type = 'button';
      resetBtn.title = isModified ? 'Revert element to original unstyled state' : 'Original element unstyled';
      resetBtn.innerHTML = '↺';
      resetBtn.onclick = (e) => { e.stopPropagation(); if (isModified) { this.activePresetId = null; onReset(); } };
      leftStack.appendChild(resetBtn);
    }
    this.dockContentEl.appendChild(leftStack);

    const leftDivider = document.createElement('div');
    leftDivider.className = 'auracss-dock-divider';
    this.dockContentEl.appendChild(leftDivider);

    // Middle Track
    this.cardsTrackResult = createCardsTrack(
      presets,
      this.activePresetId,
      onSelect,
      onDeselect,
      onPeek,
      onUnpeek,
      onToggleBookmark,
      bookmarkedIds
    );
    this.dockContentEl.appendChild(this.cardsTrackResult.trackEl);

    const rightDivider = document.createElement('div');
    rightDivider.className = 'auracss-dock-divider';
    this.dockContentEl.appendChild(rightDivider);

    // Right Stack
    const rightStack = document.createElement('div');
    rightStack.className = 'auracss-dock-stack right';
    const topRow = document.createElement('div');
    topRow.className = 'auracss-dock-row';

    const paletteBtn = document.createElement('button');
    paletteBtn.className = 'auracss-dock-palette-btn auracss-dock-tune-btn';
    paletteBtn.type = 'button';
    paletteBtn.title = 'Typography & Font Styles';
    paletteBtn.innerHTML = 'Aa';
    paletteBtn.onclick = (e) => { e.stopPropagation(); onTogglePalette ? onTogglePalette() : this.togglePalettePopover(onApplyTypography, onRevertTypography); };
    topRow.appendChild(paletteBtn);

    if (onOpenAISettings) {
      const setBtn = document.createElement('button');
      setBtn.className = 'auracss-ai-settings-btn';
      setBtn.type = 'button';
      setBtn.title = 'Antigravity Agent Diagnostics';
      setBtn.innerHTML = '⚙️';
      setBtn.onclick = (e) => { e.stopPropagation(); onOpenAISettings(); };
      topRow.appendChild(setBtn);
    }
    rightStack.appendChild(topRow);

    const savedBtn = document.createElement('button');
    savedBtn.className = 'auracss-saved-styles-btn';
    savedBtn.type = 'button';
    const count = savedPromptedStyles?.length || 0;
    savedBtn.title = `Saved Prompted Styles (${count} saved)`;
    savedBtn.innerHTML = `<span>💾</span>${count > 0 ? `<span class="auracss-btn-badge">${count}</span>` : ''}`;
    savedBtn.onclick = (e) => { e.stopPropagation(); this.toggleSavedPopover(savedPromptedStyles || [], onSelectSavedPromptedStyle, onDeleteSavedPromptedStyle, onClearAllSavedPromptedStyles); };
    rightStack.appendChild(savedBtn);

    this.dockContentEl.appendChild(rightStack);
    this.dockEl.classList.add('visible');

    if (wasPaletteOpen && this.palettePopoverEl) {
      renderPalettePopover(this.palettePopoverEl, onApplyTypography, onRevertTypography);
      this.palettePopoverEl.classList.add('visible');
    } else if (wasSavedOpen && this.savedPopoverEl) {
      renderSavedPopover(this.savedPopoverEl, savedPromptedStyles || [], this.activePresetId, onSelectSavedPromptedStyle, onDeleteSavedPromptedStyle, onClearAllSavedPromptedStyles);
      this.savedPopoverEl.classList.add('visible');
    }
  }

  public clear(): void {
    this.activePresetId = null;
    this.closeAllPopovers();
    this.cardsTrackResult?.cleanup();
    this.cardsTrackResult = null;
    if (this.dockEl) this.dockEl.classList.remove('visible');
    if (this.dockContentEl) this.dockContentEl.innerHTML = '';
  }

  public destroy(): void {
    this.clear();
    if (this.dockEl && this.dockEl.parentNode) this.dockEl.parentNode.removeChild(this.dockEl);
    this.dockEl = null;
    this.dockContentEl = null;
    this.savedPopoverEl = null;
    this.palettePopoverEl = null;
  }
}
