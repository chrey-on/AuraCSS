import type { StylePreset, SavedPromptedStyle, ExtractedTokens, TypographyUpdate } from './types';

const DOCK_STYLES = `
.auracss-variation-dock {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  align-items: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 18px;
  padding: 8px 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.2);
  z-index: 2147483646;
  pointer-events: auto;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: calc(100vw - 28px);
}
.auracss-variation-dock.visible { display: flex; }

.auracss-dock-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: stretch;
  justify-content: center;
  flex-shrink: 0;
}
.auracss-dock-stack.left { min-width: 48px; }
.auracss-dock-stack.right { min-width: 60px; }
.auracss-dock-row { display: flex; align-items: center; gap: 4px; }

.auracss-ai-remodel-btn {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  height: 28px; padding: 0 6px; border-radius: 7px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(56, 189, 248, 0.2) 100%);
  border: 1px solid rgba(168, 85, 247, 0.45);
  color: #d8b4fe; font-size: 12px; font-weight: 700; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; flex-shrink: 0;
}
.auracss-ai-remodel-btn:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(56, 189, 248, 0.3) 100%);
  border-color: #c084fc; color: #ffffff; transform: translateY(-1px);
}
.auracss-btn-badge {
  font-size: 9.5px; font-weight: 800; background: rgba(168, 85, 247, 0.35);
  padding: 1px 4px; border-radius: 4px; color: #f3e8ff; line-height: 1;
}

.auracss-preset-reset {
  display: flex; align-items: center; justify-content: center;
  height: 24px; padding: 0 6px; border-radius: 7px;
  background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171; font-size: 13px; font-weight: 700; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; flex-shrink: 0;
}
.auracss-preset-reset:hover { background: rgba(239, 68, 68, 0.25); border-color: #f87171; transform: translateY(-1px); }
.auracss-preset-reset.disabled { opacity: 0.35; cursor: default; pointer-events: none; }

.auracss-dock-divider { width: 1px; height: 48px; background: rgba(255, 255, 255, 0.1); flex-shrink: 0; }

.auracss-cards-track {
  display: flex; align-items: center; gap: 10px; overflow-x: auto;
  scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch;
  cursor: grab; user-select: none; max-width: min(800px, calc(100vw - 220px)); padding: 2px 2px;
}
.auracss-cards-track::-webkit-scrollbar { display: none; }
.auracss-cards-track.grabbing { cursor: grabbing; }

.auracss-preset-card {
  display: flex; flex-direction: column; gap: 3px; padding: 8px 12px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer; transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1); min-width: 145px; max-width: 175px; flex-shrink: 0;
}
.auracss-preset-card:hover { background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.4); transform: translateY(-2px); }
.auracss-preset-card.active { background: rgba(168, 85, 247, 0.2); border-color: #a855f7; box-shadow: 0 0 14px rgba(168, 85, 247, 0.4); }
.auracss-preset-name { color: #f8fafc; font-size: 11.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.auracss-preset-desc { color: #94a3b8; font-size: 10px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.auracss-contrast-badge { font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px; display: inline-flex; align-items: center; width: fit-content; margin-top: 1px; }
.auracss-contrast-badge.AAA { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); }
.auracss-contrast-badge.AA { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); }
.auracss-contrast-badge.FAIL { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }

.auracss-dock-palette-btn, .auracss-dock-tune-btn {
  display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px;
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e2e8f0; font-size: 13px; cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
}
.auracss-dock-palette-btn:hover, .auracss-dock-tune-btn:hover { background: rgba(56, 189, 248, 0.15); border-color: #38bdf8; transform: translateY(-1px); }

.auracss-ai-settings-btn {
  display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px;
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15);
  color: #94a3b8; font-size: 13px; cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
}
.auracss-ai-settings-btn:hover { background: rgba(255, 255, 255, 0.15); color: #f8fafc; transform: translateY(-1px); }

.auracss-saved-styles-btn {
  display: flex; align-items: center; justify-content: center; gap: 3px;
  height: 24px; padding: 0 6px; border-radius: 7px;
  background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25);
  color: #38bdf8; font-size: 11px; font-weight: 700; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; flex-shrink: 0;
}
.auracss-saved-styles-btn:hover { background: rgba(56, 189, 248, 0.25); border-color: #38bdf8; transform: translateY(-1px); }

/* Floating Popovers */
.auracss-saved-popover, .auracss-palette-popover {
  position: absolute; bottom: calc(100% + 10px); right: 0; width: 330px; max-width: 90vw; max-height: 420px;
  background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 14px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7); padding: 14px; display: none; flex-direction: column; gap: 10px;
  z-index: 2147483647; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc;
}
.auracss-saved-popover.visible, .auracss-palette-popover.visible { display: flex; }

.auracss-saved-popover-header, .auracss-palette-header {
  display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 700; color: #38bdf8;
}
.auracss-saved-popover-close, .auracss-palette-close {
  background: transparent; border: none; color: #94a3b8; font-size: 14px; cursor: pointer; padding: 2px 6px; border-radius: 4px;
}
.auracss-saved-popover-close:hover, .auracss-palette-close:hover { color: #ffffff; background: rgba(255, 255, 255, 0.1); }

.auracss-saved-list { display: flex; flex-direction: column; gap: 8px; max-height: 310px; overflow-y: auto; scrollbar-width: thin; }
.auracss-saved-card {
  display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-radius: 8px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; transition: all 0.15s ease;
}
.auracss-saved-card:hover { background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.4); transform: translateY(-1px); }
.auracss-saved-card.active { border-color: #a855f7; background: rgba(168, 85, 247, 0.18); }
.auracss-saved-card-header { display: flex; justify-content: space-between; align-items: center; }
.auracss-saved-card-title { font-size: 11.5px; font-weight: 700; color: #f8fafc; }
.auracss-saved-card-time { font-size: 9.5px; color: #64748b; font-weight: 500; }
.auracss-saved-card-desc { font-size: 10.5px; color: #94a3b8; line-height: 1.3; }
.auracss-saved-card-tw {
  font-size: 9.5px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: #38bdf8;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: rgba(56, 189, 248, 0.1);
  padding: 2px 5px; border-radius: 4px;
}
.auracss-saved-card-remove {
  background: transparent; border: none; color: #64748b; font-size: 11px;
  cursor: pointer; padding: 0 4px; line-height: 1; border-radius: 4px;
  transition: all 0.15s ease; margin-left: 6px;
}
.auracss-saved-card-remove:hover { color: #f43f5e; background: rgba(244, 63, 94, 0.15); }
.auracss-saved-clear-all {
  background: rgba(244, 63, 94, 0.12); border: 1px solid rgba(244, 63, 94, 0.25);
  color: #f87171; font-size: 10px; font-weight: 600; border-radius: 5px;
  padding: 2px 7px; cursor: pointer; margin-left: auto; margin-right: 6px;
  transition: all 0.15s ease;
}
.auracss-saved-clear-all:hover { background: rgba(244, 63, 94, 0.25); color: #fecdd3; }
.auracss-saved-empty { text-align: center; color: #64748b; font-size: 11.5px; padding: 16px 8px; line-height: 1.4; }

/* Typography Popover Elements */
.auracss-palette-section { display: flex; flex-direction: column; gap: 5px; }
.auracss-palette-section-title {
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-top: 1px;
}
.auracss-font-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; }
.auracss-font-pill, .auracss-theme-pill {
  display: flex; align-items: center; justify-content: center; padding: 5px 8px; border-radius: 6px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e2e8f0; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.15s ease;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.auracss-font-pill:hover, .auracss-theme-pill:hover { background: rgba(56, 189, 248, 0.12); border-color: #38bdf8; transform: translateY(-1px); }
.auracss-font-pill.active, .auracss-theme-pill.active { background: rgba(56, 189, 248, 0.2); border-color: #38bdf8; color: #38bdf8; font-weight: 700; }

.auracss-pills-row { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; }
.auracss-size-pill, .auracss-style-pill {
  display: inline-flex; align-items: center; justify-content: center; padding: 3px 7px; border-radius: 5px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1; font-size: 10px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;
}
.auracss-size-pill:hover, .auracss-style-pill:hover { background: rgba(56, 189, 248, 0.12); border-color: #38bdf8; color: #ffffff; transform: translateY(-1px); }
.auracss-size-pill.active, .auracss-style-pill.active { background: #38bdf8; color: #0f172a; font-weight: 700; border-color: #38bdf8; }

.auracss-swatches-grid { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; margin-top: 1px; }
.auracss-swatch-btn {
  width: 22px; height: 22px; border-radius: 5px; border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
}
.auracss-swatch-btn:hover { transform: scale(1.18); border-color: #ffffff; box-shadow: 0 0 8px rgba(255, 255, 255, 0.4); }
.auracss-swatch-btn.active { border: 2px solid #38bdf8; box-shadow: 0 0 8px #38bdf8; }
.auracss-dock-content { display: flex; align-items: center; gap: 8px; width: 100%; }
`;

interface FontDef {
  name: string;
  family: string;
  tailwind: string;
}

const FONT_FAMILIES: readonly FontDef[] = [
  { name: 'Inter / Sans', family: 'Inter, system-ui, -apple-system, sans-serif', tailwind: 'font-sans' },
  { name: 'Modern Mono', family: 'ui-monospace, SFMono-Regular, Menlo, monospace', tailwind: 'font-mono' },
  { name: 'Editorial Serif', family: 'Georgia, Cambria, "Times New Roman", serif', tailwind: 'font-serif' },
  { name: 'Display Heading', family: 'Impact, "Cabinet Grotesk", system-ui, sans-serif', tailwind: 'font-display' },
];

interface FontSizeDef {
  label: string;
  size: string;
  tailwind: string;
}

const FONT_SIZES: readonly FontSizeDef[] = [
  { label: 'XS (12px)', size: '12px', tailwind: 'text-xs' },
  { label: 'SM (14px)', size: '14px', tailwind: 'text-sm' },
  { label: 'MD (16px)', size: '16px', tailwind: 'text-base' },
  { label: 'LG (18px)', size: '18px', tailwind: 'text-lg' },
  { label: 'XL (22px)', size: '22px', tailwind: 'text-xl' },
  { label: '2XL (28px)', size: '28px', tailwind: 'text-2xl' },
];

interface FontColorDef {
  name: string;
  hex: string;
  tailwind: string;
}

const FONT_COLORS: readonly FontColorDef[] = [
  { name: 'Pure White', hex: '#ffffff', tailwind: 'text-white' },
  { name: 'Slate 100', hex: '#f1f5f9', tailwind: 'text-slate-100' },
  { name: 'Muted Slate', hex: '#94a3b8', tailwind: 'text-slate-400' },
  { name: 'Sky Cyan', hex: '#38bdf8', tailwind: 'text-sky-400' },
  { name: 'Electric Violet', hex: '#a855f7', tailwind: 'text-purple-400' },
  { name: 'Emerald Neon', hex: '#34d399', tailwind: 'text-emerald-400' },
  { name: 'Warm Amber', hex: '#fbbf24', tailwind: 'text-amber-400' },
  { name: 'Rose Flame', hex: '#f87171', tailwind: 'text-rose-400' },
  { name: 'Deep Slate', hex: '#0f172a', tailwind: 'text-slate-900' },
];

interface FontStyleDef {
  label: string;
  property: string;
  value: string;
  tailwind: string;
}

const FONT_STYLES: readonly FontStyleDef[] = [
  { label: 'Regular (400)', property: 'font-weight', value: '400', tailwind: 'font-normal' },
  { label: 'Medium (500)', property: 'font-weight', value: '500', tailwind: 'font-medium' },
  { label: 'Semibold (600)', property: 'font-weight', value: '600', tailwind: 'font-semibold' },
  { label: 'Bold (700)', property: 'font-weight', value: '700', tailwind: 'font-bold' },
  { label: 'Italic', property: 'font-style', value: 'italic', tailwind: 'italic' },
  { label: 'Uppercase', property: 'text-transform', value: 'uppercase', tailwind: 'uppercase tracking-wider' },
  { label: 'Underline', property: 'text-decoration', value: 'underline', tailwind: 'underline' },
];

function formatTimeAgo(ts: number): string {
  const diffSec = Math.floor((Date.now() - ts) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  return `${diffHours}h ago`;
}

export class VariationDock {
  private dockEl: HTMLDivElement | null = null;
  private dockContentEl: HTMLDivElement | null = null;
  private savedPopoverEl: HTMLDivElement | null = null;
  private palettePopoverEl: HTMLDivElement | null = null;
  private activePresetId: string | null = null;
  private onSelectCallback: ((preset: StylePreset) => void) | null = null;
  private removeWindowListeners: (() => void) | null = null;

  public mount(shadow: ShadowRoot): void {
    if (this.dockEl) return;

    const styleEl = document.createElement('style');
    styleEl.textContent = DOCK_STYLES;
    shadow.appendChild(styleEl);

    const dock = document.createElement('div');
    dock.className = 'auracss-variation-dock';
    dock.setAttribute('role', 'toolbar');
    dock.setAttribute('aria-label', 'AuraCSS Design Variations');

    const savedPopover = document.createElement('div');
    savedPopover.className = 'auracss-saved-popover';
    dock.appendChild(savedPopover);
    this.savedPopoverEl = savedPopover;

    const palettePopover = document.createElement('div');
    palettePopover.className = 'auracss-palette-popover';
    dock.appendChild(palettePopover);
    this.palettePopoverEl = palettePopover;

    const dockContent = document.createElement('div');
    dockContent.className = 'auracss-dock-content';
    dock.appendChild(dockContent);
    this.dockContentEl = dockContent;

    shadow.appendChild(dock);
    this.dockEl = dock;
  }

  public setActivePresetId(id: string | null): void {
    this.activePresetId = id;
    if (this.dockEl) {
      this.dockEl.querySelectorAll('.auracss-preset-card').forEach((c) => {
        const el = c as HTMLElement;
        el.classList.toggle('active', el.dataset.presetId === id);
      });
      if (this.savedPopoverEl) {
        this.savedPopoverEl.querySelectorAll('.auracss-saved-card').forEach((c) => {
          const el = c as HTMLElement;
          el.classList.toggle('active', el.dataset.savedId === id);
        });
      }
    }
  }

  public closeAllPopovers(): void {
    this.savedPopoverEl?.classList.remove('visible');
    this.palettePopoverEl?.classList.remove('visible');
  }

  public toggleSavedPopover(
    savedStyles: SavedPromptedStyle[],
    onSelect?: (style: SavedPromptedStyle) => void,
    onDelete?: (style: SavedPromptedStyle) => void,
    onClearAll?: () => void
  ): void {
    if (!this.savedPopoverEl) return;
    const isVisible = this.savedPopoverEl.classList.contains('visible');
    this.closeAllPopovers();
    if (!isVisible) {
      this.renderSavedPopover(savedStyles, onSelect, onDelete, onClearAll);
      this.savedPopoverEl.classList.add('visible');
    }
  }

  public togglePalettePopover(
    onApplyTypography?: (update: TypographyUpdate) => void,
    _onSelectSwatch?: (hex: string) => void
  ): void {
    if (!this.palettePopoverEl) return;
    const isVisible = this.palettePopoverEl.classList.contains('visible');
    this.closeAllPopovers();
    if (!isVisible) {
      this.renderPalettePopover(onApplyTypography, _onSelectSwatch);
      this.palettePopoverEl.classList.add('visible');
    }
  }

  private renderPalettePopover(
    onApplyTypography?: (update: TypographyUpdate) => void,
    _onSelectSwatch?: (hex: string) => void
  ): void {
    if (!this.palettePopoverEl) return;
    this.palettePopoverEl.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'auracss-palette-header';
    header.innerHTML = `<span>🔤 Typography & Font Style</span>`;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'auracss-palette-close';
    closeBtn.type = 'button';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      this.palettePopoverEl?.classList.remove('visible');
    };
    header.appendChild(closeBtn);
    this.palettePopoverEl.appendChild(header);

    // Section 1: Fonts (Font Families)
    const fontSec = document.createElement('div');
    fontSec.className = 'auracss-palette-section';
    const fontTitle = document.createElement('div');
    fontTitle.className = 'auracss-palette-section-title';
    fontTitle.textContent = 'Font Family';
    fontSec.appendChild(fontTitle);

    const fontGrid = document.createElement('div');
    fontGrid.className = 'auracss-font-grid';
    FONT_FAMILIES.forEach((f) => {
      const pill = document.createElement('button');
      pill.className = 'auracss-font-pill auracss-theme-pill';
      pill.type = 'button';
      pill.style.fontFamily = f.family;
      pill.textContent = f.name;
      pill.onclick = (e) => {
        e.stopPropagation();
        fontGrid.querySelectorAll('.auracss-font-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        onApplyTypography?.({
          property: 'font-family',
          value: f.family,
          tailwind: f.tailwind,
          label: f.name,
        });
      };
      fontGrid.appendChild(pill);
    });
    fontSec.appendChild(fontGrid);
    this.palettePopoverEl.appendChild(fontSec);

    // Section 2: Font Sizes
    const sizeSec = document.createElement('div');
    sizeSec.className = 'auracss-palette-section';
    const sizeTitle = document.createElement('div');
    sizeTitle.className = 'auracss-palette-section-title';
    sizeTitle.textContent = 'Font Size';
    sizeSec.appendChild(sizeTitle);

    const sizeRow = document.createElement('div');
    sizeRow.className = 'auracss-pills-row';
    FONT_SIZES.forEach((s) => {
      const pill = document.createElement('button');
      pill.className = 'auracss-size-pill';
      pill.type = 'button';
      pill.textContent = s.label;
      pill.onclick = (e) => {
        e.stopPropagation();
        sizeRow.querySelectorAll('.auracss-size-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        onApplyTypography?.({
          property: 'font-size',
          value: s.size,
          tailwind: s.tailwind,
          label: s.label,
        });
      };
      sizeRow.appendChild(pill);
    });
    sizeSec.appendChild(sizeRow);
    this.palettePopoverEl.appendChild(sizeSec);

    // Section 3: Font Colors
    const colorSec = document.createElement('div');
    colorSec.className = 'auracss-palette-section';
    const colorTitle = document.createElement('div');
    colorTitle.className = 'auracss-palette-section-title';
    colorTitle.textContent = 'Font Color';
    colorSec.appendChild(colorTitle);

    const colorGrid = document.createElement('div');
    colorGrid.className = 'auracss-swatches-grid';
    FONT_COLORS.forEach((c) => {
      const btn = document.createElement('button');
      btn.className = 'auracss-swatch-btn auracss-font-color-btn';
      btn.type = 'button';
      btn.title = `Apply ${c.name} (${c.hex})`;
      btn.style.backgroundColor = c.hex;
      btn.onclick = (e) => {
        e.stopPropagation();
        colorGrid.querySelectorAll('.auracss-swatch-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        onApplyTypography?.({
          property: 'color',
          value: c.hex,
          tailwind: c.tailwind,
          label: c.name,
        });
      };
      colorGrid.appendChild(btn);
    });
    colorSec.appendChild(colorGrid);
    this.palettePopoverEl.appendChild(colorSec);

    // Section 4: Font Styles
    const styleSec = document.createElement('div');
    styleSec.className = 'auracss-palette-section';
    const styleTitle = document.createElement('div');
    styleTitle.className = 'auracss-palette-section-title';
    styleTitle.textContent = 'Font Style & Weight';
    styleSec.appendChild(styleTitle);

    const styleRow = document.createElement('div');
    styleRow.className = 'auracss-pills-row';
    FONT_STYLES.forEach((st) => {
      const pill = document.createElement('button');
      pill.className = 'auracss-style-pill';
      pill.type = 'button';
      pill.textContent = st.label;
      pill.onclick = (e) => {
        e.stopPropagation();
        styleRow.querySelectorAll('.auracss-style-pill').forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        onApplyTypography?.({
          property: st.property,
          value: st.value,
          tailwind: st.tailwind,
          label: st.label,
        });
      };
      styleRow.appendChild(pill);
    });
    styleSec.appendChild(styleRow);
    this.palettePopoverEl.appendChild(styleSec);
  }

  private renderSavedPopover(
    savedStyles: SavedPromptedStyle[],
    onSelect?: (style: SavedPromptedStyle) => void,
    onDelete?: (style: SavedPromptedStyle) => void,
    onClearAll?: () => void
  ): void {
    if (!this.savedPopoverEl) return;
    this.savedPopoverEl.innerHTML = '';

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
      this.savedPopoverEl?.classList.remove('visible');
    };
    header.appendChild(closeBtn);
    this.savedPopoverEl.appendChild(header);

    const list = document.createElement('div');
    list.className = 'auracss-saved-list';

    if (savedStyles.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'auracss-saved-empty';
      empty.innerHTML = `
        <div style="font-weight: 600; color: #94a3b8;">✨ No saved prompts yet</div>
        <div style="font-size: 10px; margin-top: 4px;">Prompt Antigravity in chat to generate and stream live styles here.</div>
      `;
      list.appendChild(empty);
    } else {
      savedStyles.forEach((style) => {
        const card = document.createElement('div');
        card.className = `auracss-saved-card${style.id === this.activePresetId ? ' active' : ''}`;
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
          this.setActivePresetId(style.id);
          onSelect?.(style);
        });

        list.appendChild(card);
      });
    }

    this.savedPopoverEl.appendChild(list);
  }

  public render(
    presets: StylePreset[],
    onSelect: (preset: StylePreset) => void,
    onReset?: () => void,
    isModified = false,
    _onPrompt?: (promptText: string) => void,
    onTogglePalette?: () => void,
    onOpenAISettings?: () => void,
    onRequestAISuggestions?: () => void,
    setIndex?: number,
    onDeselect?: (preset: StylePreset) => void,
    savedPromptedStyles?: SavedPromptedStyle[],
    onSelectSavedPromptedStyle?: (style: SavedPromptedStyle) => void,
    _tokens?: ExtractedTokens,
    _onSelectThemePreset?: (preset: StylePreset) => void,
    onSelectPaletteColor?: (hex: string) => void,
    onApplyTypography?: (update: TypographyUpdate) => void,
    onDeleteSavedPromptedStyle?: (style: SavedPromptedStyle) => void,
    onClearAllSavedPromptedStyles?: () => void
  ): void {
    if (!this.dockEl || !this.dockContentEl) return;
    this.onSelectCallback = onSelect;

    this.removeWindowListeners?.();
    this.removeWindowListeners = null;

    const wasSavedOpen = this.savedPopoverEl?.classList.contains('visible') ?? false;
    const wasPaletteOpen = this.palettePopoverEl?.classList.contains('visible') ?? false;

    this.dockContentEl.innerHTML = '';

    if (!isModified) {
      this.activePresetId = null;
    }

    // 1. LEFT STACK (✨ 1/3 over ↺ Revert)
    const leftStack = document.createElement('div');
    leftStack.className = 'auracss-dock-stack left';

    if (onRequestAISuggestions) {
      const aiBtn = document.createElement('button');
      aiBtn.className = 'auracss-ai-remodel-btn';
      aiBtn.type = 'button';
      const setLabel = typeof setIndex === 'number' ? `${setIndex + 1}/3` : '1/3';
      aiBtn.title = `AI Variations (Set ${setLabel}) - Click to cycle`;
      aiBtn.innerHTML = `<span>✨</span><span class="auracss-btn-badge">${setLabel}</span>`;
      aiBtn.onclick = (e) => {
        e.stopPropagation();
        aiBtn.innerHTML = `<span>✨</span><span class="auracss-btn-badge">...</span>`;
        onRequestAISuggestions();
      };
      leftStack.appendChild(aiBtn);
    }

    if (onReset) {
      const resetBtn = document.createElement('button');
      resetBtn.className = `auracss-preset-reset${isModified ? '' : ' disabled'}`;
      resetBtn.type = 'button';
      resetBtn.title = isModified ? 'Revert element to original unstyled state' : 'Original element unstyled';
      resetBtn.innerHTML = '↺';
      resetBtn.onclick = (e) => {
        e.stopPropagation();
        if (!isModified) return;
        this.activePresetId = null;
        onReset();
      };
      leftStack.appendChild(resetBtn);
    }

    this.dockContentEl.appendChild(leftStack);

    // Divider
    const leftDivider = document.createElement('div');
    leftDivider.className = 'auracss-dock-divider';
    this.dockContentEl.appendChild(leftDivider);

    // 2. MIDDLE SWIPEABLE TRACK (Drag to scroll + touch)
    const track = document.createElement('div');
    track.className = 'auracss-cards-track';

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasDragged = false;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      hasDragged = false;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      track.classList.add('grabbing');
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 4) {
        hasDragged = true;
      }
      track.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
      if (isDown) {
        isDown = false;
        track.classList.remove('grabbing');
      }
    };

    track.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    this.removeWindowListeners = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    presets.forEach((preset) => {
      const card = document.createElement('div');
      card.className = `auracss-preset-card${preset.id === this.activePresetId ? ' active' : ''}`;
      card.dataset.presetId = preset.id;

      const title = document.createElement('span');
      title.className = 'auracss-preset-name';
      title.textContent = preset.name;

      const desc = document.createElement('span');
      desc.className = 'auracss-preset-desc';
      desc.textContent = preset.description;

      card.appendChild(title);
      card.appendChild(desc);

      if (preset.contrastRating) {
        const badge = document.createElement('span');
        badge.className = `auracss-contrast-badge ${preset.contrastRating}`;
        badge.textContent = `WCAG ${preset.contrastRating} ${preset.contrastRatio ?? ''}`;
        card.appendChild(badge);
      }

      card.addEventListener('click', (e) => {
        if (hasDragged) return;
        e.stopPropagation();
        if (this.activePresetId === preset.id) {
          this.activePresetId = null;
          card.classList.remove('active');
          onDeselect?.(preset);
        } else {
          this.activePresetId = preset.id;
          this.dockEl?.querySelectorAll('.auracss-preset-card').forEach((c) => c.classList.remove('active'));
          card.classList.add('active');
          this.onSelectCallback?.(preset);
        }
      });

      track.appendChild(card);
    });

    this.dockContentEl.appendChild(track);

    // Divider
    const rightDivider = document.createElement('div');
    rightDivider.className = 'auracss-dock-divider';
    this.dockContentEl.appendChild(rightDivider);

    // 3. RIGHT STACK (Top: 🎨 Palette + ⚙️ Settings, Bottom: 💾 Saved styles)
    const rightStack = document.createElement('div');
    rightStack.className = 'auracss-dock-stack right';

    const topRow = document.createElement('div');
    topRow.className = 'auracss-dock-row';

    const paletteBtn = document.createElement('button');
    paletteBtn.className = 'auracss-dock-palette-btn auracss-dock-tune-btn';
    paletteBtn.type = 'button';
    paletteBtn.title = 'Typography & Font Styles';
    paletteBtn.innerHTML = 'Aa';
    paletteBtn.onclick = (e) => {
      e.stopPropagation();
      if (onTogglePalette) {
        onTogglePalette();
      } else {
        this.togglePalettePopover(onApplyTypography, onSelectPaletteColor);
      }
    };
    topRow.appendChild(paletteBtn);

    if (onOpenAISettings) {
      const setBtn = document.createElement('button');
      setBtn.className = 'auracss-ai-settings-btn';
      setBtn.type = 'button';
      setBtn.title = 'Antigravity Agent Diagnostics';
      setBtn.innerHTML = '⚙️';
      setBtn.onclick = (e) => {
        e.stopPropagation();
        onOpenAISettings();
      };
      topRow.appendChild(setBtn);
    }

    rightStack.appendChild(topRow);

    const savedBtn = document.createElement('button');
    savedBtn.className = 'auracss-saved-styles-btn';
    savedBtn.type = 'button';
    const count = savedPromptedStyles?.length || 0;
    savedBtn.title = `Saved Prompted Styles (${count} saved)`;
    savedBtn.innerHTML = `<span>💾</span>${count > 0 ? `<span class="auracss-btn-badge">${count}</span>` : ''}`;
    savedBtn.onclick = (e) => {
      e.stopPropagation();
      this.toggleSavedPopover(
        savedPromptedStyles || [],
        onSelectSavedPromptedStyle,
        onDeleteSavedPromptedStyle,
        onClearAllSavedPromptedStyles
      );
    };
    rightStack.appendChild(savedBtn);

    this.dockContentEl.appendChild(rightStack);
    this.dockEl.classList.add('visible');

    if (wasPaletteOpen) {
      this.renderPalettePopover(onApplyTypography, onSelectPaletteColor);
      this.palettePopoverEl?.classList.add('visible');
    } else if (wasSavedOpen) {
      this.renderSavedPopover(
        savedPromptedStyles || [],
        onSelectSavedPromptedStyle,
        onDeleteSavedPromptedStyle,
        onClearAllSavedPromptedStyles
      );
      this.savedPopoverEl?.classList.add('visible');
    }
  }

  public clear(): void {
    this.activePresetId = null;
    this.closeAllPopovers();
    this.removeWindowListeners?.();
    this.removeWindowListeners = null;
    if (this.dockEl) {
      this.dockEl.classList.remove('visible');
    }
    if (this.dockContentEl) {
      this.dockContentEl.innerHTML = '';
    }
  }

  public destroy(): void {
    this.clear();
    if (this.dockEl && this.dockEl.parentNode) {
      this.dockEl.parentNode.removeChild(this.dockEl);
    }
    this.dockEl = null;
    this.dockContentEl = null;
    this.savedPopoverEl = null;
    this.palettePopoverEl = null;
    this.onSelectCallback = null;
  }
}
