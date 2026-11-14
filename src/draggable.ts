export interface DragPosition {
  left: number;
  top: number;
}

export interface DraggableOptions {
  margin?: number;
  storageKey?: string;
  onDragEnd?: (pos: DragPosition) => void;
}

const DEFAULT_STORAGE_KEY = 'auracss_controls_pos';
const DEFAULT_MARGIN = 12;

export function getSavedPosition(key = DEFAULT_STORAGE_KEY): DragPosition | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.left === 'number' && typeof parsed?.top === 'number') {
      return { left: parsed.left, top: parsed.top };
    }
  } catch {}
  return null;
}

export function savePosition(pos: DragPosition, key = DEFAULT_STORAGE_KEY): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(pos));
  } catch {}
}

export function clampToViewport(target: HTMLElement, margin = DEFAULT_MARGIN): DragPosition {
  const rect = target.getBoundingClientRect();
  const isMin = target.classList.contains('minimized');
  const width = isMin ? 32 : (rect.width || 32);
  const height = isMin ? 32 : (rect.height || 32);
  const winW = typeof window !== 'undefined'
    ? (document.documentElement?.clientWidth || window.innerWidth || 1024)
    : 1024;
  const winH = typeof window !== 'undefined'
    ? (document.documentElement?.clientHeight || window.innerHeight || 768)
    : 768;

  const minX = margin;
  const minY = margin;
  const maxX = Math.max(minX, winW - width - margin);
  const maxY = Math.max(minY, winH - height - margin);

  const currentLeft = target.style.left && target.style.left !== 'auto'
    ? parseFloat(target.style.left)
    : rect.left;
  const currentTop = target.style.top && target.style.top !== 'auto'
    ? parseFloat(target.style.top)
    : rect.top;

  const clampedX = Math.round(Math.max(minX, Math.min(maxX, currentLeft)));
  let clampedY = Math.round(Math.max(minY, Math.min(maxY, currentTop)));

  const root = target.parentNode as ParentNode | null;
  if (isMin && root && typeof root.querySelectorAll === 'function') {
    const others = Array.from(
      root.querySelectorAll('.auracss-controls-stack, .auracss-breadcrumb-bar.visible, .auracss-variation-dock.visible')
    ).filter((el): el is HTMLElement => el instanceof HTMLElement && el !== target);

    const collides = (x: number, y: number): boolean => {
      for (const other of others) {
        const oRect = other.getBoundingClientRect();
        const oIsMin = other.classList.contains('minimized');
        const oW = oIsMin ? 32 : (oRect.width || 160);
        const oH = oIsMin ? 32 : (oRect.height || 36);
        const oLeft = other.style.left && other.style.left !== 'auto'
          ? parseFloat(other.style.left)
          : (oRect.left || (other.classList.contains('auracss-controls-stack') ? winW - oW - 16 : 0));
        const oTop = other.style.top && other.style.top !== 'auto'
          ? parseFloat(other.style.top)
          : (oRect.top || (other.classList.contains('auracss-controls-stack') ? 16 : 0));

        const pad = 10;
        if (x < oLeft + oW + pad && x + width + pad > oLeft && y < oTop + oH + pad && y + height + pad > oTop) {
          return true;
        }
      }
      return false;
    };

    if (collides(clampedX, clampedY)) {
      for (let offset = 2; offset < winH; offset += 2) {
        const downY = clampedY + offset;
        const upY = clampedY - offset;
        if (downY <= maxY && !collides(clampedX, downY)) { clampedY = downY; break; }
        if (upY >= minY && !collides(clampedX, upY)) { clampedY = upY; break; }
      }
    }
  }

  target.style.setProperty('left', `${clampedX}px`, 'important');
  target.style.setProperty('top', `${clampedY}px`, 'important');
  target.style.setProperty('right', 'auto', 'important');
  target.style.setProperty('bottom', 'auto', 'important');
  target.style.setProperty('transform', 'none', 'important');

  return { left: clampedX, top: clampedY };
}

export interface DraggableController {
  destroy: () => void;
  wasJustDragged: () => boolean;
}

export function makeDraggable(
  target: HTMLElement,
  trigger: HTMLElement,
  options: DraggableOptions = {}
): DraggableController {
  const margin = options.margin ?? DEFAULT_MARGIN;
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;

  let isPointerDown = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;
  let hasMoved = false;
  let suppressClickUntil = 0;

  const onPointerMove = (e: PointerEvent) => {
    if (!isPointerDown) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const threshold = e.pointerType === 'touch' ? 14 : 8;

    if (!hasMoved && Math.hypot(dx, dy) >= threshold) {
      hasMoved = true;
      try {
        trigger.setPointerCapture(e.pointerId);
      } catch {}
      target.classList.add('dragging');
      trigger.classList.add('dragging');
    }

    if (hasMoved) {
      const rect = target.getBoundingClientRect();
      const winW = typeof window !== 'undefined'
        ? (document.documentElement?.clientWidth || window.innerWidth || 1024)
        : 1024;
      const winH = typeof window !== 'undefined'
        ? (document.documentElement?.clientHeight || window.innerHeight || 768)
        : 768;
      const minX = margin;
      const minY = margin;
      const maxX = Math.max(minX, winW - rect.width - margin);
      const maxY = Math.max(minY, winH - rect.height - margin);

      const targetX = Math.round(Math.max(minX, Math.min(maxX, initialLeft + dx)));
      const targetY = Math.round(Math.max(minY, Math.min(maxY, initialTop + dy)));

      target.style.setProperty('left', `${targetX}px`, 'important');
      target.style.setProperty('top', `${targetY}px`, 'important');
      target.style.setProperty('right', 'auto', 'important');
      target.style.setProperty('bottom', 'auto', 'important');
      target.style.setProperty('transform', 'none', 'important');
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!isPointerDown) return;
    isPointerDown = false;

    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);

    try {
      if (trigger.hasPointerCapture(e.pointerId)) {
        trigger.releasePointerCapture(e.pointerId);
      }
    } catch {}

    target.classList.remove('dragging');
    trigger.classList.remove('dragging');

    if (hasMoved) {
      suppressClickUntil = Date.now() + 150;
      const pos = clampToViewport(target, margin);
      savePosition(pos, storageKey);
      options.onDragEnd?.(pos);
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    if (!e.isPrimary) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    isPointerDown = true;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;

    const rect = target.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  trigger.addEventListener('pointerdown', onPointerDown);

  return {
    destroy: () => {
      trigger.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    },
    wasJustDragged: () => Date.now() < suppressClickUntil,
  };
}
