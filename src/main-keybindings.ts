import type { CommandHistory } from './command';
import type { HierarchyManager } from './hierarchy';
import type { OverlayManager } from './overlay';
import type { StylePatch } from './types';

export interface KeybindingContext {
  getLockedElement: () => HTMLElement | null;
  getIsComparing: () => boolean;
  setIsComparing: (val: boolean) => void;
  unlockElement: () => void;
  deactivate: () => void;
  commandHistory: CommandHistory;
  updateLedgerCount: () => void;
  overlay: OverlayManager;
  stylePatches: WeakMap<HTMLElement, StylePatch>;
  revertElement: (el: HTMLElement) => void;
  hierarchy: HierarchyManager;
  lockElement: (el: HTMLElement) => void;
  showHelp: () => void;
}

export function createKeybindingHandlers(ctx: KeybindingContext): {
  handleKeyDown: (e: KeyboardEvent) => void;
  handleKeyUp: (e: KeyboardEvent) => void;
} {
  let lastEscape = 0;
  const handleKeyDown = (e: KeyboardEvent): void => {
    const path = e.composedPath ? e.composedPath() : [e.target];
    const targetEl = path[0] as HTMLElement | null;
    if (targetEl?.tagName?.toLowerCase() === 'input' || targetEl?.tagName?.toLowerCase() === 'textarea' || targetEl?.isContentEditable) return;

    const locked = ctx.getLockedElement();

    if (e.key === 'Escape') {
      if (locked) { ctx.unlockElement(); lastEscape = 0; return; }
      if (lastEscape > 0 && Date.now() - lastEscape < 1500) { ctx.deactivate(); lastEscape = 0; }
      lastEscape = Date.now();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'y')) {
      e.preventDefault();
      const cmd = (e.key.toLowerCase() === 'y' || e.shiftKey) ? ctx.commandHistory.redo() : ctx.commandHistory.undo();
      if (cmd?.element?.isConnected) ctx.overlay.updateHighlight(cmd.element, true);
      ctx.updateLedgerCount();
      return;
    }
    if ((e.code === 'Space' || e.key === ' ') && locked) {
      e.preventDefault();
      if (!ctx.getIsComparing()) {
        const p = ctx.stylePatches.get(locked);
        if (p) {
          ctx.setIsComparing(true);
          locked.style.cssText = p.originalCssText;
          ctx.overlay.updateHighlight(locked, true);
        }
      }
      return;
    }
    if (locked && e.altKey && e.key.toLowerCase() === 'r') {
      e.preventDefault();
      ctx.revertElement(locked);
      return;
    }
    if (locked && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
      const next = e.key === 'ArrowUp' ? ctx.hierarchy.navigateUp(locked) : ctx.hierarchy.navigateDown(locked);
      if (next) ctx.lockElement(next);
      return;
    }
    if (e.key === '?' || (e.shiftKey && e.key === '/') || e.key === 'F1') {
      e.preventDefault();
      ctx.showHelp();
      return;
    }
  };

  const handleKeyUp = (e: KeyboardEvent): void => {
    const locked = ctx.getLockedElement();
    if ((e.code === 'Space' || e.key === ' ') && locked) {
      e.preventDefault();
      if (ctx.getIsComparing()) {
        ctx.setIsComparing(false);
        const p = ctx.stylePatches.get(locked);
        if (p) {
          locked.style.cssText = p.appliedCssText;
          ctx.overlay.updateHighlight(locked, true);
        }
      }
    }
  };

  return { handleKeyDown, handleKeyUp };
}
