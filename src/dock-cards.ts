import type { StylePreset } from './types';

export interface CardsTrackResult {
  trackEl: HTMLDivElement;
  cleanup: () => void;
  setActiveId: (id: string | null) => void;
  updateBookmarks: (ids: Set<string>) => void;
}

export function createCardsTrack(
  presets: StylePreset[],
  initialActiveId: string | null,
  onSelect: (preset: StylePreset) => void,
  onDeselect?: (preset: StylePreset) => void,
  onPeek?: (preset: StylePreset) => void,
  onUnpeek?: () => void,
  onToggleBookmark?: (preset: StylePreset) => void,
  bookmarkedIds?: Set<string>
): CardsTrackResult {
  let activeId = initialActiveId;
  const track = document.createElement('div');
  track.className = 'auracss-cards-track';

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let hasDragged = false;
  let dragResetTimeout: ReturnType<typeof setTimeout> | null = null;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    hasDragged = false;
    if (dragResetTimeout) clearTimeout(dragResetTimeout);
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.classList.add('grabbing');
  });

  const onMouseMove = (e: MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 4) hasDragged = true;
    track.scrollLeft = scrollLeft - walk;
  };

  const onMouseUp = () => {
    if (isDown) {
      isDown = false;
      track.classList.remove('grabbing');
      if (dragResetTimeout) clearTimeout(dragResetTimeout);
      dragResetTimeout = setTimeout(() => {
        hasDragged = false;
      }, 50);
    }
  };

  const onTrackLeave = () => {
    if (!isDown) onUnpeek?.();
  };

  track.addEventListener('mouseleave', onTrackLeave);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  const cleanup = () => {
    if (dragResetTimeout) clearTimeout(dragResetTimeout);
    track.removeEventListener('mouseleave', onTrackLeave);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  const setActiveId = (id: string | null) => {
    activeId = id;
    track.querySelectorAll('.auracss-preset-card').forEach((c) => {
      const el = c as HTMLElement;
      el.classList.toggle('active', el.dataset.presetId === id);
    });
  };

  const updateBookmarks = (ids: Set<string>) => {
    track.querySelectorAll('.auracss-preset-card').forEach((c) => {
      const el = c as HTMLElement;
      const pid = el.dataset.presetId;
      const isBookmarked = pid ? ids.has(pid) : false;
      el.classList.toggle('bookmarked', isBookmarked);
      const btn = el.querySelector('.auracss-preset-bookmark') as HTMLButtonElement | null;
      if (btn) {
        btn.classList.toggle('bookmarked', isBookmarked);
        btn.innerHTML = isBookmarked ? '★' : '☆';
        btn.title = isBookmarked ? 'Remove bookmark' : 'Bookmark this preset';
      }
    });
  };

  presets.forEach((preset) => {
    const isBookmarked = bookmarkedIds?.has(preset.id) ?? false;
    const card = document.createElement('div');
    card.className = `auracss-preset-card${preset.id === activeId ? ' active' : ''}${isBookmarked ? ' bookmarked' : ''}`;
    card.dataset.presetId = preset.id;

    const header = document.createElement('div');
    header.className = 'auracss-preset-card-header';

    const title = document.createElement('span');
    title.className = 'auracss-preset-name';
    title.textContent = preset.name;
    header.appendChild(title);

    if (onToggleBookmark) {
      const bookmarkBtn = document.createElement('button');
      bookmarkBtn.className = `auracss-preset-bookmark${isBookmarked ? ' bookmarked' : ''}`;
      bookmarkBtn.type = 'button';
      bookmarkBtn.title = isBookmarked ? 'Remove bookmark' : 'Bookmark this preset';
      bookmarkBtn.innerHTML = isBookmarked ? '★' : '☆';
      bookmarkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onToggleBookmark(preset);
      });
      header.appendChild(bookmarkBtn);
    }

    const desc = document.createElement('span');
    desc.className = 'auracss-preset-desc';
    desc.textContent = preset.description;

    card.append(header, desc);

    if (preset.contrastRating) {
      const badge = document.createElement('span');
      badge.className = `auracss-contrast-badge ${preset.contrastRating}`;
      const labelMap: Record<string, string> = { AAA: 'Easy to Read', AA: 'Good Contrast', FAIL: 'Low Contrast' };
      badge.textContent = labelMap[preset.contrastRating] ?? 'Good Contrast';
      badge.title = `WCAG ${preset.contrastRating} ${preset.contrastRatio ?? ''}`.trim();
      card.appendChild(badge);
    }

    // Live Hover-Peek handlers
    card.addEventListener('mouseenter', () => {
      if (!isDown && !hasDragged) onPeek?.(preset);
    });
    card.addEventListener('mouseleave', () => {
      if (!isDown) onUnpeek?.();
    });

    card.addEventListener('click', (e) => {
      if (hasDragged) return;
      e.stopPropagation();
      onUnpeek?.();
      if (activeId === preset.id) {
        setActiveId(null);
        onDeselect?.(preset);
      } else {
        setActiveId(preset.id);
        onSelect(preset);
      }
    });

    track.appendChild(card);
  });

  return { trackEl: track, cleanup, setActiveId, updateBookmarks };
}
