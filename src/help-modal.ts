// AuraCSS Shortcut Cheat Sheet & Activation Toast HUD
const HELP_STYLES = `
.auracss-hud-toast {
  position: fixed; top: 16px; left: 50%; transform: translateX(-50%) translateY(-12px);
  background: rgba(15, 23, 42, 0.94); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(56, 189, 248, 0.45); border-radius: 9999px;
  padding: 6px 18px; color: #f8fafc; font-size: 12px; font-weight: 600;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 16px rgba(56, 189, 248, 0.35);
  pointer-events: none; z-index: 2147483647; opacity: 0;
  transition: opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; user-select: none;
}
.auracss-hud-toast.visible {
  opacity: 1; transform: translateX(-50%) translateY(0);
}
.auracss-hud-toast-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8; flex-shrink: 0;
}
.auracss-help-backdrop {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  display: none; align-items: center; justify-content: center;
  z-index: 2147483647; pointer-events: auto; padding: 16px;
}
.auracss-help-backdrop.visible { display: flex; }
.auracss-help-card {
  width: 520px; max-width: 95vw; max-height: 85vh; overflow-y: auto;
  background: rgba(15, 23, 42, 0.96); border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
  color: #f8fafc; padding: 20px 24px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.auracss-help-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 12px;
}
.auracss-help-title { font-size: 14px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 6px; }
.auracss-help-close {
  background: transparent; border: none; color: #94a3b8; font-size: 16px; cursor: pointer;
  padding: 4px 8px; border-radius: 6px; transition: all 0.15s ease;
}
.auracss-help-close:hover { background: rgba(255, 255, 255, 0.1); color: #ffffff; }
.auracss-help-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 540px) { .auracss-help-grid { grid-template-columns: 1fr; } }
.auracss-help-section { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px; }
.auracss-help-section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; font-weight: 700; margin-bottom: 8px; }
.auracss-help-item { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 12px; margin-bottom: 6px; }
.auracss-help-item:last-child { margin-bottom: 0; }
.auracss-help-desc { color: #cbd5e1; }
.auracss-kbd {
  background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px; padding: 2px 6px; font-size: 11px; font-weight: 600; color: #f8fafc;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.auracss-help-footer { margin-top: 14px; font-size: 11px; color: #64748b; text-align: center; }
`;

export class HelpModal {
  private backdropEl: HTMLDivElement | null = null;
  private toastEl: HTMLDivElement | null = null;
  private toastTimer: ReturnType<typeof setTimeout> | null = null;
  private prevFocusedEl: HTMLElement | null = null;
  private trapCleanup: (() => void) | null = null;

  public mount(shadow: ShadowRoot): void {
    if (this.backdropEl) return;

    const styleEl = document.createElement('style');
    styleEl.textContent = HELP_STYLES;
    shadow.appendChild(styleEl);

    // Toast HUD
    const toast = document.createElement('div');
    toast.className = 'auracss-hud-toast';
    const dot = document.createElement('span');
    dot.className = 'auracss-hud-toast-dot';
    const text = document.createElement('span');
    toast.append(dot, text);
    shadow.appendChild(toast);
    this.toastEl = toast;

    // Help Dialog
    const backdrop = document.createElement('div');
    backdrop.className = 'auracss-help-backdrop';
    backdrop.onclick = (e) => { if (e.target === backdrop) this.hide(); };

    const card = document.createElement('div');
    card.className = 'auracss-help-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-label', 'AuraCSS Shortcuts & Gestures');

    const header = document.createElement('div');
    header.className = 'auracss-help-header';
    const title = document.createElement('div');
    title.className = 'auracss-help-title';
    title.innerHTML = '✦ AuraCSS Shortcuts & Gestures';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'auracss-help-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Close help dialog');
    closeBtn.textContent = '✕';
    closeBtn.onclick = () => this.hide();
    header.append(title, closeBtn);

    const grid = document.createElement('div');
    grid.className = 'auracss-help-grid';

    // Section 1: Navigation
    const s1 = this.createSection('Targeting & Traversal', [
      { desc: 'Inspect / Lock element', kbd: 'Click' },
      { desc: 'Deselect element', kbd: 'Ctrl+Click' },
      { desc: 'Traverse parent node', kbd: 'ArrowUp' },
      { desc: 'Traverse child node', kbd: 'ArrowDown' },
    ]);

    // Section 2: Variations & History
    const s2 = this.createSection('Variations & History', [
      { desc: 'Hold to compare original', kbd: 'Spacebar' },
      { desc: 'Undo last mutation', kbd: 'Ctrl+Z' },
      { desc: 'Redo mutation', kbd: 'Ctrl+Y' },
      { desc: 'Revert to original state', kbd: 'Alt+R' },
    ]);

    // Section 3: Controls & Modals
    const s3 = this.createSection('Controls & Dialogs', [
      { desc: 'Toggle AuraCSS ON/OFF', kbd: 'Alt+A' },
      { desc: 'Open shortcut cheat sheet', kbd: '?' },
      { desc: 'Close dialogs / deselect', kbd: 'Esc' },
    ]);

    // Section 4: AI & Export
    const s4 = this.createSection('AI & Export', [
      { desc: 'View CSS / Tailwind Ledger', kbd: 'Export (N)' },
      { desc: 'Commit to disk workspace', kbd: 'Commit' },
      { desc: 'Cycle variation catalogues', kbd: 'Dock Next' },
    ]);

    grid.append(s1, s2, s3, s4);

    const footer = document.createElement('div');
    footer.className = 'auracss-help-footer';
    footer.textContent = 'AuraCSS ambient non-destructive styling engine • Press Esc to close';

    card.append(header, grid, footer);
    backdrop.appendChild(card);
    shadow.appendChild(backdrop);
    this.backdropEl = backdrop;
  }

  private createSection(titleText: string, items: { desc: string; kbd: string }[]): HTMLElement {
    const sec = document.createElement('div');
    sec.className = 'auracss-help-section';
    const title = document.createElement('div');
    title.className = 'auracss-help-section-title';
    title.textContent = titleText;
    sec.appendChild(title);

    for (const item of items) {
      const row = document.createElement('div');
      row.className = 'auracss-help-item';
      const desc = document.createElement('span');
      desc.className = 'auracss-help-desc';
      desc.textContent = item.desc;
      const kbd = document.createElement('span');
      kbd.className = 'auracss-kbd';
      kbd.textContent = item.kbd;
      row.append(desc, kbd);
      sec.appendChild(row);
    }
    return sec;
  }

  public showToast(message: string, duration = 2500): void {
    if (!this.toastEl) return;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    const textSpan = this.toastEl.querySelector('span:last-child');
    if (textSpan) textSpan.textContent = message;
    this.toastEl.classList.add('visible');

    this.toastTimer = setTimeout(() => {
      this.toastEl?.classList.remove('visible');
      this.toastTimer = null;
    }, duration);
  }

  public hideToast(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    this.toastEl?.classList.remove('visible');
  }

  public show(): void {
    if (!this.backdropEl) return;
    this.hideToast();
    this.prevFocusedEl = (document.activeElement as HTMLElement | null) || null;
    this.backdropEl.classList.add('visible');

    const focusables = Array.from(this.backdropEl.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
    if (focusables.length > 0) setTimeout(() => focusables[0]?.focus(), 40);

    const onKeyDown = (e: KeyboardEvent) => {
      if (!this.backdropEl?.classList.contains('visible')) return;
      if (e.key === 'Escape') {
        e.preventDefault(); e.stopPropagation(); this.hide(); return;
      }
      if (e.key === 'Tab') {
        const curFocusables = Array.from(this.backdropEl.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ));
        if (curFocusables.length === 0) return;
        const first = curFocusables[0];
        const last = curFocusables[curFocusables.length - 1];
        const root = (this.backdropEl.getRootNode() as ShadowRoot | Document) || document;
        const active = root.activeElement || document.activeElement;
        if (e.shiftKey) {
          if (active === first || !this.backdropEl.contains(active as Node)) {
            e.preventDefault(); last?.focus();
          }
        } else {
          if (active === last || !this.backdropEl.contains(active as Node)) {
            e.preventDefault(); first?.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown, { capture: true });
    this.trapCleanup = () => window.removeEventListener('keydown', onKeyDown, true);
  }

  public hide(): void {
    this.backdropEl?.classList.remove('visible');
    this.trapCleanup?.();
    this.trapCleanup = null;
    if (this.prevFocusedEl && typeof this.prevFocusedEl.focus === 'function') {
      try { this.prevFocusedEl.focus(); } catch {}
      this.prevFocusedEl = null;
    }
  }

  public destroy(): void {
    this.hide();
    this.hideToast();
    if (this.backdropEl && this.backdropEl.parentNode) {
      this.backdropEl.parentNode.removeChild(this.backdropEl);
    }
    if (this.toastEl && this.toastEl.parentNode) {
      this.toastEl.parentNode.removeChild(this.toastEl);
    }
    this.backdropEl = null;
    this.toastEl = null;
  }
}
