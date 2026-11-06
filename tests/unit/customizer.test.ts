// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FineTuneCustomizer } from '../../src/customizer';

describe('FineTuneCustomizer (Shadow DOM Micro-Controls)', () => {
  let customizer: FineTuneCustomizer;
  let shadow: ShadowRoot;

  beforeEach(() => {
    document.body.innerHTML = '';
    const host = document.createElement('div');
    shadow = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);

    customizer = new FineTuneCustomizer();
    customizer.mount(shadow);
  });

  afterEach(() => {
    customizer.destroy();
    document.body.innerHTML = '';
  });

  it('mounts customizer drawer with segmented controls into shadow root', () => {
    const drawer = shadow.querySelector('.auracss-customizer-drawer');
    expect(drawer).not.toBeNull();
    expect(drawer?.getAttribute('role')).toBe('region');
    expect(drawer?.getAttribute('aria-label')).toBe('AuraCSS Fine-Tuning Controls');

    const rows = shadow.querySelectorAll('.auracss-tune-row');
    expect(rows.length).toBe(3); // Radius, Padding, Shadow

    const pills = shadow.querySelectorAll('.auracss-tune-pill');
    expect(pills.length).toBeGreaterThan(6);
  });

  it('toggles visibility correctly', () => {
    const drawer = shadow.querySelector('.auracss-customizer-drawer');
    expect(drawer?.classList.contains('visible')).toBe(false);

    const onTune = vi.fn();
    customizer.show(onTune);
    expect(drawer?.classList.contains('visible')).toBe(true);

    customizer.hide();
    expect(drawer?.classList.contains('visible')).toBe(false);

    customizer.toggle(onTune);
    expect(drawer?.classList.contains('visible')).toBe(true);

    customizer.toggle(onTune);
    expect(drawer?.classList.contains('visible')).toBe(false);
  });

  it('invokes callback with correct CSS and Tailwind token when a pill is clicked', () => {
    const onTune = vi.fn();
    customizer.show(onTune);

    const pills = shadow.querySelectorAll('.auracss-tune-pill');
    // Click "Pill" radius button (4th pill in first row: 0px, 8px, 16px, Pill)
    const pillBtn = pills[3] as HTMLButtonElement;
    expect(pillBtn.textContent).toBe('Pill');

    pillBtn.click();
    expect(onTune).toHaveBeenCalledWith({
      property: 'border-radius',
      value: '9999px',
      cssText: 'border-radius: 9999px;',
      tailwind: 'rounded-full',
    });
    expect(pillBtn.classList.contains('active')).toBe(true);
  });
});
