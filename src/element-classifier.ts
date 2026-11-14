import { isIconOrMediaElement, isIconTagOrSnippet } from './icon-presets';

export type ElementArchetype =
  | 'icon-emoji'
  | 'photo-media'
  | 'divider-line'
  | 'scrollbar-track'
  | 'shape-graphic'
  | 'button-action'
  | 'input-control'
  | 'heading-title'
  | 'badge-pill'
  | 'text-prose'
  | 'card-container';

const ACTION_INPUT_TYPES = new Set(['button', 'submit', 'reset']);
const SVG_SHAPE_TAGS = new Set(['circle', 'rect', 'path', 'polygon', 'ellipse', 'line', 'polyline']);
const SCROLLBAR_RE = /\b(scrollbar|scroll-bar|scroll-thumb|scroll-track|simplebar|os-scrollbar|progress-bar|progressbar|slider-track|slider-thumb)\b|scroll(bar|thumb|track)/i;
const DIVIDER_RE = /\b(divider|separator|hairline|rule|hr-line)\b/i;
const SHAPE_RE = /\b(shape|blob|circle|dot|indicator|swatch|orb|badge-dot|status-dot|skeleton)\b/i;

function getElementRect(el: HTMLElement): { width: number; height: number } {
  try {
    if (typeof el.getBoundingClientRect === 'function') {
      const r = el.getBoundingClientRect();
      return { width: r.width || 0, height: r.height || 0 };
    }
  } catch {}
  return { width: 0, height: 0 };
}

export function classifyElement(el: HTMLElement): ElementArchetype {
  const tag = el.tagName.toLowerCase();
  const role = (el.getAttribute('role') || '').toLowerCase();
  const classAndId = `${typeof el.className === 'string' ? el.className : ''} ${el.id || ''}`;

  if (tag === 'video' || tag === 'picture') return 'photo-media';
  if (tag === 'img') {
    const rect = getElementRect(el);
    return Math.max(rect.width, rect.height) > 72 ? 'photo-media' : 'icon-emoji';
  }
  if (SVG_SHAPE_TAGS.has(tag) || tag === 'canvas') return 'shape-graphic';
  if (isIconOrMediaElement(el)) return 'icon-emoji';

  if (tag === 'hr' || role === 'separator') return 'divider-line';
  if (
    tag === 'progress' ||
    tag === 'meter' ||
    role === 'scrollbar' ||
    role === 'progressbar' ||
    role === 'slider' ||
    el.hasAttribute('data-thumb') ||
    SCROLLBAR_RE.test(classAndId)
  ) {
    return 'scrollbar-track';
  }

  if (tag === 'input' || tag === 'textarea' || tag === 'select') {
    const inputType = (el as HTMLInputElement).type?.toLowerCase() || '';
    if (inputType === 'range') return 'scrollbar-track';
    return ACTION_INPUT_TYPES.has(inputType) ? 'button-action' : 'input-control';
  }

  const text = (el.textContent || '').trim();
  const { width: w, height: h } = getElementRect(el);

  // Leaf or structural elements with zero text: lines, scrollbar thumbs/tracks, or geometric shapes/dots
  if (text.length === 0 && el.children.length <= 4) {
    if (DIVIDER_RE.test(classAndId)) return 'divider-line';
    const isHorizontalLine = el.children.length === 0 && h > 0 && h <= 6 && w >= 24 && w / h >= 6;
    const isVerticalLine = el.children.length === 0 && w > 0 && w <= 6 && h >= 16 && h / w >= 4;
    if (isHorizontalLine || isVerticalLine) return 'divider-line';

    const isVerticalScrollbar = w >= 4 && w <= 36 && h >= 28 && h / w >= 2.5;
    const isHorizontalScrollbar = el.children.length >= 1 && h >= 4 && h <= 24 && w >= 60 && w / h >= 4;
    if (isVerticalScrollbar || isHorizontalScrollbar) {
      return 'scrollbar-track';
    }

    if (el.children.length === 0) {
      if (SHAPE_RE.test(classAndId)) return 'shape-graphic';
      if (w > 0 && h > 0 && Math.max(w, h) <= 96) return 'shape-graphic';
    }
  }

  const isButtonLike = el.classList.contains('btn') || el.classList.contains('button');
  if (tag === 'button' || tag === 'a' || role === 'button' || isButtonLike) {
    return 'button-action';
  }

  if (/^h[1-6]$/.test(tag) || role === 'heading') return 'heading-title';

  if (el.children.length === 0 && text.length > 0) {
    if (['span', 'label', 'strong', 'em', 'small', 'code', 'b'].includes(tag) && text.length <= 28) {
      return 'badge-pill';
    }
    if (['p', 'li', 'blockquote', 'figcaption', 'span', 'div'].includes(tag)) {
      return 'text-prose';
    }
  }

  if (['p', 'li', 'blockquote', 'figcaption'].includes(tag)) return 'text-prose';
  return 'card-container';
}

export function classifySnapshot(
  tag: string,
  htmlSnippet = '',
  innerText = '',
  rect?: { width: number; height: number }
): ElementArchetype {
  const t = tag.toLowerCase();
  if (t === 'video' || t === 'picture') return 'photo-media';
  if (t === 'img') {
    const maxDim = rect ? Math.max(rect.width, rect.height) : 0;
    return maxDim > 72 ? 'photo-media' : 'icon-emoji';
  }
  if (SVG_SHAPE_TAGS.has(t) || t === 'canvas') return 'shape-graphic';
  if (t === 'svg' || t === 'i' || isIconTagOrSnippet(t, htmlSnippet, innerText)) return 'icon-emoji';
  if (t === 'hr' || htmlSnippet.includes('role="separator"') || DIVIDER_RE.test(htmlSnippet)) return 'divider-line';
  if (
    t === 'progress' ||
    t === 'meter' ||
    htmlSnippet.includes('role="scrollbar"') ||
    htmlSnippet.includes('role="progressbar"') ||
    htmlSnippet.includes('role="slider"') ||
    htmlSnippet.includes('type="range"') ||
    htmlSnippet.includes('data-thumb') ||
    SCROLLBAR_RE.test(htmlSnippet)
  ) {
    return 'scrollbar-track';
  }
  if (innerText.trim().length === 0 && rect) {
    const { width: w, height: h } = rect;
    if ((h > 0 && h <= 6 && w >= 24 && w / h >= 6) || (w > 0 && w <= 6 && h >= 16 && h / w >= 4)) {
      return 'divider-line';
    }
    if (w >= 4 && w <= 36 && h >= 28 && h / w >= 2.5) {
      return 'scrollbar-track';
    }
    if (SHAPE_RE.test(htmlSnippet) || (w > 0 && h > 0 && Math.max(w, h) <= 96 && !htmlSnippet.includes('role="button"'))) {
      return 'shape-graphic';
    }
  }
  if (t === 'input' || t === 'textarea' || t === 'select') return 'input-control';
  if (t === 'button' || t === 'a' || htmlSnippet.includes('role="button"')) return 'button-action';
  if (/^h[1-6]$/.test(t)) return 'heading-title';
  if (['span', 'label', 'strong', 'small', 'code'].includes(t) && innerText.length > 0 && innerText.length <= 28) {
    return 'badge-pill';
  }
  if (['p', 'li', 'blockquote', 'figcaption'].includes(tag)) return 'text-prose';
  return 'card-container';
}
