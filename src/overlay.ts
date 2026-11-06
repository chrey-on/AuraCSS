import type { OverlayBoxMetrics } from './types';

const OVERLAY_STYLES = `
:host {
  all: initial; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 2147483645;
}
*, *::before, *::after {
  box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.auracss-container {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  pointer-events: none; overflow: visible; z-index: 2147483645;
}
.auracss-ring {
  position: absolute; pointer-events: none; border-radius: 4px; border: 2px solid #38bdf8;
  background: rgba(56, 189, 248, 0.08); box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 16px rgba(56, 189, 248, 0.35);
  transition: transform 0.06s ease-out, width 0.06s ease-out, height 0.06s ease-out, border-color 0.15s ease;
  will-change: transform, width, height; display: none;
}
.auracss-ring.locked {
  border-color: #a855f7; background: rgba(168, 85, 247, 0.1);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 0 20px rgba(168, 85, 247, 0.45);
}
.auracss-pill {
  position: absolute; top: -26px; left: -2px; background: #0f172a; color: #f8fafc;
  font-size: 11px; font-weight: 600; line-height: 1; padding: 4px 8px; border-radius: 4px;
  letter-spacing: 0.02em; white-space: nowrap; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 4px; pointer-events: none;
}
.auracss-pill.flipped { top: auto; bottom: -26px; }
.auracss-controls-stack {
  position: fixed; top: 16px; right: 20px; display: inline-flex; align-items: center;
  z-index: 2147483647; pointer-events: auto; user-select: none;
}
.auracss-controls-row {
  display: inline-flex; align-items: center; height: 32px;
  background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 9999px; padding: 2px 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.2);
  gap: 2px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.auracss-controls-row:hover {
  border-color: rgba(56, 189, 248, 0.4);
  box-shadow: 0 10px 36px rgba(0, 0, 0, 0.6), 0 0 14px rgba(56, 189, 248, 0.2);
}
.auracss-controls-divider {
  width: 1px; height: 14px; background: rgba(255, 255, 255, 0.15); flex-shrink: 0;
}
.auracss-toggle-btn {
  height: 26px; padding: 0 10px; border-radius: 9999px; border: none;
  background: transparent; color: #f8fafc; font-size: 11.5px; font-weight: 600;
  display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; outline: none; box-shadow: none;
}
.auracss-toggle-btn:hover { background: rgba(255, 255, 255, 0.1); color: #ffffff; }
.auracss-toggle-btn.active { color: #38bdf8; }
.auracss-export-btn {
  color: #38bdf8; font-weight: 700;
}
.auracss-export-btn:hover { background: rgba(56, 189, 248, 0.15); color: #7dd3fc; }
.auracss-toggle-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #64748b;
  transition: all 0.2s ease;
}
.auracss-toggle-btn.active .auracss-toggle-dot {
  background: #38bdf8; box-shadow: 0 0 8px #38bdf8;
}
.auracss-min-btn {
  width: 22px; height: 22px; border-radius: 50%; border: none;
  background: transparent; color: #94a3b8; font-size: 13px; font-weight: 700;
  display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
  transition: all 0.15s ease; outline: none; margin-right: 2px;
}
.auracss-min-btn:hover { background: rgba(255, 255, 255, 0.12); color: #f8fafc; }
.auracss-min-badge {
  display: none; width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid rgba(56, 189, 248, 0.4); background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px); color: #38bdf8; font-size: 13px; font-weight: 700;
  align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(56, 189, 248, 0.3);
  transition: all 0.15s ease; outline: none;
}
.auracss-min-badge:hover { transform: scale(1.1); box-shadow: 0 0 18px rgba(56, 189, 248, 0.6); }
.auracss-min-badge.active { color: #38bdf8; border-color: #38bdf8; box-shadow: 0 0 12px rgba(56, 189, 248, 0.45); }
.auracss-controls-stack.minimized .auracss-controls-row { display: none !important; }
.auracss-controls-stack.minimized .auracss-min-badge { display: flex !important; }
`;

function buildSelectorPill(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : '';
  const classes = Array.from(el.classList)
    .filter((c) => !c.startsWith('auracss'))
    .slice(0, 2)
    .map((c) => `.${c}`)
    .join('');
  return `${tag}${id}${classes}`;
}

export class OverlayManager {
  private host: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;
  private container: HTMLDivElement | null = null;
  private ring: HTMLDivElement | null = null;
  private pill: HTMLDivElement | null = null;
  private activeTarget: HTMLElement | null = null;
  private isLocked = false;
  private rafId: number | null = null;

  public mount(): ShadowRoot {
    if (this.shadow) return this.shadow;

    const existingHost = document.getElementById('auracss-root');
    if (existingHost) {
      existingHost.remove();
    }

    const host = document.createElement('div');
    host.id = 'auracss-root';
    host.style.cssText = 'all: initial !important; position: fixed !important; top: 0 !important; left: 0 !important; width: 0 !important; height: 0 !important; z-index: 2147483647 !important; pointer-events: none !important;';
    const shadow = host.attachShadow({ mode: 'open' });

    const styleEl = document.createElement('style');
    styleEl.textContent = OVERLAY_STYLES;
    shadow.appendChild(styleEl);

    const container = document.createElement('div');
    container.className = 'auracss-container';

    const ring = document.createElement('div');
    ring.className = 'auracss-ring';

    const pill = document.createElement('div');
    pill.className = 'auracss-pill';

    ring.appendChild(pill);
    container.appendChild(ring);
    shadow.appendChild(container);

    if (document.body) {
      document.body.appendChild(host);
    } else {
      document.documentElement.appendChild(host);
      window.addEventListener('DOMContentLoaded', () => {
        if (document.body && host.parentElement !== document.body) {
          document.body.appendChild(host);
        }
      }, { once: true });
    }

    this.host = host;
    this.shadow = shadow;
    this.container = container;
    this.ring = ring;
    this.pill = pill;

    return shadow;
  }

  public updateHighlight(target: HTMLElement | null, locked = false): void {
    this.activeTarget = target;
    this.isLocked = locked;

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.render();
    });
  }

  private render(): void {
    if (!this.ring || !this.pill) return;

    if (!this.activeTarget || !this.activeTarget.isConnected) {
      this.ring.style.display = 'none';
      return;
    }

    // FastDOM Phase 1: Geometry & Selector Reads
    const rect = this.activeTarget.getBoundingClientRect();
    const tagLabel = buildSelectorPill(this.activeTarget);
    const metrics: OverlayBoxMetrics = {
      top: rect.top,
      left: rect.left,
      width: Math.max(rect.width, 2),
      height: Math.max(rect.height, 2),
    };
    const isNearTop = metrics.top < 30;

    // FastDOM Phase 2: Layout & Class Writes
    this.ring.style.display = 'block';
    this.ring.style.transform = `translate3d(${metrics.left}px, ${metrics.top}px, 0)`;
    this.ring.style.width = `${metrics.width}px`;
    this.ring.style.height = `${metrics.height}px`;

    if (this.isLocked) {
      this.ring.classList.add('locked');
    } else {
      this.ring.classList.remove('locked');
    }

    this.pill.textContent = tagLabel;
    this.pill.classList.toggle('flipped', isNearTop);
  }

  public clear(): void {
    this.activeTarget = null;
    this.isLocked = false;
    if (this.ring) {
      this.ring.style.display = 'none';
    }
  }

  public destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.host && this.host.parentNode) {
      this.host.parentNode.removeChild(this.host);
    }
    this.host = null;
    this.shadow = null;
    this.container = null;
    this.ring = null;
    this.pill = null;
    this.activeTarget = null;
    this.isLocked = false;
  }

  public getShadowRoot(): ShadowRoot | null {
    return this.shadow;
  }

  public getContainer(): HTMLDivElement | null {
    return this.container;
  }

  public resolveHostElement(e: Event): HTMLElement | null {
    if (!this.host) return null;
    const path = e.composedPath();
    if (path.includes(this.host)) return null;
    for (const item of path) {
      if (item instanceof HTMLElement && item !== document.body && item !== document.documentElement && item.isConnected) {
        return item;
      }
    }
    return null;
  }

  public mountControls(onToggle: () => void, onExport: () => void) {
    if (!this.shadow) throw new Error('ShadowRoot not mounted');
    const stack = document.createElement('div');
    stack.className = 'auracss-controls-stack';

    const badge = document.createElement('button');
    badge.className = 'auracss-min-badge';
    badge.title = 'Expand AuraCSS Controls';
    badge.type = 'button';
    badge.innerHTML = '✦';
    badge.onclick = (e) => { e.stopPropagation(); stack.classList.remove('minimized'); };
    stack.appendChild(badge);

    const row = document.createElement('div');
    row.className = 'auracss-controls-row';

    const btn = document.createElement('button');
    btn.className = 'auracss-toggle-btn';
    btn.setAttribute('aria-label', 'Toggle AuraCSS');
    const dot = document.createElement('span');
    dot.className = 'auracss-toggle-dot';
    const label = document.createElement('span');
    label.textContent = 'AuraCSS: OFF';
    btn.append(dot, label);
    btn.onclick = (e) => { e.stopPropagation(); onToggle(); };
    row.appendChild(btn);

    const exportDivider = document.createElement('div');
    exportDivider.className = 'auracss-controls-divider auracss-export-divider';
    exportDivider.style.display = 'none';
    row.appendChild(exportDivider);

    const exportBtn = document.createElement('button');
    exportBtn.className = 'auracss-toggle-btn auracss-export-btn';
    exportBtn.style.display = 'none';
    exportBtn.textContent = 'Export (0)';
    exportBtn.onclick = (e) => { e.stopPropagation(); onExport(); };
    row.appendChild(exportBtn);

    const minDivider = document.createElement('div');
    minDivider.className = 'auracss-controls-divider';
    row.appendChild(minDivider);

    const minBtn = document.createElement('button');
    minBtn.className = 'auracss-min-btn';
    minBtn.title = 'Minimize controls';
    minBtn.type = 'button';
    minBtn.innerHTML = '–';
    minBtn.onclick = (e) => { e.stopPropagation(); stack.classList.add('minimized'); };
    row.appendChild(minBtn);
    stack.appendChild(row);

    this.shadow.appendChild(stack);
    return { toggleBtn: btn, toggleLabel: label, exportBtn, exportDivider, minBadge: badge, controlsStack: stack };
  }
}
