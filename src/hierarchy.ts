import type { BreadcrumbNode } from './types';
import { makeDraggable, clampToViewport } from './draggable';

const BREADCRUMB_STYLES = `
.auracss-breadcrumb-bar {
  position: fixed;
  bottom: 146px;
  top: auto;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  align-items: center;
  gap: 6px;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  padding: 4px 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), 0 0 1px rgba(255, 255, 255, 0.2);
  z-index: 2147483646;
  pointer-events: auto;
  user-select: none;
  max-width: calc(100vw - 24px);
  transition: opacity 0.18s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.auracss-breadcrumb-bar.visible { display: flex; }
.auracss-breadcrumb-bar.flipped-top { bottom: auto; top: 178px; }
.auracss-breadcrumb-bar.ghost { opacity: 0.12 !important; pointer-events: none !important; }
.auracss-breadcrumb-bar.dragging { transition: none !important; }
.auracss-breadcrumb-bar.minimized {
  padding: 0 !important; background: transparent !important; border: none !important;
  box-shadow: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
}

.auracss-breadcrumb-drag {
  display: inline-flex; align-items: center; justify-content: center;
  color: #64748b; font-size: 11px; cursor: grab; padding: 2px 4px;
  border-radius: 4px; touch-action: none; user-select: none;
}
.auracss-breadcrumb-drag:hover, .auracss-breadcrumb-drag.dragging { color: #38bdf8; cursor: grabbing !important; }

.auracss-breadcrumb-items {
  display: flex; align-items: center; gap: 5px; overflow-x: auto; scrollbar-width: none;
}
.auracss-breadcrumb-items::-webkit-scrollbar { display: none; }

.auracss-breadcrumb-item {
  color: #94a3b8; font-size: 12px; font-weight: 500; cursor: pointer;
  padding: 2px 6px; border-radius: 4px; transition: color 0.15s ease, background 0.15s ease; white-space: nowrap;
}
.auracss-breadcrumb-item:hover { color: #38bdf8; background: rgba(56, 189, 248, 0.12); }
.auracss-breadcrumb-item.current {
  color: #f8fafc; font-weight: 700; background: rgba(168, 85, 247, 0.2); border: 1px solid rgba(168, 85, 247, 0.4);
}
.auracss-breadcrumb-separator { color: #475569; font-size: 11px; }

.auracss-breadcrumb-min {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%; border: none; background: transparent;
  color: #94a3b8; font-size: 13px; font-weight: 700; cursor: pointer; padding: 0;
}
.auracss-breadcrumb-min:hover { background: rgba(255, 255, 255, 0.12); color: #f8fafc; }

.auracss-breadcrumb-badge {
  position: relative; display: none; width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid rgba(168, 85, 247, 0.5); background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  color: #c084fc; align-items: center; justify-content: center; cursor: grab;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(168, 85, 247, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  outline: none; touch-action: none; user-select: none; padding: 0;
}
.auracss-breadcrumb-badge:hover { transform: scale(1.1); border-color: #c084fc; box-shadow: 0 0 18px rgba(168, 85, 247, 0.6); }
.auracss-breadcrumb-badge.dragging { cursor: grabbing !important; transform: scale(1.12); }
.auracss-breadcrumb-bar.minimized .auracss-breadcrumb-drag,
.auracss-breadcrumb-bar.minimized .auracss-breadcrumb-items,
.auracss-breadcrumb-bar.minimized .auracss-breadcrumb-min { display: none !important; }
.auracss-breadcrumb-bar.minimized .auracss-breadcrumb-badge { display: flex !important; }
`;

const TREE_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M6 9v6a3 3 0 0 0 3 3h6"/><path d="M9 6h6"/></svg>`;

export function formatElementLabel(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : '';
  const firstClass = el.classList.length > 0
    ? `.${Array.from(el.classList).filter((c) => !c.startsWith('auracss'))[0] ?? ''}`
    : '';
  return `${tag}${id}${firstClass === '.' ? '' : firstClass}`;
}

export class HierarchyManager {
  private barEl: HTMLDivElement | null = null;
  private itemsEl: HTMLDivElement | null = null;
  private childStack: HTMLElement[] = [];
  private onSelectCallback: ((el: HTMLElement) => void) | null = null;
  private cleanups: (() => void)[] = [];
  private hasCustomPos = false;
  private preMinStyle: { left: string; top: string; bottom: string; transform: string } | null = null;

  public mount(shadow: ShadowRoot): void {
    if (this.barEl) return;

    const styleEl = document.createElement('style');
    styleEl.textContent = BREADCRUMB_STYLES;
    shadow.appendChild(styleEl);

    const bar = document.createElement('div');
    bar.className = 'auracss-breadcrumb-bar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Element Hierarchy Breadcrumbs');

    const dragHandle = document.createElement('span');
    dragHandle.className = 'auracss-breadcrumb-drag';
    dragHandle.title = 'Click to minimize to right, drag to move';
    dragHandle.setAttribute('role', 'button');
    dragHandle.setAttribute('aria-label', 'Drag breadcrumbs or click to minimize');
    dragHandle.textContent = '⋮⋮';

    const items = document.createElement('div');
    items.className = 'auracss-breadcrumb-items';

    const minBtn = document.createElement('button');
    minBtn.className = 'auracss-breadcrumb-min';
    minBtn.type = 'button';
    minBtn.title = 'Minimize breadcrumbs to right';
    minBtn.setAttribute('aria-label', 'Minimize breadcrumbs');
    minBtn.textContent = '–';

    const badge = document.createElement('button');
    badge.className = 'auracss-breadcrumb-badge';
    badge.type = 'button';
    badge.title = 'Expand Element Breadcrumbs';
    badge.setAttribute('aria-label', 'Expand breadcrumbs');
    badge.innerHTML = TREE_ICON_SVG;

    let badgeDragged = false;
    const rowDrag = makeDraggable(bar, dragHandle, {
      storageKey: 'auracss_breadcrumb_pos',
      onDragEnd: () => { this.hasCustomPos = true; },
    });
    const badgeDrag = makeDraggable(bar, badge, {
      storageKey: 'auracss_breadcrumb_badge_pos',
      onDragEnd: () => { badgeDragged = true; clampToViewport(bar); },
    });
    this.cleanups.push(rowDrag.destroy, badgeDrag.destroy);

    const minimizeToRight = () => {
      const winW = typeof window !== 'undefined' ? (document.documentElement?.clientWidth || window.innerWidth || 1024) : 1024;
      const rect = bar.getBoundingClientRect();
      this.preMinStyle = {
        left: bar.style.left, top: bar.style.top, bottom: bar.style.bottom, transform: bar.style.transform,
      };
      badgeDragged = false;
      const rightX = Math.round(winW - 32 - 16);
      const targetTop = !this.hasCustomPos ? 60 : (rect.height > 0 ? Math.round(rect.top + (rect.height - 32) / 2) : 60);
      bar.classList.add('minimized');
      bar.style.setProperty('left', `${rightX}px`, 'important');
      bar.style.setProperty('top', `${targetTop}px`, 'important');
      bar.style.setProperty('right', 'auto', 'important');
      bar.style.setProperty('bottom', 'auto', 'important');
      bar.style.setProperty('transform', 'none', 'important');
      clampToViewport(bar);
    };

    minBtn.onclick = (e) => { e.stopPropagation(); minimizeToRight(); };
    dragHandle.onclick = (e) => { e.stopPropagation(); if (!rowDrag.wasJustDragged()) minimizeToRight(); };

    badge.onclick = (e) => {
      e.stopPropagation();
      if (badgeDrag.wasJustDragged()) return;
      const bRect = badge.getBoundingClientRect();
      bar.classList.remove('minimized');
      if (!badgeDragged && !this.hasCustomPos) {
        ['left', 'top', 'right', 'bottom', 'transform'].forEach((p) => bar.style.removeProperty(p));
        if (this.preMinStyle?.bottom) bar.style.bottom = this.preMinStyle.bottom;
        if (this.preMinStyle?.top) bar.style.top = this.preMinStyle.top;
      } else {
        this.hasCustomPos = true;
        const expRect = bar.getBoundingClientRect();
        bar.style.setProperty('left', `${Math.round(bRect.right - expRect.width)}px`, 'important');
        bar.style.setProperty('top', `${Math.round(bRect.top + (bRect.height - expRect.height) / 2)}px`, 'important');
        clampToViewport(bar);
      }
    };

    bar.append(dragHandle, items, minBtn, badge);
    shadow.appendChild(bar);
    this.barEl = bar;
    this.itemsEl = items;
  }

  public buildBreadcrumbPath(target: HTMLElement, maxDepth = 6): BreadcrumbNode[] {
    if (!target || !target.isConnected) return [];
    const path: BreadcrumbNode[] = [];
    let current: HTMLElement | null = target;
    while (current && current.isConnected && path.length < maxDepth) {
      if (current === document.body || current === document.documentElement || current.id === 'auracss-root') break;
      path.push({ element: current, label: formatElementLabel(current), isCurrent: current === target });
      current = current.parentElement;
    }
    return path.reverse();
  }

  public render(target: HTMLElement, onSelect: (el: HTMLElement) => void): void {
    if (!this.barEl || !this.itemsEl) return;
    this.onSelectCallback = onSelect;
    const nodes = this.buildBreadcrumbPath(target);
    if (nodes.length === 0) { this.clear(); return; }

    this.itemsEl.innerHTML = '';
    nodes.forEach((node, idx) => {
      if (idx > 0) {
        const sep = document.createElement('span');
        sep.className = 'auracss-breadcrumb-separator';
        sep.textContent = '›';
        this.itemsEl?.appendChild(sep);
      }
      const item = document.createElement('span');
      item.className = `auracss-breadcrumb-item${node.isCurrent ? ' current' : ''}`;
      item.textContent = node.label;
      item.title = `Select <${node.element.tagName.toLowerCase()}>`;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        if (node.element.isConnected) {
          this.childStack.length = 0;
          this.onSelectCallback?.(node.element);
        }
      });
      this.itemsEl?.appendChild(item);
    });
    this.barEl.classList.add('visible');
  }

  public dodgeTarget(target: HTMLElement, dockFlippedTop = false, dockRect?: DOMRect | null): void {
    if (!this.barEl || this.hasCustomPos || this.barEl.classList.contains('minimized')) return;
    const winH = typeof window !== 'undefined' ? (document.documentElement?.clientHeight || window.innerHeight || 768) : 768;
    const rect = target.getBoundingClientRect();
    const overlapsBottomBar = rect.bottom >= winH - 185 && rect.top <= winH - 130;
    const shouldFlipTop = dockFlippedTop || (overlapsBottomBar && rect.top > 180);
    this.barEl.classList.toggle('flipped-top', shouldFlipTop);

    if (dockRect && dockRect.height > 0) {
      if (shouldFlipTop) {
        this.barEl.style.top = `${Math.round(dockRect.bottom + 10)}px`;
        this.barEl.style.bottom = 'auto';
      } else {
        this.barEl.style.bottom = `${Math.round(winH - dockRect.top + 10)}px`;
        this.barEl.style.top = 'auto';
      }
    }
  }

  public setGhostMode(ghost: boolean): void {
    this.barEl?.classList.toggle('ghost', ghost);
  }

  public navigateUp(current: HTMLElement): HTMLElement | null {
    if (!current || !current.isConnected) return null;
    const parent = current.parentElement;
    if (!parent || parent === document.body || parent === document.documentElement || parent.id === 'auracss-root') return null;
    this.childStack.push(current);
    return parent;
  }

  public navigateDown(current: HTMLElement): HTMLElement | null {
    if (!current || !current.isConnected) return null;
    if (this.childStack.length > 0) {
      const candidate = this.childStack.pop();
      if (candidate && candidate.isConnected && candidate.parentElement === current) return candidate;
    }
    const firstChild = current.firstElementChild;
    if (firstChild instanceof HTMLElement && firstChild.isConnected && firstChild.id !== 'auracss-root') return firstChild;
    return null;
  }

  public clear(): void {
    this.childStack.length = 0;
    if (this.barEl) {
      this.barEl.classList.remove('visible', 'ghost');
      if (this.itemsEl) this.itemsEl.innerHTML = '';
    }
  }

  public destroy(): void {
    this.clear();
    this.cleanups.forEach((c) => c());
    this.cleanups = [];
    this.barEl?.remove();
    this.barEl = null;
    this.itemsEl = null;
    this.onSelectCallback = null;
  }
}
