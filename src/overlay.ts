import type { OverlayBoxMetrics } from './types';
import { OVERLAY_STYLES } from './overlay-styles';
import { getSavedPosition, savePosition, clampToViewport, makeDraggable } from './draggable';

function buildSelectorPill(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : '';
  const classes = Array.from(el.classList).filter((c) => !c.startsWith('auracss')).slice(0, 2).map((c) => `.${c}`).join('');
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
  private cleanups: (() => void)[] = [];
  private liveRegion: HTMLDivElement | null = null;

  public mount(): ShadowRoot {
    if (this.shadow) return this.shadow;
    document.getElementById('auracss-root')?.remove();

    const host = document.createElement('div');
    host.id = 'auracss-root';
    host.style.cssText = 'all: initial !important; position: fixed !important; inset: 0 !important; width: 100% !important; height: 100% !important; z-index: 2147483647 !important; pointer-events: none !important;';
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

    const live = document.createElement('div');
    live.className = 'auracss-sr-live';
    live.setAttribute('aria-live', 'polite');
    live.setAttribute('aria-atomic', 'true');
    shadow.appendChild(live);
    this.liveRegion = live;

    if (document.body) {
      document.body.appendChild(host);
    } else {
      document.documentElement.appendChild(host);
      window.addEventListener('DOMContentLoaded', () => {
        if (document.body && host.parentElement !== document.body) document.body.appendChild(host);
      }, { once: true });
    }

    this.host = host; this.shadow = shadow; this.container = container; this.ring = ring; this.pill = pill;
    return shadow;
  }

  public updateHighlight(target: HTMLElement | null, locked = false): void {
    this.activeTarget = target;
    this.isLocked = locked;
    if (locked) {
      if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null; }
      this.render();
      return;
    }
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => { this.rafId = null; this.render(); });
  }

  private render(): void {
    if (!this.ring || !this.pill) return;
    if (!this.activeTarget || !this.activeTarget.isConnected) {
      this.ring.style.display = 'none';
      return;
    }

    const rect = this.activeTarget.getBoundingClientRect();
    const tagLabel = buildSelectorPill(this.activeTarget);
    const metrics: OverlayBoxMetrics = {
      top: rect.top, left: rect.left,
      width: Math.max(rect.width, 2), height: Math.max(rect.height, 2),
    };

    this.ring.style.display = 'block';
    this.ring.style.transform = `translate3d(${metrics.left}px, ${metrics.top}px, 0)`;
    this.ring.style.width = `${metrics.width}px`;
    this.ring.style.height = `${metrics.height}px`;

    this.isLocked ? this.ring.classList.add('locked') : this.ring.classList.remove('locked');
    this.pill.textContent = tagLabel;
    this.pill.classList.toggle('flipped', metrics.top < 30);
  }

  public clear(): void {
    this.activeTarget = null;
    this.isLocked = false;
    if (this.ring) this.ring.style.display = 'none';
  }

  public destroy(): void {
    if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    this.cleanups.forEach((c) => c());
    this.cleanups = [];
    if (this.host?.parentNode) this.host.parentNode.removeChild(this.host);
    this.host = null; this.shadow = null; this.container = null; this.ring = null;
    this.pill = null; this.activeTarget = null; this.isLocked = false; this.liveRegion = null;
  }

  public announce(msg: string): void {
    if (!this.liveRegion) return;
    this.liveRegion.textContent = '';
    setTimeout(() => { if (this.liveRegion) this.liveRegion.textContent = msg; }, 30);
  }

  public getShadowRoot(): ShadowRoot | null { return this.shadow; }
  public getContainer(): HTMLDivElement | null { return this.container; }

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

    const savedPos = getSavedPosition();
    if (savedPos) {
      stack.style.left = `${savedPos.left}px`;
      stack.style.top = `${savedPos.top}px`;
      stack.style.right = 'auto';
    }

    const badge = document.createElement('button');
    badge.className = 'auracss-min-badge';
    badge.title = 'AuraCSS (Alt+A to toggle)';
    badge.setAttribute('aria-label', 'Expand AuraCSS Controls');
    badge.type = 'button';
    badge.innerHTML = '✦';

    const row = document.createElement('div');
    row.className = 'auracss-controls-row';
    row.setAttribute('role', 'toolbar');
    row.setAttribute('aria-label', 'AuraCSS Floating Controls');

    const dragHandle = document.createElement('span');
    dragHandle.className = 'auracss-controls-drag-handle';
    dragHandle.title = 'Click to minimize to right, drag to move';
    dragHandle.setAttribute('role', 'button');
    dragHandle.setAttribute('tabindex', '0');
    dragHandle.setAttribute('aria-label', 'Drag controls or click to minimize');
    dragHandle.textContent = '⋮⋮';

    const btn = document.createElement('button');
    btn.className = 'auracss-toggle-btn';
    btn.title = 'Toggle AuraCSS ON/OFF (Alt+A)';
    btn.setAttribute('aria-label', 'Toggle AuraCSS');
    const dot = document.createElement('span');
    dot.className = 'auracss-toggle-dot';
    const label = document.createElement('span');
    label.textContent = 'AuraCSS: OFF';
    btn.append(dot, label);

    const exportDivider = document.createElement('div');
    exportDivider.className = 'auracss-controls-divider auracss-export-divider';
    exportDivider.style.display = 'none';

    const exportBtn = document.createElement('button');
    exportBtn.className = 'auracss-toggle-btn auracss-export-btn';
    exportBtn.setAttribute('aria-label', 'View change ledger and export styles');
    exportBtn.style.display = 'none';
    exportBtn.textContent = 'Export (0)';

    const minDivider = document.createElement('div');
    minDivider.className = 'auracss-controls-divider';

    const minBtn = document.createElement('button');
    minBtn.className = 'auracss-min-btn';
    minBtn.title = 'Minimize controls';
    minBtn.setAttribute('aria-label', 'Minimize floating controls');
    minBtn.type = 'button';
    minBtn.innerHTML = '–';

    row.append(dragHandle, btn, exportDivider, exportBtn, minDivider, minBtn);

    const badgeDrag = makeDraggable(stack, badge, { onDragEnd: () => clampToViewport(stack) });
    const rowDrag = makeDraggable(stack, dragHandle, { onDragEnd: () => clampToViewport(stack) });
    this.cleanups.push(badgeDrag.destroy, rowDrag.destroy);

    const minimizeStack = () => {
      const winW = typeof window !== 'undefined' ? (document.documentElement?.clientWidth || window.innerWidth || 1024) : 1024;
      const minRect = minBtn.getBoundingClientRect();
      const stackRect = stack.getBoundingClientRect();
      const anchorRight = minRect.width > 0 ? minRect.right : stackRect.right;
      const anchorTop = minRect.height > 0 ? minRect.top + (minRect.height - 32) / 2 : stackRect.top;
      const rightX = Math.max(Math.round(anchorRight - 32), Math.round(winW - 32 - 16));
      stack.classList.add('minimized');
      stack.style.setProperty('left', `${rightX}px`, 'important');
      stack.style.setProperty('top', `${Math.round(anchorTop)}px`, 'important');
      stack.style.setProperty('right', 'auto', 'important');
      savePosition(clampToViewport(stack));
      this.announce('AuraCSS controls minimized');
    };

    minBtn.onclick = (e) => { e.stopPropagation(); minimizeStack(); };
    dragHandle.onclick = (e) => {
      e.stopPropagation();
      if (!rowDrag.wasJustDragged()) minimizeStack();
    };
    dragHandle.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); minimizeStack(); }
    };
    btn.onclick = (e) => { e.stopPropagation(); onToggle(); };
    exportBtn.onclick = (e) => { e.stopPropagation(); onExport(); };

    badge.onclick = (e) => {
      e.stopPropagation();
      if (badgeDrag.wasJustDragged()) return;
      const badgeRect = badge.getBoundingClientRect();
      stack.classList.remove('minimized');
      const expandedRect = stack.getBoundingClientRect();
      stack.style.setProperty('left', `${Math.round(badgeRect.right - expandedRect.width)}px`, 'important');
      stack.style.setProperty('top', `${Math.round(badgeRect.top + (badgeRect.height - expandedRect.height) / 2)}px`, 'important');
      stack.style.setProperty('right', 'auto', 'important');
      savePosition(clampToViewport(stack));
      this.announce('AuraCSS controls expanded');
    };

    const handleResize = () => clampToViewport(stack);
    window.addEventListener('resize', handleResize, { passive: true });
    this.cleanups.push(() => window.removeEventListener('resize', handleResize));

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => clampToViewport(stack));
      ro.observe(stack);
      this.cleanups.push(() => ro.disconnect());
    }

    stack.append(badge, row);
    this.shadow.appendChild(stack);
    if (savedPos) clampToViewport(stack);

    return {
      toggleBtn: btn,
      toggleLabel: label,
      exportBtn,
      exportDivider,
      minBadge: badge,
      minBtn,
      controlsStack: stack,
    };
  }
}
