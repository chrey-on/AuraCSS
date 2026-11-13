import type { SavedPromptedStyle } from './types';

export function formatTimeAgo(ts: number): string {
  const diffSec = Math.floor((Date.now() - ts) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  return `${diffHours}h ago`;
}

export function renderSavedPopover(
  container: HTMLDivElement,
  savedStyles: SavedPromptedStyle[],
  activePresetId: string | null,
  onSelect?: (style: SavedPromptedStyle) => void,
  onDelete?: (style: SavedPromptedStyle) => void,
  onClearAll?: () => void
): void {
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'auracss-saved-popover-header';
  header.innerHTML = `<span>💾 Saved Prompted Styles (${savedStyles.length})</span>`;

  if (savedStyles.length > 0 && onClearAll) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'auracss-saved-clear-all';
    clearBtn.type = 'button';
    clearBtn.textContent = 'Clear All';
    clearBtn.title = 'Clear all saved prompt results';
    clearBtn.onclick = (e) => {
      e.stopPropagation();
      onClearAll();
    };
    header.appendChild(clearBtn);
  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'auracss-saved-popover-close';
  closeBtn.type = 'button';
  closeBtn.innerHTML = '✕';
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    container.classList.remove('visible');
  };
  header.appendChild(closeBtn);
  container.appendChild(header);

  const list = document.createElement('div');
  list.className = 'auracss-saved-list';

  if (savedStyles.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'auracss-saved-empty';
    empty.innerHTML = `
      <div style="font-weight: 600; color: #94a3b8;">✨ No saved prompts yet</div>
      <div style="font-size: 10px; margin-top: 4px;">Type in the prompt bar above to synthesize styles.</div>
    `;
    list.appendChild(empty);
  } else {
    savedStyles.forEach((style) => {
      const card = document.createElement('div');
      card.className = `auracss-saved-card${style.id === activePresetId ? ' active' : ''}`;
      card.dataset.savedId = style.id;

      const cardHeader = document.createElement('div');
      cardHeader.className = 'auracss-saved-card-header';

      const title = document.createElement('span');
      title.className = 'auracss-saved-card-title';
      title.textContent = style.name;

      const metaRow = document.createElement('div');
      metaRow.style.display = 'flex';
      metaRow.style.alignItems = 'center';

      const time = document.createElement('span');
      time.className = 'auracss-saved-card-time';
      time.textContent = formatTimeAgo(style.timestamp);
      metaRow.appendChild(time);

      if (onDelete) {
        const delBtn = document.createElement('button');
        delBtn.className = 'auracss-saved-card-remove';
        delBtn.type = 'button';
        delBtn.title = 'Remove this saved prompt result';
        delBtn.innerHTML = '✕';
        delBtn.onclick = (e) => {
          e.stopPropagation();
          onDelete(style);
        };
        metaRow.appendChild(delBtn);
      }

      cardHeader.append(title, metaRow);
      card.appendChild(cardHeader);

      if (style.description) {
        const desc = document.createElement('div');
        desc.className = 'auracss-saved-card-desc';
        desc.textContent = style.description;
        card.appendChild(desc);
      }

      if (style.tailwindClasses) {
        const tw = document.createElement('div');
        tw.className = 'auracss-saved-card-tw';
        tw.textContent = style.tailwindClasses;
        card.appendChild(tw);
      }

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelect?.(style);
      });

      list.appendChild(card);
    });
  }

  container.appendChild(list);
}
