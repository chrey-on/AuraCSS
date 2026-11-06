import { OverlayManager } from './overlay';
import { HierarchyManager, formatElementLabel } from './hierarchy';
import { AuraHarvester, parseColor, calculateLuminance } from './harvester';
import { AuraSuggester, VariationDock } from './suggester';
import { CommandHistory } from './command';
import { ChangeLedgerModal } from './ledger';
import { FineTuneCustomizer, type StyleTuneUpdate } from './customizer';
import { AIService } from './ai';
import { AISettingsModal } from './ai-modal';
import { synthesizeDesignPrompt } from './prompt';
import type { StylePreset, StylePatch, SavedPromptedStyle, TypographyUpdate } from './types';

declare global {
  interface Window {
    __AURACSS_DEBUG__?: boolean;
    __AURACSS_INSTANCE__?: AuraCSSApp;
  }
}

export class AuraCSSApp {
  private overlay = new OverlayManager();
  private hierarchy = new HierarchyManager();
  private harvester = new AuraHarvester();
  private suggester = new AuraSuggester();
  private variationDock = new VariationDock();
  private customizer = new FineTuneCustomizer();
  private commandHistory = new CommandHistory();
  private ledgerModal = new ChangeLedgerModal();
  private aiService = new AIService();
  private aiModal = new AISettingsModal(this.aiService);
  private stylePatches = new WeakMap<HTMLElement, StylePatch>();
  private aiVariationCycleMap = new WeakMap<HTMLElement, number>();
  private currentDockPresets = new WeakMap<HTMLElement, StylePreset[]>();
  private activePresetIdMap = new WeakMap<HTMLElement, string | null>();
  private savedPromptedStyles = new WeakMap<HTMLElement, SavedPromptedStyle[]>();

  private isActive = false;
  private isComparing = false;
  private abortController: AbortController | null = null;
  private lockedElement: HTMLElement | null = null;
  private toggleBtn: HTMLButtonElement | null = null;
  private toggleLabel: HTMLSpanElement | null = null;
  private ledgerBtn: HTMLButtonElement | null = null;
  private exportDivider: HTMLDivElement | null = null;
  private minBadge: HTMLButtonElement | null = null;

  public init(): void {
    try {
      const shadow = this.overlay.mount();
      [this.hierarchy, this.variationDock, this.customizer, this.ledgerModal, this.aiModal].forEach((c) => c.mount(shadow));
      const ctrl = this.overlay.mountControls(() => this.toggle(), () => this.ledgerModal.show(this.commandHistory.getHistory()));
      this.toggleBtn = ctrl.toggleBtn;
      this.toggleLabel = ctrl.toggleLabel;
      this.ledgerBtn = ctrl.exportBtn;
      this.exportDivider = ctrl.exportDivider;
      this.minBadge = ctrl.minBadge;
      this.aiService.subscribeBridge((p) => {
        const target = this.lockedElement || (p.selector ? (document.querySelector(p.selector) as HTMLElement | null) : null);
        if (target && target instanceof HTMLElement) {
          if (!this.lockedElement) {
            this.lockElement(target);
          }
          const promptLabel = p.name || (p.prompt ? (p.prompt.length > 25 ? p.prompt.slice(0, 22) + '...' : p.prompt) : 'Agent Prompt Result');
          const promptDesc = p.description || (p.prompt ? `Prompt: "${p.prompt}"` : 'Synthesized & streamed from Antigravity agent');
          const style: SavedPromptedStyle = {
            id: `prompted-${Date.now()}`,
            name: promptLabel,
            description: promptDesc,
            cssText: p.cssText,
            tailwindClasses: p.tailwindClasses || '',
            timestamp: Date.now(),
            contrastRating: 'AAA',
            contrastRatio: '7.5:1',
          };
          this.recordSavedPromptedStyle(target, style);
          this.applyPreset(target, style);
        }
      });
      this.log('AuraCSS initialized in standby mode');
    } catch (err) { this.error('Initialization failed', err); }
  }

  public toggle(): void { this.isActive ? this.deactivate() : this.activate(); }

  public activate(): void {
    if (this.isActive) return;
    this.isActive = true;
    if (this.toggleBtn && this.toggleLabel) {
      this.toggleBtn.classList.add('active');
      this.toggleLabel.textContent = 'AuraCSS: ON';
    }
    this.minBadge?.classList.add('active');
    if (this.ledgerBtn) this.ledgerBtn.style.display = 'inline-flex';
    if (this.exportDivider) this.exportDivider.style.display = 'block';

    this.abortController = new AbortController();
    const opts: AddEventListenerOptions = { capture: true, signal: this.abortController.signal };
    const pOpts = { ...opts, passive: true };
    window.addEventListener('mouseover', this.handleMouseOver, opts);
    window.addEventListener('click', this.handleClick, opts);
    window.addEventListener('scroll', this.handleScrollOrResize, pOpts);
    window.addEventListener('resize', this.handleScrollOrResize, pOpts);
    window.addEventListener('keydown', this.handleKeyDown, opts);
    window.addEventListener('keyup', this.handleKeyUp, opts);
    this.log('AuraCSS activated');
  }

  public deactivate(): void {
    if (!this.isActive) return;
    this.isActive = false;
    this.abortController?.abort();
    this.abortController = null;
    this.unlockElement();
    [this.overlay, this.hierarchy, this.variationDock].forEach((c) => c.clear());
    [this.customizer, this.ledgerModal, this.aiModal].forEach((c) => c.hide());

    if (this.toggleBtn && this.toggleLabel) {
      this.toggleBtn.classList.remove('active');
      this.toggleLabel.textContent = 'AuraCSS: OFF';
    }
    this.minBadge?.classList.remove('active');
    if (this.ledgerBtn) this.ledgerBtn.style.display = 'none';
    if (this.exportDivider) this.exportDivider.style.display = 'none';
    this.log('AuraCSS deactivated');
  }

  private handleMouseOver = (e: MouseEvent): void => {
    try {
      if (this.lockedElement) return;
      const target = this.overlay.resolveHostElement(e);
      target ? this.overlay.updateHighlight(target, false) : this.overlay.clear();
    } catch (err) { this.error('handleMouseOver', err); }
  };

  private handleClick = (e: MouseEvent): void => {
    try {
      const target = this.overlay.resolveHostElement(e);
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      this.lockedElement === target ? this.unlockElement() : this.lockElement(target);
    } catch (err) { this.error('handleClick', err); }
  };

  private handleScrollOrResize = (): void => {
    try {
      if (this.lockedElement?.isConnected) this.overlay.updateHighlight(this.lockedElement, true);
    } catch (err) { this.error('handleScrollOrResize', err); }
  };

  private handleKeyDown = (e: KeyboardEvent): void => {
    try {
      const path = e.composedPath ? e.composedPath() : [e.target];
      const targetEl = path[0] as HTMLElement | null;
      if (targetEl?.tagName?.toLowerCase() === 'input' || targetEl?.tagName?.toLowerCase() === 'textarea') return;

      if (e.key === 'Escape') {
        this.lockedElement ? this.unlockElement() : this.deactivate();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        const cmd = (e.key.toLowerCase() === 'y' || e.shiftKey) ? this.commandHistory.redo() : this.commandHistory.undo();
        if (cmd?.element?.isConnected) this.overlay.updateHighlight(cmd.element, true);
        this.updateLedgerCount();
        return;
      }
      if (e.code === 'Space' && this.lockedElement && !this.isComparing) {
        e.preventDefault();
        const p = this.stylePatches.get(this.lockedElement);
        if (p) { this.isComparing = true; this.lockedElement.style.cssText = p.originalCssText; this.overlay.updateHighlight(this.lockedElement, true); }
      }
      if (this.lockedElement && e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        this.revertElement(this.lockedElement);
        return;
      }
      if (this.lockedElement && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        const next = e.key === 'ArrowUp' ? this.hierarchy.navigateUp(this.lockedElement) : this.hierarchy.navigateDown(this.lockedElement);
        if (next) this.lockElement(next);
      }
    } catch (err) { this.error('handleKeyDown', err); }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    try {
      if (e.code === 'Space' && this.isComparing && this.lockedElement) {
        e.preventDefault();
        this.isComparing = false;
        const p = this.stylePatches.get(this.lockedElement);
        if (p) { this.lockedElement.style.cssText = p.appliedCssText; this.overlay.updateHighlight(this.lockedElement, true); }
      }
    } catch (err) { this.error('handleKeyUp', err); }
  };

  private lockElement(el: HTMLElement): void {
    this.lockedElement = el;
    this.overlay.updateHighlight(el, true);
    this.hierarchy.render(el, (selected) => this.lockElement(selected));
    if (!this.currentDockPresets.has(el)) {
      this.currentDockPresets.set(el, this.suggester.suggest(el, this.harvester.harvest()));
    }
    this.refreshDock(el, this.stylePatches.has(el));
    this.aiService.notifyActiveElement({
      tag: el.tagName.toLowerCase(),
      selector: formatElementLabel(el),
      htmlSnippet: el.outerHTML.slice(0, 200),
      siteTokens: this.harvester.harvest(),
    });
    this.log('Locked:', el);
  }

  private unlockElement(): void {
    if (!this.lockedElement) return;
    this.lockedElement = null;
    this.isComparing = false;
    this.overlay.clear();
    this.hierarchy.clear();
    this.variationDock.clear();
    this.customizer.hide();
  }

  private revertElement(el: HTMLElement): void {
    const patch = this.stylePatches.get(el);
    if (!patch) return;
    el.style.cssText = patch.originalCssText;
    this.stylePatches.delete(el);
    this.commandHistory.removeElement(el);
    this.activePresetIdMap.set(el, null);
    this.variationDock.setActivePresetId(null);
    this.updateLedgerCount();
    this.overlay.updateHighlight(el, true);
    const presets = this.currentDockPresets.get(el) || this.suggester.suggest(el, this.harvester.harvest());
    this.renderDock(el, presets, false, this.aiVariationCycleMap.get(el));
    this.log('Reverted to original:', el);
  }

  private deselectElement(el: HTMLElement): void {
    this.revertElement(el);
  }

  private commitStyleChange(el: HTMLElement, newCss: string, tw: string, prevCss: string): void {
    const original = this.stylePatches.get(el)?.originalCssText ?? prevCss;
    this.stylePatches.set(el, { originalCssText: original, appliedCssText: newCss, tailwindClasses: tw });
    this.commandHistory.execute({
      element: el,
      selectorPath: formatElementLabel(el),
      previousCssText: prevCss,
      appliedCssText: newCss,
      tailwindClasses: tw,
      timestamp: Date.now(),
    });
    this.updateLedgerCount();
    this.overlay.updateHighlight(el, true);
    this.refreshDock(el, true);
  }

  private applyPreset(el: HTMLElement, preset: StylePreset): void {
    if (!el?.isConnected) return;
    this.activePresetIdMap.set(el, preset.id);
    this.variationDock.setActivePresetId(preset.id);
    const current = this.stylePatches.get(el);
    if (current && current.appliedCssText === preset.cssText) return;
    const prevCss = el.style.cssText;
    el.style.cssText = preset.cssText;
    this.commitStyleChange(el, preset.cssText, preset.tailwindClasses, prevCss);
  }

  private applyIncrementalPreset(el: HTMLElement, preset: StylePreset): void {
    if (!el?.isConnected) return;
    const prevCss = el.style.cssText;
    const temp = document.createElement('div');
    temp.style.cssText = preset.cssText;
    for (let i = 0; i < temp.style.length; i++) {
      const prop = temp.style[i]!;
      const val = temp.style.getPropertyValue(prop);
      const prio = temp.style.getPropertyPriority(prop);
      el.style.setProperty(prop, val, prio);
    }
    const finalCss = el.style.cssText;
    const p = this.stylePatches.get(el);
    const finalTw = p ? `${p.tailwindClasses} ${preset.tailwindClasses}`.trim() : preset.tailwindClasses;
    this.commitStyleChange(el, finalCss, finalTw, prevCss);
  }

  private recordSavedPromptedStyle(el: HTMLElement, style: SavedPromptedStyle): void {
    const list = this.savedPromptedStyles.get(el) || [];
    const filtered = list.filter((s) => s.cssText !== style.cssText);
    filtered.unshift(style);
    this.savedPromptedStyles.set(el, filtered);
  }

  private async handlePrompt(el: HTMLElement, prompt: string): Promise<void> {
    if (!el?.isConnected) return;
    const preset = await synthesizeDesignPrompt(prompt, el, this.harvester.harvest(), this.aiService);
    const style: SavedPromptedStyle = {
      id: `prompted-${Date.now()}`,
      name: preset.name || 'Prompted Style',
      description: preset.description || `Prompt: "${prompt}"`,
      cssText: preset.cssText,
      tailwindClasses: preset.tailwindClasses,
      timestamp: Date.now(),
      contrastRating: preset.contrastRating,
      contrastRatio: preset.contrastRatio,
    };
    this.recordSavedPromptedStyle(el, style);
    this.applyIncrementalPreset(el, preset);
  }

  private applyColorSwatch(el: HTMLElement, hex: string): void {
    if (!el?.isConnected) return;
    const parsed = parseColor(hex);
    const lum = parsed ? calculateLuminance(parsed) : 0;
    const isLight = lum > 0.4;
    const textColor = isLight ? '#0f172a' : '#ffffff';
    const prevCss = el.style.cssText;
    el.style.backgroundColor = hex;
    el.style.color = textColor;
    const finalCss = el.style.cssText;
    const prevTw = this.stylePatches.get(el)?.tailwindClasses || '';
    const filteredTw = prevTw
      .split(/\s+/)
      .filter((cls) => cls && !cls.startsWith('bg-') && !cls.startsWith('text-'))
      .join(' ')
      .trim();
    const tw = filteredTw
      ? `${filteredTw} bg-[${hex}] text-[${textColor}]`
      : `bg-[${hex}] text-[${textColor}]`;
    this.commitStyleChange(el, finalCss, tw, prevCss);
  }

  private applyTypographyUpdate(el: HTMLElement, update: TypographyUpdate): void {
    if (!el?.isConnected) return;
    const prevCss = el.style.cssText;
    el.style.setProperty(update.property, update.value);
    const finalCss = el.style.cssText;

    const prevTw = this.stylePatches.get(el)?.tailwindClasses || '';
    let filteredTw = prevTw;
    if (update.property === 'color') {
      filteredTw = prevTw.split(/\s+/).filter((c) => c && !c.startsWith('text-')).join(' ');
    } else if (update.property === 'font-size') {
      filteredTw = prevTw.split(/\s+/).filter((c) => c && !c.startsWith('text-xs') && !c.startsWith('text-sm') && !c.startsWith('text-base') && !c.startsWith('text-lg') && !c.startsWith('text-xl') && !c.startsWith('text-2xl')).join(' ');
    } else if (update.property === 'font-family') {
      filteredTw = prevTw.split(/\s+/).filter((c) => c && !c.startsWith('font-sans') && !c.startsWith('font-mono') && !c.startsWith('font-serif') && !c.startsWith('font-display')).join(' ');
    } else if (update.property === 'font-weight') {
      filteredTw = prevTw.split(/\s+/).filter((c) => c && !c.startsWith('font-normal') && !c.startsWith('font-medium') && !c.startsWith('font-semibold') && !c.startsWith('font-bold')).join(' ');
    }

    const tw = filteredTw ? `${filteredTw.trim()} ${update.tailwind}`.trim() : update.tailwind;
    this.commitStyleChange(el, finalCss, tw, prevCss);
  }

  private deleteSavedPromptedStyle(el: HTMLElement, id: string): void {
    const list = this.savedPromptedStyles.get(el) || [];
    const filtered = list.filter((s) => s.id !== id);
    this.savedPromptedStyles.set(el, filtered);
    this.refreshDock(el, this.stylePatches.has(el));
  }

  private clearSavedPromptedStyles(el: HTMLElement): void {
    this.savedPromptedStyles.set(el, []);
    this.refreshDock(el, this.stylePatches.has(el));
  }

  private renderDock(el: HTMLElement, presets: StylePreset[], isModified: boolean, setIndex?: number): void {
    this.currentDockPresets.set(el, presets);
    const saved = this.savedPromptedStyles.get(el) || [];
    const tokens = this.harvester.harvest();
    this.variationDock.render(
      presets,
      (p) => this.applyPreset(el, p),
      () => this.revertElement(el),
      isModified,
      (prompt) => this.handlePrompt(el, prompt),
      () => this.variationDock.togglePalettePopover(
        (u) => this.applyTypographyUpdate(el, u)
      ),
      () => this.aiModal.show({
        tag: el.tagName.toLowerCase(),
        selector: formatElementLabel(el),
      }),
      () => this.handleAISuggestions(el),
      setIndex,
      () => this.deselectElement(el),
      saved,
      (s) => this.applyPreset(el, s),
      tokens,
      (theme) => this.applyPreset(el, theme),
      (hex) => this.applyColorSwatch(el, hex),
      (u) => this.applyTypographyUpdate(el, u),
      (style) => this.deleteSavedPromptedStyle(el, style.id),
      () => this.clearSavedPromptedStyles(el)
    );
    const activeId = this.activePresetIdMap.get(el);
    if (activeId) {
      this.variationDock.setActivePresetId(activeId);
    }
  }

  private async handleAISuggestions(el: HTMLElement): Promise<void> {
    if (!el?.isConnected) return;
    if (!this.aiService.isConfigured()) {
      this.aiModal.show();
      return;
    }
    const currentSet = this.aiVariationCycleMap.get(el) ?? -1;
    const nextSet = (currentSet + 1) % 3;
    this.aiVariationCycleMap.set(el, nextSet);
    try {
      const presets = await this.aiService.generateAISuggestions(
        {
          tag: el.tagName.toLowerCase(),
          htmlSnippet: el.outerHTML.slice(0, 200),
          computedStyles: { color: el.style.color, backgroundColor: el.style.backgroundColor },
          siteTokens: this.harvester.harvest(),
        },
        undefined,
        nextSet
      );
      this.renderDock(el, presets, this.stylePatches.has(el), nextSet);
    } catch { this.refreshDock(el, this.stylePatches.has(el)); }
  }

  public handleTune(el: HTMLElement, update: StyleTuneUpdate): void {
    if (!el?.isConnected) return;
    const prevCss = el.style.cssText;
    el.style.setProperty(update.property, update.value);
    const p = this.stylePatches.get(el);
    this.commitStyleChange(el, el.style.cssText, p ? `${p.tailwindClasses} ${update.tailwind}` : update.tailwind, prevCss);
  }

  private refreshDock(el: HTMLElement, isModified: boolean): void {
    const presets = this.currentDockPresets.get(el) || this.suggester.suggest(el, this.harvester.harvest());
    this.renderDock(el, presets, isModified, this.aiVariationCycleMap.get(el));
  }

  private updateLedgerCount(): void {
    if (this.ledgerBtn) this.ledgerBtn.textContent = `Export (${this.commandHistory.getUniqueElementCount()})`;
  }

  private log(message: string, ...details: unknown[]): void {
    if (window.__AURACSS_DEBUG__ === true) console.log(`[AuraCSS] ${message}`, ...details);
  }

  private error(message: string, ...details: unknown[]): void {
    if (window.__AURACSS_DEBUG__ === true) console.error(`[AuraCSS Error] ${message}`, ...details);
  }

  public destroy(): void {
    this.deactivate();
    [this.customizer, this.ledgerModal, this.aiModal, this.variationDock, this.hierarchy, this.overlay].forEach((c) => c.destroy());
    this.commandHistory.clear();
    window.__AURACSS_INSTANCE__ = undefined;
  }
}

const isTestEnv = typeof process !== 'undefined' && Boolean(process.env?.VITEST);
if (!isTestEnv && typeof window !== 'undefined' && typeof document !== 'undefined') {
  const app = new AuraCSSApp();
  window.__AURACSS_INSTANCE__ = app;
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', () => app.init(), { once: true })
    : app.init();
}
