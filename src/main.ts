import { OverlayManager } from './overlay'; import { HierarchyManager, formatElementLabel } from './hierarchy'; import { AuraHarvester } from './harvester'; import { AuraSuggester, VariationDock } from './suggester'; import { CommandHistory } from './command'; import { ChangeLedgerModal } from './ledger'; import { FineTuneCustomizer, type StyleTuneUpdate } from './customizer'; import { AIService } from './ai'; import { AISettingsModal } from './ai-modal'; import { HelpModal } from './help-modal'; import { clampToViewport } from './draggable'; import { createKeybindingHandlers } from './main-keybindings'; import { renderDockHelper } from './main-dock'; import { commitStyleChange, applyPresetHelper, revertElementHelper, peekPresetHelper, unpeekPresetHelper } from './main-presets'; import { applyBridgePayloadHelper, applyColorSwatchHelper, applyTypographyUpdateHelper, revertTypographyHelper, clearTypographyBaseline, handleAISuggestionsHelper, loadWorkspaceMutationsHelper } from './main-actions'; import type { StylePreset, StylePatch, SavedPromptedStyle } from './types';

declare global {
  interface Window { __AURACSS_DEBUG__?: boolean; __AURACSS_INSTANCE__?: AuraCSSApp; }
}

export class AuraCSSApp {
  private overlay = new OverlayManager(); private hierarchy = new HierarchyManager();
  private harvester = new AuraHarvester(); private suggester = new AuraSuggester();
  private variationDock = new VariationDock(); private customizer = new FineTuneCustomizer();
  private commandHistory = new CommandHistory(); private ledgerModal = new ChangeLedgerModal();
  private aiService = new AIService(); private aiModal = new AISettingsModal(this.aiService);
  private helpModal = new HelpModal();
  private stylePatches = new WeakMap<HTMLElement, StylePatch>();
  private aiVariationCycleMap = new WeakMap<HTMLElement, number>();
  private currentDockPresets = new WeakMap<HTMLElement, StylePreset[]>();
  private activePresetIdMap = new WeakMap<HTMLElement, string | null>();
  private savedPromptedStyles = new WeakMap<HTMLElement, SavedPromptedStyle[]>();
  private bookmarkedPresets = new WeakMap<HTMLElement, Set<string>>();

  private isActive = false; private isTransitioning = false; private isComparing = false; private isGhostMode = false;
  private abortController: AbortController | null = null;
  private lockedElement: HTMLElement | null = null;
  private toggleBtn: HTMLButtonElement | null = null; private toggleLabel: HTMLSpanElement | null = null;
  private ledgerBtn: HTMLButtonElement | null = null; private exportDivider: HTMLDivElement | null = null;
  private minBadge: HTMLButtonElement | null = null; private controlsStack: HTMLElement | null = null;

  public init(): void {
    try {
      const shadow = this.overlay.mount();
      [this.hierarchy, this.variationDock, this.customizer, this.ledgerModal, this.aiModal, this.helpModal].forEach((c) => c.mount(shadow));
      const ctrl = this.overlay.mountControls(() => this.toggle(), () => this.ledgerModal.show(this.commandHistory.getHistory()));
      this.toggleBtn = ctrl.toggleBtn; this.toggleLabel = ctrl.toggleLabel; this.ledgerBtn = ctrl.exportBtn;
      this.exportDivider = ctrl.exportDivider; this.minBadge = ctrl.minBadge; this.controlsStack = ctrl.controlsStack;
      const host = typeof window !== 'undefined' ? window.location?.hostname : '';
      if (host === 'localhost' || host === '127.0.0.1') void loadWorkspaceMutationsHelper();
      this.log('AuraCSS initialized in standby mode');

      let isAltPressed = false;
      const handleGlobalKey = (e: KeyboardEvent) => {
        if (e.key === 'Alt') { isAltPressed = true; e.preventDefault(); }
        if (e.repeat) return;
        const target = (e.composedPath ? e.composedPath()[0] : e.target) as HTMLElement | null;
        if (target?.tagName?.toLowerCase() === 'input' || target?.tagName?.toLowerCase() === 'textarea' || target?.isContentEditable) return;
        if ((e.altKey || isAltPressed) && (e.key.toLowerCase() === 'a' || e.code === 'KeyA')) {
          e.preventDefault(); e.stopPropagation();
          if (this.toggleBtn) this.toggleBtn.click(); else this.toggle();
        }
      };
      const handleGlobalKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'Alt') { isAltPressed = false; e.preventDefault(); e.stopPropagation(); }
      };
      window.addEventListener('keydown', handleGlobalKey, { capture: true });
      window.addEventListener('keyup', handleGlobalKeyUp, { capture: true });
      this.globalKeyCleanup = () => { window.removeEventListener('keydown', handleGlobalKey, true); window.removeEventListener('keyup', handleGlobalKeyUp, true); };

      const chromeApi = typeof globalThis !== 'undefined' ? (globalThis as unknown as { chrome?: { runtime?: { onMessage?: { addListener: (fn: (msg: unknown) => void) => void; removeListener: (fn: (msg: unknown) => void) => void; } } } }).chrome : undefined;
      if (chromeApi?.runtime?.onMessage) {
        const handleRuntimeMsg = (msg: unknown) => {
          if (msg && typeof msg === 'object' && (msg as { type?: string }).type === 'AURACSS_TOGGLE') {
            if (this.toggleBtn) this.toggleBtn.click(); else this.toggle();
          }
        };
        chromeApi.runtime.onMessage.addListener(handleRuntimeMsg);
        const prevCleanup = this.globalKeyCleanup;
        this.globalKeyCleanup = () => {
          prevCleanup?.();
          try { chromeApi.runtime?.onMessage?.removeListener(handleRuntimeMsg); } catch {}
        };
      }
    } catch (err) { this.error('Initialization failed', err); }
  }

  public toggle(): void { this.isActive ? this.deactivate() : this.activate(); }

  public activate(): void {
    if (this.isActive || this.isTransitioning) return;
    this.isTransitioning = true;
    try {
      this.isActive = true;
      if (this.toggleBtn && this.toggleLabel) { this.toggleBtn.classList.add('active'); this.toggleLabel.textContent = 'AuraCSS: ON'; }
      this.minBadge?.classList.add('active');
      if (this.ledgerBtn) this.ledgerBtn.style.display = 'inline-flex';
      if (this.exportDivider) this.exportDivider.style.display = 'block';
      if (typeof window !== 'undefined' && typeof window.focus === 'function') { try { window.focus(); } catch {} }
      if (this.controlsStack) {
        clampToViewport(this.controlsStack);
        if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(() => { if (this.controlsStack) clampToViewport(this.controlsStack); });
      }

      this.abortController = new AbortController();
      const sig = this.abortController.signal;
      window.addEventListener('mouseover', this.handleMouseOver, { capture: true, signal: sig });
      window.addEventListener('click', this.handleClick, { capture: true, signal: sig });
      window.addEventListener('scroll', this.handleScrollOrResize, { capture: true, passive: true, signal: sig });
      window.addEventListener('resize', this.handleScrollOrResize, { capture: true, passive: true, signal: sig });
      window.addEventListener('keydown', (e) => { try { this.keybindings.handleKeyDown(e); } catch (err) { this.error('handleKeyDown', err); } }, { capture: true, signal: sig });
      window.addEventListener('keyup', (e) => { try { this.keybindings.handleKeyUp(e); } catch (err) { this.error('handleKeyUp', err); } }, { capture: true, signal: sig });

      this.aiService.subscribeBridge((p) => {
        if (!this.isActive || (!this.lockedElement && !p.selector)) return;
        applyBridgePayloadHelper(p, {
          lockedElement: this.lockedElement, lockElement: (el) => this.lockElement(el),
          savedPromptedStyles: this.savedPromptedStyles, presetContext: this.getPresetContext(),
        });
      });
      this.aiService.notifyActiveElement(null);

      const sel = typeof localStorage !== 'undefined' ? localStorage.getItem('auracss_active_selector') : null;
      if (sel && !this.lockedElement) {
        try {
          const el = document.querySelector(sel);
          if (el && el instanceof HTMLElement && el.isConnected) this.lockElement(el);
        } catch {
          try { localStorage.removeItem('auracss_active_selector'); } catch {}
        }
      }
      this.overlay.announce('AuraCSS activated. Click any element to inspect.');
      this.helpModal.showToast('✦ AuraCSS: ON — Click any element to inspect (Press ? for shortcuts)');
      this.log('AuraCSS activated');
    } catch (err) {
      this.error('Activation failed', err);
      this.isActive = false;
      this.abortController?.abort();
      this.abortController = null;
      try { localStorage.removeItem('auracss_active_selector'); } catch {}
    } finally {
      this.isTransitioning = false;
    }
  }

  public deactivate(): void {
    if (!this.isActive || this.isTransitioning) return;
    this.isTransitioning = true;
    try {
      this.isActive = false;
      this.aiService.disconnectBridge();
      this.abortController?.abort();
      this.abortController = null;
      this.unlockElement();
      [this.overlay, this.hierarchy, this.variationDock].forEach(c => c.clear());
      [this.customizer, this.ledgerModal, this.aiModal, this.helpModal].forEach(c => c.hide());
      this.helpModal.hideToast();

      if (this.toggleBtn && this.toggleLabel) { this.toggleBtn.classList.remove('active'); this.toggleLabel.textContent = 'AuraCSS: OFF'; }
      if (this.minBadge) this.minBadge.classList.remove('active');
      if (this.ledgerBtn) this.ledgerBtn.style.display = 'none';
      if (this.exportDivider) this.exportDivider.style.display = 'none';
      this.overlay.announce('AuraCSS deactivated.');
      this.log('AuraCSS deactivated');
    } catch (err) {
      this.error('Deactivation failed', err);
    } finally {
      this.isTransitioning = false;
    }
  }

  private handleMouseOver = (e: MouseEvent): void => { try { if (!this.lockedElement) { const t = this.overlay.resolveHostElement(e); t ? this.overlay.updateHighlight(t, false) : this.overlay.clear(); } } catch (err) { this.error('handleMouseOver', err); } };
  private handleClick = (e: MouseEvent): void => { try { this.helpModal.hideToast(); const t = this.overlay.resolveHostElement(e); if (!t) return; e.preventDefault(); e.stopPropagation(); if ((e.ctrlKey || e.metaKey) && this.lockedElement === t) { this.unlockElement(); return; } if (this.lockedElement !== t) this.lockElement(t); } catch (err) { this.error('handleClick', err); } };
  private handleScrollOrResize = (): void => { try { if (this.lockedElement?.isConnected) { this.overlay.updateHighlight(this.lockedElement, true); const f = this.variationDock.dodgeTarget(this.lockedElement); this.hierarchy.dodgeTarget(this.lockedElement, f, this.variationDock.getDockRect()); } if (this.controlsStack) clampToViewport(this.controlsStack); } catch (err) { this.error('handleScrollOrResize', err); } };

  private keybindings = createKeybindingHandlers({
    getLockedElement: () => this.lockedElement, getIsComparing: () => this.isComparing,
    setIsComparing: (val) => { this.isComparing = val; }, unlockElement: () => this.unlockElement(),
    deactivate: () => this.deactivate(), commandHistory: this.commandHistory,
    updateLedgerCount: () => this.updateLedgerCount(), overlay: this.overlay,
    stylePatches: this.stylePatches, revertElement: (el) => this.revertElement(el),
    hierarchy: this.hierarchy, lockElement: (el) => this.lockElement(el),
    showHelp: () => this.helpModal.show(), toggleGhostMode: () => this.toggleGhostMode(),
  });
  private globalKeyCleanup: (() => void) | null = null;

  public toggleGhostMode(force?: boolean): void {
    this.isGhostMode = typeof force === 'boolean' ? force : !this.isGhostMode;
    this.variationDock.setGhostMode(this.isGhostMode);
    this.hierarchy.setGhostMode(this.isGhostMode);
    if (this.isGhostMode) this.helpModal.showToast('👻 Ghost HUD: ON — Click through to elements behind dock (Press H to restore)');
  }

  private lockElement(el: HTMLElement): void {
    this.lockedElement = el;
    this.toggleGhostMode(false);
    try { localStorage.setItem('auracss_active_selector', formatElementLabel(el)); } catch {}
    this.overlay.updateHighlight(el, true);
    this.hierarchy.render(el, (selected) => this.lockElement(selected));
    if (!this.currentDockPresets.has(el)) {
      this.aiVariationCycleMap.set(el, 0);
      this.currentDockPresets.set(el, this.suggester.suggest(el, this.harvester.harvest()));
    }
    this.refreshDock(el, this.stylePatches.has(el));
    const flipped = this.variationDock.dodgeTarget(el);
    this.hierarchy.dodgeTarget(el, flipped, this.variationDock.getDockRect());
    const patch = this.stylePatches.get(el);
    const lastPrompt = (this.savedPromptedStyles.get(el) || [])[0]?.name;
    this.aiService.notifyActiveElement({
      tag: el.tagName.toLowerCase(), selector: formatElementLabel(el), htmlSnippet: el.outerHTML.slice(0, 200),
      siteTokens: this.harvester.harvest(),
      currentMutations: patch ? { appliedCssText: patch.appliedCssText, tailwindClasses: patch.tailwindClasses, lastPrompt } : undefined,
    });
    this.log('Locked:', el);
    this.overlay.announce(`Selected <${el.tagName.toLowerCase()}> element.`);
  }

  private unlockElement(): void {
    if (!this.lockedElement) return;
    try { localStorage.removeItem('auracss_active_selector'); } catch {}
    this.lockedElement = null;
    this.isComparing = false;
    [this.overlay, this.hierarchy, this.variationDock].forEach((c) => c.clear());
    this.customizer.hide();
    this.aiService.notifyActiveElement(null);
    this.overlay.announce('Element selection cleared.');
  }

  private revertElement(el: HTMLElement): void {
    clearTypographyBaseline(el);
    revertElementHelper(this.getPresetContext(), el, () => {
      const presets = this.currentDockPresets.get(el) || this.suggester.suggest(el, this.harvester.harvest());
      this.renderDock(el, presets, false, this.aiVariationCycleMap.get(el));
      this.log('Reverted to original:', el);
    });
  }

  private getPresetContext = () => ({
    stylePatches: this.stylePatches, activePresetIdMap: this.activePresetIdMap, commandHistory: this.commandHistory,
    variationDock: this.variationDock, overlay: this.overlay, updateLedgerCount: () => this.updateLedgerCount(),
    refreshDock: (el: HTMLElement, isModified: boolean) => this.refreshDock(el, isModified),
  });

  private renderDock(el: HTMLElement, presets: StylePreset[], isModified: boolean, setIndex?: number): void {
    renderDockHelper({
      variationDock: this.variationDock, harvester: this.harvester, savedPromptedStyles: this.savedPromptedStyles,
      activePresetIdMap: this.activePresetIdMap, currentDockPresets: this.currentDockPresets, bookmarkedPresets: this.bookmarkedPresets,
      onApplyPreset: (elem, p) => this.applyPreset(elem, p), onRevert: (elem) => this.revertElement(elem),
      onApplyTypography: (elem, u) => applyTypographyUpdateHelper(elem, u, this.stylePatches.get(elem)?.tailwindClasses || '', (n, t, p) => this.commitStyleChange(elem, n, t, p)),
      onRevertTypography: (elem) => revertTypographyHelper(elem, (n, t, p) => this.commitStyleChange(elem, n, t, p), () => this.revertElement(elem)),
      onApplySwatch: (elem, hex) => applyColorSwatchHelper(elem, hex, this.stylePatches.get(elem)?.tailwindClasses || '', (n, t, p) => this.commitStyleChange(elem, n, t, p)),
      onOpenAISettings: (elem) => this.aiModal.show({ tag: elem.tagName.toLowerCase(), selector: formatElementLabel(elem) }),
      onRequestAISuggestions: (elem) => this.handleAISuggestions(elem), refreshDock: (elem, mod) => this.refreshDock(elem, mod),
      onPeek: (elem, p) => peekPresetHelper(this.getPresetContext(), elem, p, this.isComparing),
      onUnpeek: (elem) => unpeekPresetHelper(this.getPresetContext(), elem, this.isComparing),
    }, el, presets, isModified, setIndex);
  }

  public applyPreset(el: HTMLElement, preset: StylePreset): void {
    clearTypographyBaseline(el);
    applyPresetHelper(this.getPresetContext(), el, preset);
  }

  private commitStyleChange(el: HTMLElement, newCss: string, tw: string, prevCss: string): void {
    commitStyleChange(this.getPresetContext(), el, newCss, tw, prevCss);
  }

  private async handleAISuggestions(el: HTMLElement): Promise<void> {
    await handleAISuggestionsHelper(el, {
      aiService: this.aiService, aiModal: this.aiModal, variationCycleMap: this.aiVariationCycleMap,
      harvester: this.harvester, isModified: this.stylePatches.has(el),
      renderDock: (e, p, m, s) => this.renderDock(e, p, m, s), refreshDock: (e, m) => this.refreshDock(e, m),
    });
  }

  public handleTune(el: HTMLElement, update: StyleTuneUpdate): void {
    if (!el?.isConnected) return;
    const prevCss = el.style.cssText;
    el.style.setProperty(update.property, update.value);
    const p = this.stylePatches.get(el);
    commitStyleChange(this.getPresetContext(), el, el.style.cssText, p ? `${p.tailwindClasses} ${update.tailwind}` : update.tailwind, prevCss);
  }

  private refreshDock(el: HTMLElement, isModified: boolean): void {
    const presets = this.currentDockPresets.get(el) || this.suggester.suggest(el, this.harvester.harvest());
    this.renderDock(el, presets, isModified, this.aiVariationCycleMap.get(el));
  }

  private updateLedgerCount(): void {
    if (this.ledgerBtn) {
      this.ledgerBtn.textContent = `Export (${this.commandHistory.getUniqueElementCount()})`;
      if (this.controlsStack) clampToViewport(this.controlsStack);
    }
  }

  private log(msg: string, ...d: unknown[]): void { if (window.__AURACSS_DEBUG__ === true) console.log(`[AuraCSS] ${msg}`, ...d); }
  private error(msg: string, ...d: unknown[]): void { if (window.__AURACSS_DEBUG__ === true) console.error(`[AuraCSS Error] ${msg}`, ...d); }

  public destroy(): void {
    this.deactivate();
    this.globalKeyCleanup?.();
    [this.customizer, this.ledgerModal, this.aiModal, this.helpModal, this.variationDock, this.hierarchy, this.overlay].forEach((c) => c.destroy());
    this.commandHistory.clear();
    window.__AURACSS_INSTANCE__ = undefined;
  }
}

const isTestEnv = typeof process !== 'undefined' && Boolean(process.env?.VITEST);
if (!isTestEnv && typeof window !== 'undefined' && typeof document !== 'undefined') {
  const app = new AuraCSSApp();
  window.__AURACSS_INSTANCE__ = app;
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', () => app.init(), { once: true }) : app.init();
}
