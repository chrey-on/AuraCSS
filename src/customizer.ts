const CUSTOMIZER_STYLES = `
.auracss-customizer-drawer {
  position: fixed;
  bottom: 86px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  flex-direction: column;
  gap: 8px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
  z-index: 2147483646;
  pointer-events: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-width: 380px;
}
.auracss-customizer-drawer.visible { display: flex; }
.auracss-tune-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.auracss-tune-label { color: #94a3b8; font-size: 11px; font-weight: 600; min-width: 60px; }
.auracss-tune-pills { display: flex; gap: 4px; flex: 1; }
.auracss-tune-pill {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  font-size: 10px;
  font-weight: 500;
  padding: 4px 6px;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}
.auracss-tune-pill:hover { background: rgba(56, 189, 248, 0.15); border-color: #38bdf8; }
.auracss-tune-pill.active { background: #38bdf8; color: #0f172a; font-weight: 700; border-color: #38bdf8; }
`;

export interface StyleTuneUpdate {
  property: string;
  value: string;
  cssText: string;
  tailwind: string;
}

export type StyleTuneHandler = (styleUpdates: StyleTuneUpdate) => void;

export class FineTuneCustomizer {
  private drawerEl: HTMLDivElement | null = null;
  private onTuneCallback: StyleTuneHandler | null = null;

  public mount(shadow: ShadowRoot): void {
    if (this.drawerEl) return;

    const styleEl = document.createElement('style');
    styleEl.textContent = CUSTOMIZER_STYLES;
    shadow.appendChild(styleEl);

    const drawer = document.createElement('div');
    drawer.className = 'auracss-customizer-drawer';
    drawer.setAttribute('role', 'region');
    drawer.setAttribute('aria-label', 'AuraCSS Fine-Tuning Controls');

    // Row 1: Radius
    drawer.appendChild(this.createRow('Radius', [
      { label: '0px', value: '0px', tw: 'rounded-none' },
      { label: '8px', value: '8px', tw: 'rounded-lg' },
      { label: '16px', value: '16px', tw: 'rounded-2xl' },
      { label: 'Pill', value: '9999px', tw: 'rounded-full' },
    ], 'borderRadius'));

    // Row 2: Padding
    drawer.appendChild(this.createRow('Padding', [
      { label: 'Tight', value: '6px 12px', tw: 'px-3 py-1.5' },
      { label: 'Normal', value: '10px 20px', tw: 'px-5 py-2.5' },
      { label: 'Wide', value: '16px 28px', tw: 'px-7 py-3.5' },
    ], 'padding'));

    // Row 3: Elevation
    drawer.appendChild(this.createRow('Shadow', [
      { label: 'Flat', value: 'none', tw: 'shadow-none' },
      { label: 'Elevation', value: '0 8px 24px rgba(0,0,0,0.3)', tw: 'shadow-xl' },
      { label: 'Neon Glow', value: '0 0 20px rgba(56, 189, 248, 0.45)', tw: 'shadow-[0_0_20px_#38bdf8]' },
    ], 'boxShadow'));

    shadow.appendChild(drawer);
    this.drawerEl = drawer;
  }

  private createRow(
    labelStr: string,
    options: { label: string; value: string; tw: string }[],
    cssProp: string
  ): HTMLDivElement {
    const row = document.createElement('div');
    row.className = 'auracss-tune-row';

    const lbl = document.createElement('span');
    lbl.className = 'auracss-tune-label';
    lbl.textContent = labelStr;
    row.appendChild(lbl);

    const pillsContainer = document.createElement('div');
    pillsContainer.className = 'auracss-tune-pills';

    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.className = 'auracss-tune-pill';
      btn.type = 'button';
      btn.textContent = opt.label;
      btn.onclick = (e) => {
        e.stopPropagation();
        pillsContainer.querySelectorAll('.auracss-tune-pill').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');

        const kebab = cssProp.replace(/([A-Z])/g, '-$1').toLowerCase();
        this.onTuneCallback?.({
          property: kebab,
          value: opt.value,
          cssText: `${kebab}: ${opt.value};`,
          tailwind: opt.tw,
        });
      };
      pillsContainer.appendChild(btn);
    });

    row.appendChild(pillsContainer);
    return row;
  }

  public show(onTune: StyleTuneHandler): void {
    this.onTuneCallback = onTune;
    this.drawerEl?.classList.add('visible');
  }

  public hide(): void {
    this.drawerEl?.classList.remove('visible');
    this.onTuneCallback = null;
  }

  public toggle(onTune: StyleTuneHandler): void {
    if (this.drawerEl?.classList.contains('visible')) {
      this.hide();
    } else {
      this.show(onTune);
    }
  }

  public destroy(): void {
    this.hide();
    if (this.drawerEl && this.drawerEl.parentNode) {
      this.drawerEl.parentNode.removeChild(this.drawerEl);
    }
    this.drawerEl = null;
  }
}
