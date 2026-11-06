import type { BreadcrumbNode } from './types';

const BREADCRUMB_STYLES = `
.auracss-breadcrumb-bar {
  position: fixed;
  top: 16px;
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
  padding: 6px 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), 0 0 1px rgba(255, 255, 255, 0.2);
  z-index: 2147483646;
  pointer-events: auto;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.auracss-breadcrumb-bar.visible {
  display: flex;
}

.auracss-breadcrumb-item {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: color 0.15s ease, background 0.15s ease;
  white-space: nowrap;
}

.auracss-breadcrumb-item:hover {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
}

.auracss-breadcrumb-item.current {
  color: #f8fafc;
  font-weight: 700;
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.4);
}

.auracss-breadcrumb-separator {
  color: #475569;
  font-size: 11px;
}
`;

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
  private childStack: HTMLElement[] = [];
  private onSelectCallback: ((el: HTMLElement) => void) | null = null;

  public mount(shadow: ShadowRoot): void {
    if (this.barEl) return;

    const styleEl = document.createElement('style');
    styleEl.textContent = BREADCRUMB_STYLES;
    shadow.appendChild(styleEl);

    const bar = document.createElement('div');
    bar.className = 'auracss-breadcrumb-bar';
    bar.setAttribute('role', 'navigation');
    bar.setAttribute('aria-label', 'Element Hierarchy Breadcrumbs');

    shadow.appendChild(bar);
    this.barEl = bar;
  }

  public buildBreadcrumbPath(target: HTMLElement, maxDepth = 6): BreadcrumbNode[] {
    if (!target || !target.isConnected) return [];

    const path: BreadcrumbNode[] = [];
    let current: HTMLElement | null = target;

    while (current && current.isConnected && path.length < maxDepth) {
      if (current === document.body || current === document.documentElement) {
        break;
      }
      if (current.id === 'auracss-root') {
        break;
      }

      path.push({
        element: current,
        label: formatElementLabel(current),
        isCurrent: current === target,
      });

      current = current.parentElement;
    }

    return path.reverse();
  }

  public render(target: HTMLElement, onSelect: (el: HTMLElement) => void): void {
    if (!this.barEl) return;
    this.onSelectCallback = onSelect;

    const nodes = this.buildBreadcrumbPath(target);
    if (nodes.length === 0) {
      this.clear();
      return;
    }

    this.barEl.innerHTML = '';
    nodes.forEach((node, idx) => {
      if (idx > 0) {
        const sep = document.createElement('span');
        sep.className = 'auracss-breadcrumb-separator';
        sep.textContent = '›';
        this.barEl?.appendChild(sep);
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

      this.barEl?.appendChild(item);
    });

    this.barEl.classList.add('visible');
  }

  public navigateUp(current: HTMLElement): HTMLElement | null {
    if (!current || !current.isConnected) return null;
    const parent = current.parentElement;

    if (!parent || parent === document.body || parent === document.documentElement) {
      return null;
    }
    if (parent.id === 'auracss-root') {
      return null;
    }

    this.childStack.push(current);
    return parent;
  }

  public navigateDown(current: HTMLElement): HTMLElement | null {
    if (!current || !current.isConnected) return null;

    if (this.childStack.length > 0) {
      const candidate = this.childStack.pop();
      if (candidate && candidate.isConnected && candidate.parentElement === current) {
        return candidate;
      }
    }

    const firstChild = current.firstElementChild;
    if (firstChild instanceof HTMLElement && firstChild.isConnected && firstChild.id !== 'auracss-root') {
      return firstChild;
    }

    return null;
  }

  public clear(): void {
    this.childStack.length = 0;
    if (this.barEl) {
      this.barEl.classList.remove('visible');
      this.barEl.innerHTML = '';
    }
  }

  public destroy(): void {
    this.clear();
    if (this.barEl && this.barEl.parentNode) {
      this.barEl.parentNode.removeChild(this.barEl);
    }
    this.barEl = null;
    this.onSelectCallback = null;
  }
}
