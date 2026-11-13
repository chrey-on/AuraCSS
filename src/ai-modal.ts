import type { AIService } from './ai';

const AI_MODAL_STYLES = `
.auracss-ai-modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: none; align-items: center; justify-content: center; z-index: 2147483647; pointer-events: auto; }
.auracss-ai-modal-backdrop.visible { display: flex; }
.auracss-ai-modal { background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; width: 440px; max-width: 92vw; padding: 20px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7); display: flex; flex-direction: column; gap: 14px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc; }
.auracss-ai-modal-header { display: flex; justify-content: space-between; align-items: center; }
.auracss-ai-modal-title { font-size: 15px; font-weight: 700; color: #38bdf8; display: flex; align-items: center; gap: 6px; }
.auracss-ai-modal-close { background: transparent; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; padding: 4px; border-radius: 4px; }
.auracss-ai-modal-close:hover { color: #f8fafc; background: rgba(255, 255, 255, 0.1); }
.auracss-ai-bridge-card {
  display: flex; flex-direction: column; gap: 8px; padding: 14px 16px; border-radius: 10px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%);
  border: 1px solid rgba(56, 189, 248, 0.25);
}
.auracss-ai-bridge-header { display: flex; align-items: center; justify-content: space-between; }
.auracss-ai-bridge-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s ease; }
.auracss-ai-bridge-badge.connected { color: #38bdf8; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); }
.auracss-ai-bridge-badge.offline { color: #f87171; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); }
.auracss-ai-bridge-port { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; color: #c084fc; background: rgba(168, 85, 247, 0.15); padding: 2px 7px; border-radius: 4px; border: 1px solid rgba(168, 85, 247, 0.3); }
.auracss-ai-bridge-title { font-size: 13px; font-weight: 700; color: #f8fafc; }
.auracss-ai-bridge-desc { font-size: 12px; line-height: 1.45; color: #94a3b8; }
.auracss-diag-section {
  display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); font-size: 11.5px;
}
.auracss-diag-row { display: flex; justify-content: space-between; align-items: center; }
.auracss-diag-label { color: #64748b; font-weight: 600; }
.auracss-diag-val { color: #cbd5e1; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; }
.auracss-ai-status { font-size: 11px; padding: 4px 8px; border-radius: 4px; width: fit-content; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.auracss-ai-status.connected { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); }
.auracss-ai-status.error { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
.auracss-ai-status.untested { background: rgba(234, 179, 8, 0.2); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.4); }
.auracss-ai-status.offline { background: rgba(148, 163, 184, 0.15); color: #94a3b8; border: 1px solid rgba(148, 163, 184, 0.3); }
.auracss-ai-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
.auracss-ai-btn { padding: 8px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s ease; }
.auracss-ai-btn-secondary { background: rgba(255, 255, 255, 0.08); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.15); }
.auracss-ai-btn-secondary:hover { background: rgba(255, 255, 255, 0.15); }
.auracss-ai-btn-primary { background: #38bdf8; color: #0f172a; }
.auracss-ai-btn-primary:hover { background: #7dd3fc; }
`;

export interface ActiveElementInfo {
  tag: string;
  selector: string;
  dimensions?: string;
  primaryColor?: string;
}

export class AISettingsModal {
  private backdropEl: HTMLDivElement | null = null;
  private statusEl: HTMLDivElement | null = null;
  private badgeEl: HTMLSpanElement | null = null;
  private targetValEl: HTMLSpanElement | null = null;
  private aiService: AIService;
  private prevFocusedEl: HTMLElement | null = null;
  private trapCleanup: (() => void) | null = null;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  public mount(shadow: ShadowRoot): void {
    if (this.backdropEl) return;

    const styleEl = document.createElement('style');
    styleEl.textContent = AI_MODAL_STYLES;
    shadow.appendChild(styleEl);

    const backdrop = document.createElement('div');
    backdrop.className = 'auracss-ai-modal-backdrop';
    backdrop.onclick = (e) => {
      if (e.target === backdrop) this.hide();
    };

    const modal = document.createElement('div');
    modal.className = 'auracss-ai-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Antigravity Agent Diagnostics');

    // Header
    const header = document.createElement('div');
    header.className = 'auracss-ai-modal-header';
    const title = document.createElement('div');
    title.className = 'auracss-ai-modal-title';
    title.innerHTML = '⚡ Antigravity Agent Diagnostics';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'auracss-ai-modal-close';
    closeBtn.setAttribute('aria-label', 'Close Diagnostics Modal');
    closeBtn.type = 'button';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = () => this.hide();
    header.append(title, closeBtn);
    modal.appendChild(header);

    // Bridge Status Info Card (Zero-Key)
    const bridgeCard = document.createElement('div');
    bridgeCard.className = 'auracss-ai-bridge-card';

    const bridgeHeader = document.createElement('div');
    bridgeHeader.className = 'auracss-ai-bridge-header';

    const badge = document.createElement('span');
    badge.className = 'auracss-ai-bridge-badge connected';
    badge.innerHTML = '⚡ Agent Bridge Active';
    this.badgeEl = badge;

    const portSpan = document.createElement('span');
    portSpan.className = 'auracss-ai-bridge-port';
    portSpan.textContent = 'localhost:4999';

    bridgeHeader.append(badge, portSpan);

    const bridgeTitle = document.createElement('div');
    bridgeTitle.className = 'auracss-ai-bridge-title';
    bridgeTitle.textContent = 'Zero-Key Antigravity Connection';

    const bridgeDesc = document.createElement('div');
    bridgeDesc.className = 'auracss-ai-bridge-desc';
    bridgeDesc.textContent =
      'Prompts and design variations are intelligently synthesized via your active Antigravity session. No external API keys or rate limits required.';

    bridgeCard.append(bridgeHeader, bridgeTitle, bridgeDesc);
    modal.appendChild(bridgeCard);

    // Diagnostics Section
    const diagSection = document.createElement('div');
    diagSection.className = 'auracss-diag-section';
    diagSection.innerHTML = `
      <div class="auracss-diag-row">
        <span class="auracss-diag-label">MCP Daemon</span>
        <span class="auracss-diag-val">http://127.0.0.1:4999</span>
      </div>
      <div class="auracss-diag-row">
        <span class="auracss-diag-label">Protocol</span>
        <span class="auracss-diag-val">MCP stdio / SSE Stream</span>
      </div>
      <div class="auracss-diag-row">
        <span class="auracss-diag-label">Inspected Target</span>
        <span class="auracss-diag-val" id="auracss-diag-target">None (Standby)</span>
      </div>
    `;
    this.targetValEl = diagSection.querySelector('#auracss-diag-target');
    modal.appendChild(diagSection);

    // Live Status Pill
    const status = document.createElement('div');
    status.className = 'auracss-ai-status connected';
    status.textContent = '🟢 Connected (Bridge (localhost:4999))';
    this.statusEl = status;
    modal.appendChild(status);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'auracss-ai-actions';

    const pingBtn = document.createElement('button');
    pingBtn.className = 'auracss-ai-btn auracss-ai-btn-secondary';
    pingBtn.type = 'button';
    pingBtn.textContent = 'Ping MCP Bridge';
    pingBtn.onclick = async () => {
      pingBtn.disabled = true;
      pingBtn.textContent = 'Pinging...';
      const res = await this.aiService.testConnection();
      pingBtn.disabled = false;
      pingBtn.textContent = 'Ping MCP Bridge';
      this.updateStatus(res);
    };

    const closeActionBtn = document.createElement('button');
    closeActionBtn.className = 'auracss-ai-btn auracss-ai-btn-primary';
    closeActionBtn.type = 'button';
    closeActionBtn.textContent = 'Close';
    closeActionBtn.onclick = () => this.hide();

    actions.append(pingBtn, closeActionBtn);
    modal.appendChild(actions);

    backdrop.appendChild(modal);
    shadow.appendChild(backdrop);
    this.backdropEl = backdrop;
  }

  public show(info?: ActiveElementInfo): void {
    if (this.targetValEl) {
      this.targetValEl.textContent = info?.selector || (info?.tag ? `<${info.tag}>` : 'None (Standby)');
    }
    void this.pingStatus();
    this.prevFocusedEl = (document.activeElement as HTMLElement | null) || null;
    this.backdropEl?.classList.add('visible');

    const focusables = Array.from(this.backdropEl?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ) || []);
    if (focusables.length > 0) setTimeout(() => focusables[0]?.focus(), 40);

    const onKeyDown = (e: KeyboardEvent) => {
      if (!this.backdropEl?.classList.contains('visible')) return;
      if (e.key === 'Escape') {
        e.preventDefault(); e.stopPropagation(); this.hide(); return;
      }
      if (e.key === 'Tab') {
        const curFocusables = Array.from(this.backdropEl?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) || []);
        if (curFocusables.length === 0) return;
        const first = curFocusables[0];
        const last = curFocusables[curFocusables.length - 1];
        const root = (this.backdropEl?.getRootNode() as ShadowRoot | Document) || document;
        const active = root.activeElement || document.activeElement;
        if (e.shiftKey) {
          if (active === first || !this.backdropEl?.contains(active as Node)) {
            e.preventDefault(); last?.focus();
          }
        } else {
          if (active === last || !this.backdropEl?.contains(active as Node)) {
            e.preventDefault(); first?.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown, { capture: true });
    this.trapCleanup = () => window.removeEventListener('keydown', onKeyDown, true);
  }

  private updateStatus(res: { success: boolean; message: string }): void {
    if (this.badgeEl) {
      this.badgeEl.className = `auracss-ai-bridge-badge ${res.success ? 'connected' : 'offline'}`;
      this.badgeEl.innerHTML = res.success ? '⚡ Agent Bridge Active' : '⚠️ Bridge Offline';
    }
    if (this.statusEl) {
      this.statusEl.className = `auracss-ai-status ${res.success ? 'connected' : 'error'}`;
      this.statusEl.textContent = res.success ? `🟢 ${res.message}` : `🔴 ${res.message}`;
    }
  }

  private async pingStatus(): Promise<void> {
    const res = await this.aiService.testConnection();
    this.updateStatus(res);
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
    if (this.backdropEl && this.backdropEl.parentNode) {
      this.backdropEl.parentNode.removeChild(this.backdropEl);
    }
    this.backdropEl = null;
    this.statusEl = null;
    this.badgeEl = null;
    this.targetValEl = null;
  }
}
