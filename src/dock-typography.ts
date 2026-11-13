import type { TypographyUpdate } from './types';
import {
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_COLORS,
  FONT_STYLES,
  LETTER_SPACINGS,
  LINE_HEIGHTS,
  TEXT_ALIGNS,
  type FontStyleDef,
} from './dock-typography-data';

export {
  FONT_FAMILIES,
  FONT_SIZES,
  FONT_COLORS,
  FONT_STYLES,
  LETTER_SPACINGS,
  LINE_HEIGHTS,
  TEXT_ALIGNS,
};

function renderPillSection(
  title: string,
  items: readonly FontStyleDef[],
  onApply?: (update: TypographyUpdate) => void
): HTMLDivElement {
  const sec = document.createElement('div');
  sec.className = 'auracss-palette-section';
  const t = document.createElement('div');
  t.className = 'auracss-palette-section-title';
  t.textContent = title;
  sec.appendChild(t);

  const row = document.createElement('div');
  row.className = 'auracss-pills-row';
  items.forEach((item) => {
    const pill = document.createElement('button');
    pill.className = 'auracss-style-pill';
    pill.type = 'button';
    pill.textContent = item.label;
    pill.onclick = (e) => {
      e.stopPropagation();
      row.querySelectorAll('.auracss-style-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      onApply?.({ property: item.property, value: item.value, tailwind: item.tailwind, label: item.label });
    };
    row.appendChild(pill);
  });
  sec.appendChild(row);
  return sec;
}

export function renderPalettePopover(
  container: HTMLDivElement,
  onApplyTypography?: (update: TypographyUpdate) => void,
  onRevertTypography?: () => void
): void {
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'auracss-palette-header';
  header.innerHTML = `<span>🔤 Typography & Font Style</span>`;

  const actions = document.createElement('div');
  actions.style.cssText = 'display: flex; align-items: center; gap: 6px;';

  if (onRevertTypography) {
    const revertBtn = document.createElement('button');
    revertBtn.className = 'auracss-palette-revert';
    revertBtn.type = 'button';
    revertBtn.title = 'Revert typography back to baseline';
    revertBtn.innerHTML = '↺ Reset';
    revertBtn.onclick = (e) => {
      e.stopPropagation();
      container
        .querySelectorAll('.auracss-font-pill, .auracss-size-pill, .auracss-style-pill, .auracss-swatch-btn')
        .forEach((p) => p.classList.remove('active'));
      onRevertTypography();
    };
    actions.appendChild(revertBtn);
  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'auracss-palette-close';
  closeBtn.type = 'button';
  closeBtn.innerHTML = '✕';
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    container.classList.remove('visible');
  };
  actions.appendChild(closeBtn);
  header.appendChild(actions);
  container.appendChild(header);

  // Section 1: Font Families
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
      onApplyTypography?.({ property: 'font-family', value: f.family, tailwind: f.tailwind, label: f.name });
    };
    fontGrid.appendChild(pill);
  });
  fontSec.appendChild(fontGrid);
  container.appendChild(fontSec);

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
      onApplyTypography?.({ property: 'font-size', value: s.size, tailwind: s.tailwind, label: s.label });
    };
    sizeRow.appendChild(pill);
  });
  sizeSec.appendChild(sizeRow);
  container.appendChild(sizeSec);

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
      onApplyTypography?.({ property: 'color', value: c.hex, tailwind: c.tailwind, label: c.name });
    };
    colorGrid.appendChild(btn);
  });
  colorSec.appendChild(colorGrid);
  container.appendChild(colorSec);

  // Section 4: Font Style & Weight
  container.appendChild(renderPillSection('Font Style & Weight', FONT_STYLES, onApplyTypography));

  // Section 5: Letter Spacing
  container.appendChild(renderPillSection('Letter Spacing (Tracking)', LETTER_SPACINGS, onApplyTypography));

  // Section 6: Line Height
  container.appendChild(renderPillSection('Line Height (Leading)', LINE_HEIGHTS, onApplyTypography));

  // Section 7: Text Alignment
  container.appendChild(renderPillSection('Text Alignment', TEXT_ALIGNS, onApplyTypography));
}
