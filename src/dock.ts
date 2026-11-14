import type { StylePreset, SavedPromptedStyle, ExtractedTokens, TypographyUpdate } from './types';
import { DOCK_STYLES } from './dock-styles';
import { renderPalettePopover } from './dock-typography';
import { renderSavedPopover } from './dock-saved';
import { createCardsTrack, type CardsTrackResult } from './dock-cards';
import { makeDraggable, clampToViewport } from './draggable';

const DOCK_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`;

export class VariationDock {
  private dockEl: HTMLDivElement | null = null;
  private dockContentEl: HTMLDivElement | null = null;
  private savedPopoverEl: HTMLDivElement | null = null;
  private palettePopoverEl: HTMLDivElement | null = null;
  private activePresetId: string | null = null;
  private cardsTrackResult: CardsTrackResult | null = null;
  private cleanups: (() => void)[] = [];
  private hasCustomPos = false;
  private minimizeToRightFn: (() => void) | null = null;

  public mount(shadow: ShadowRoot): void {
    if (this.dockEl) return;
    const styleEl = document.createElement('style');
    styleEl.textContent = DOCK_STYLES;
    shadow.appendChild(styleEl);

    const dock = document.createElement('div');
    dock.className = 'auracss-variation-dock';
    dock.setAttribute('role', 'toolbar');
    dock.setAttribute('aria-label', 'AuraCSS Design Variations');

    const dragHandle = document.createElement('span');
    dragHandle.className = 'auracss-dock-drag-handle';
    dragHandle.title = 'Click to minimize to right, drag to move';
    dragHandle.setAttribute('role', 'button');
    dragHandle.setAttribute('aria-label', 'Drag variation dock or click to minimize');
    dragHandle.textContent = '⋮⋮';

    const minBadge = document.createElement('button');
    minBadge.className = 'auracss-dock-min-badge';
    minBadge.type = 'button';
    minBadge.title = 'Expand Variation Dock';
    minBadge.setAttribute('aria-label', 'Expand Variation Dock');
    minBadge.innerHTML = DOCK_ICON_SVG;

    let badgeDragged = false, preMinTop = '', preMinBottom = '';
    const rowDrag = makeDraggable(dock, dragHandle, {
      storageKey: 'auracss_dock_pos',
      onDragEnd: () => { this.hasCustomPos = true; },
    });
    const badgeDrag = makeDraggable(dock, minBadge, {
      storageKey: 'auracss_dock_badge_pos',
      onDragEnd: () => { badgeDragged = true; clampToViewport(dock); },
    });
    this.cleanups.push(rowDrag.destroy, badgeDrag.destroy);

    const minimizeToRight = () => {
      const winW = typeof window !== 'undefined' ? (document.documentElement?.clientWidth || window.innerWidth || 1024) : 1024;
      const rect = dock.getBoundingClientRect();
      preMinTop = dock.style.top;
      preMinBottom = dock.style.bottom;
      badgeDragged = false;
      this.closeAllPopovers();
      const rightX = Math.round(winW - 32 - 16);
      const targetTop = !this.hasCustomPos ? 104 : (rect.height > 0 ? Math.round(rect.top + (rect.height - 32) / 2) : 104);
      dock.classList.add('minimized');
      dock.style.setProperty('left', `${rightX}px`, 'important');
      dock.style.setProperty('top', `${targetTop}px`, 'important');
      dock.style.setProperty('right', 'auto', 'important');
      dock.style.setProperty('bottom', 'auto', 'important');
      dock.style.setProperty('transform', 'none', 'important');
      clampToViewport(dock);
    };
    this.minimizeToRightFn = minimizeToRight;
    dragHandle.onclick = (e) => { e.stopPropagation(); if (!rowDrag.wasJustDragged()) minimizeToRight(); };

    minBadge.onclick = (e) => {
      e.stopPropagation();
      if (badgeDrag.wasJustDragged()) return;
      const bRect = minBadge.getBoundingClientRect();
      dock.classList.remove('minimized');
      if (!badgeDragged && !this.hasCustomPos) {
        ['left', 'top', 'right', 'bottom', 'transform'].forEach((p) => dock.style.removeProperty(p));
        if (preMinBottom) dock.style.bottom = preMinBottom;
        if (preMinTop) dock.style.top = preMinTop;
      } else {
        this.hasCustomPos = true;
        const expRect = dock.getBoundingClientRect();
        dock.style.setProperty('left', `${Math.round(bRect.right - expRect.width)}px`, 'important');
        dock.style.setProperty('top', `${Math.round(bRect.top + (bRect.height - expRect.height) / 2)}px`, 'important');
        clampToViewport(dock);
      }
    };

    this.savedPopoverEl = document.createElement('div');
    this.savedPopoverEl.className = 'auracss-saved-popover';
    this.palettePopoverEl = document.createElement('div');
    this.palettePopoverEl.className = 'auracss-palette-popover';
    this.dockContentEl = document.createElement('div');
    this.dockContentEl.className = 'auracss-dock-content';

    dock.append(dragHandle, this.savedPopoverEl, this.palettePopoverEl, this.dockContentEl, minBadge);
    shadow.appendChild(dock);
    this.dockEl = dock;
    const onResize = () => { if (this.hasCustomPos || dock.classList.contains('minimized')) clampToViewport(dock); };
    window.addEventListener('resize', onResize); this.cleanups.push(() => window.removeEventListener('resize', onResize));
  }

  public setActivePresetId(id: string | null): void {
    this.activePresetId = id;
    this.cardsTrackResult?.setActiveId(id);
    this.savedPopoverEl?.querySelectorAll('.auracss-saved-card').forEach((c) => {
      const el = c as HTMLElement;
      el.classList.toggle('active', el.dataset.savedId === id);
    });
  }

  public updateBookmarks(ids: Set<string>): void { this.cardsTrackResult?.updateBookmarks(ids); }

  public closeAllPopovers(): void {
    this.savedPopoverEl?.classList.remove('visible');
    this.palettePopoverEl?.classList.remove('visible');
  }

  public toggleSavedPopover(
    savedStyles: SavedPromptedStyle[], onSelect?: (style: SavedPromptedStyle) => void,
    onDelete?: (style: SavedPromptedStyle) => void, onClearAll?: () => void
  ): void {
    if (!this.savedPopoverEl) return;
    const isVisible = this.savedPopoverEl.classList.contains('visible');
    this.closeAllPopovers();
    if (!isVisible) {
      renderSavedPopover(this.savedPopoverEl, savedStyles, this.activePresetId, onSelect, onDelete, onClearAll);
      this.savedPopoverEl.classList.add('visible');
    }
  }

  public togglePalettePopover(onApplyTypography?: (update: TypographyUpdate) => void, onRevertTypography?: () => void): void {
    if (!this.palettePopoverEl) return;
    const isVisible = this.palettePopoverEl.classList.contains('visible');
    this.closeAllPopovers();
    if (!isVisible) {
      renderPalettePopover(this.palettePopoverEl, onApplyTypography, onRevertTypography);
      this.palettePopoverEl.classList.add('visible');
    }
  }

  public render(
    presets: StylePreset[], onSelect: (preset: StylePreset) => void, onReset?: () => void, isModified = false,
    _onPrompt?: (promptText: string) => void, onTogglePalette?: () => void, onOpenAISettings?: () => void,
    onRequestAISuggestions?: () => void, setIndex?: number, onDeselect?: (preset: StylePreset) => void,
    savedPromptedStyles?: SavedPromptedStyle[], onSelectSavedPromptedStyle?: (style: SavedPromptedStyle) => void,
    _tokens?: ExtractedTokens, _onSelectThemePreset?: (preset: StylePreset) => void,
    _onSelectPaletteColor?: (hex: string) => void, onApplyTypography?: (update: TypographyUpdate) => void,
    onDeleteSavedPromptedStyle?: (style: SavedPromptedStyle) => void, onClearAllSavedPromptedStyles?: () => void,
    onPeek?: (preset: StylePreset) => void, onUnpeek?: () => void, onToggleBookmark?: (preset: StylePreset) => void,
    bookmarkedIds?: Set<string>, onRevertTypography?: () => void
  ): void {
    if (!this.dockEl || !this.dockContentEl) return;
    this.cardsTrackResult?.cleanup();
    this.cardsTrackResult = null;

    const wasSavedOpen = this.savedPopoverEl?.classList.contains('visible') ?? false;
    const wasPaletteOpen = this.palettePopoverEl?.classList.contains('visible') ?? false;

    this.dockContentEl.innerHTML = '';
    if (!isModified) this.activePresetId = null;

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

    this.cardsTrackResult = createCardsTrack(
      presets, this.activePresetId, onSelect, onDeselect, onPeek, onUnpeek, onToggleBookmark, bookmarkedIds
    );
    this.dockContentEl.appendChild(this.cardsTrackResult.trackEl);

    const rightDivider = document.createElement('div');
    rightDivider.className = 'auracss-dock-divider';
    this.dockContentEl.appendChild(rightDivider);

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

    const minBtn = document.createElement('button');
    minBtn.className = 'auracss-dock-min-btn';
    minBtn.type = 'button';
    minBtn.title = 'Minimize variation dock to right (or press H for Ghost Mode)';
    minBtn.setAttribute('aria-label', 'Minimize variation dock');
    minBtn.textContent = '–';
    minBtn.onclick = (e) => { e.stopPropagation(); this.minimizeToRightFn?.(); };
    topRow.appendChild(minBtn);
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

  public getDockRect(): DOMRect | null {
    if (!this.dockEl || this.dockEl.classList.contains('minimized')) return null;
    return this.dockEl.getBoundingClientRect();
  }

  public dodgeTarget(target: HTMLElement): boolean {
    if (!this.dockEl || this.hasCustomPos || this.dockEl.classList.contains('minimized')) {
      return this.dockEl?.classList.contains('flipped-top') ?? false;
    }
    const winH = typeof window !== 'undefined' ? (document.documentElement?.clientHeight || window.innerHeight || 768) : 768;
    const rect = target.getBoundingClientRect();
    const shouldFlipTop = rect.bottom >= winH - 135 && rect.top > 135;
    this.dockEl.classList.toggle('flipped-top', shouldFlipTop);
    return shouldFlipTop;
  }

  public setGhostMode(ghost: boolean): void {
    if (ghost) this.closeAllPopovers();
    this.dockEl?.classList.toggle('ghost', ghost);
  }

  public clear(): void {
    this.activePresetId = null;
    this.closeAllPopovers();
    this.cardsTrackResult?.cleanup();
    this.cardsTrackResult = null;
    this.dockEl?.classList.remove('visible', 'ghost');
    if (this.dockContentEl) this.dockContentEl.innerHTML = '';
  }

  public destroy(): void {
    this.clear();
    this.cleanups.forEach((c) => c());
    this.cleanups = [];
    this.dockEl?.remove();
    this.dockEl = null; this.dockContentEl = null; this.savedPopoverEl = null; this.palettePopoverEl = null;
  }
}
