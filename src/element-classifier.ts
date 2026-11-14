import { isIconOrMediaElement } from './icon-presets';

export type ElementArchetype =
  | 'icon-emoji'
  | 'photo-media'
  | 'button-action'
  | 'input-control'
  | 'heading-title'
  | 'badge-pill'
  | 'text-prose'
  | 'card-container';

const ACTION_INPUT_TYPES = new Set(['button', 'submit', 'reset']);

export function classifyElement(el: HTMLElement): ElementArchetype {
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute('role') || '';

  if (tag === 'video' || tag === 'picture') return 'photo-media';
  if (tag === 'img') {
    let maxDim = 0;
    try {
      const rect = el.getBoundingClientRect();
      maxDim = Math.max(rect.width, rect.height);
    } catch {}
    return maxDim > 72 ? 'photo-media' : 'icon-emoji';
  }
  if (isIconOrMediaElement(el)) return 'icon-emoji';

  if (tag === 'input' || tag === 'textarea' || tag === 'select') {
    const inputType = (el as HTMLInputElement).type?.toLowerCase() || '';
    return ACTION_INPUT_TYPES.has(inputType) ? 'button-action' : 'input-control';
  }

  const isButtonLike = el.classList.contains('btn') || el.classList.contains('button');
  if (tag === 'button' || tag === 'a' || role === 'button' || isButtonLike) {
    return 'button-action';
  }

  if (/^h[1-6]$/.test(tag) || role === 'heading') return 'heading-title';

  const text = (el.textContent || '').trim();
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
  if (t === 'svg' || t === 'i' || htmlSnippet.includes('<svg')) return 'icon-emoji';
  if (t === 'input' || t === 'textarea' || t === 'select') return 'input-control';
  if (t === 'button' || t === 'a' || htmlSnippet.includes('role="button"')) return 'button-action';
  if (/^h[1-6]$/.test(t)) return 'heading-title';
  if (['span', 'label', 'strong', 'small', 'code'].includes(t) && innerText.length > 0 && innerText.length <= 28) {
    return 'badge-pill';
  }
  if (['p', 'li', 'blockquote', 'figcaption'].includes(t)) return 'text-prose';
  return 'card-container';
}
