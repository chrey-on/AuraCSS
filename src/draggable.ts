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
  const width = rect.width || 32;
  const height = rect.height || 32;
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
  const clampedY = Math.round(Math.max(minY, Math.min(maxY, currentTop)));

  target.style.setProperty('left', `${clampedX}px`, 'important');
  target.style.setProperty('top', `${clampedY}px`, 'important');
  target.style.setProperty('right', 'auto', 'important');
  target.style.setProperty('bottom', 'auto', 'important');

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

    if (!hasMoved && Math.hypot(dx, dy) >= 8) {
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
