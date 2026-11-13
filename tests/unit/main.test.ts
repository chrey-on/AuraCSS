// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuraCSSApp } from '../../src/main';

describe('AuraCSSApp (Master Orchestrator & Lifecycle)', () => {
  let app: AuraCSSApp;

  beforeEach(() => {
    document.body.innerHTML = '';
    app = new AuraCSSApp();
    app.init();
  });

  afterEach(() => {
    app.destroy();
    document.body.innerHTML = '';
  });

  it('initializes in standby mode with floating toggle button', () => {
    const root = document.getElementById('auracss-root');
    expect(root).not.toBeNull();

    const shadow = root?.shadowRoot;
    expect(shadow).not.toBeNull();

    const toggleBtn = shadow?.querySelector('.auracss-toggle-btn');
    expect(toggleBtn).not.toBeNull();
    expect(toggleBtn?.textContent).toContain('AuraCSS: OFF');
  });

  it('activates and deactivates via toggle', () => {
    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    const toggleBtn = shadow?.querySelector('.auracss-toggle-btn') as HTMLButtonElement;

    toggleBtn.click();
    expect(toggleBtn.classList.contains('active')).toBe(true);
    expect(toggleBtn.textContent).toContain('AuraCSS: ON');

    toggleBtn.click();
    expect(toggleBtn.classList.contains('active')).toBe(false);
    expect(toggleBtn.textContent).toContain('AuraCSS: OFF');
  });

  it('toggles AuraCSS ON and OFF via Alt+A keyboard shortcut', () => {
    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    const toggleBtn = shadow?.querySelector('.auracss-toggle-btn') as HTMLButtonElement;
    expect(toggleBtn.textContent).toContain('AuraCSS: OFF');

    // Press Alt+A to activate
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', altKey: true, bubbles: true, cancelable: true }));
    expect(toggleBtn.classList.contains('active')).toBe(true);
    expect(toggleBtn.textContent).toContain('AuraCSS: ON');

    // Press Alt+A again to deactivate
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', altKey: true, bubbles: true, cancelable: true }));
    expect(toggleBtn.classList.contains('active')).toBe(false);
    expect(toggleBtn.textContent).toContain('AuraCSS: OFF');
  });

  it('minimizes and expands the controls stack without blocking elements', () => {
    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    const stack = shadow?.querySelector('.auracss-controls-stack');
    const minBtn = shadow?.querySelector('.auracss-min-btn') as HTMLButtonElement;
    const badge = shadow?.querySelector('.auracss-min-badge') as HTMLButtonElement;
    expect(stack).not.toBeNull();
    expect(minBtn).not.toBeNull();
    expect(badge).not.toBeNull();

    minBtn.click();
    expect(stack?.classList.contains('minimized')).toBe(true);

    badge.click();
    expect(stack?.classList.contains('minimized')).toBe(false);
  });

  it('locks element on click when active; re-clicking keeps it locked; unlocks via Escape or Ctrl+click', async () => {
    app.activate();

    const target = document.createElement('button');
    target.id = 'hero-btn';
    document.body.appendChild(target);

    // First click locks
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    const ring = shadow?.querySelector('.auracss-ring') as HTMLElement;
    expect(ring.classList.contains('locked')).toBe(true);

    // Re-clicking the same element keeps it locked (no accidental deselect)
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(ring.classList.contains('locked')).toBe(true);

    // Ctrl+click unlocks
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true }));
    expect(ring.style.display).toBe('none');

    // Lock again, then Escape unlocks
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    expect(ring.classList.contains('locked')).toBe(true);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(ring.style.display).toBe('none');
  });

  it('handles Hold to Compare via Spacebar', async () => {
    app.activate();

    const target = document.createElement('button');
    target.id = 'compare-btn';
    target.style.color = 'rgb(0, 0, 0)';
    document.body.appendChild(target);

    // Lock button
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    const firstPreset = shadow?.querySelector('.auracss-preset-card') as HTMLElement;
    firstPreset.click();

    expect(target.style.color).not.toBe('rgb(0, 0, 0)');
    const modifiedColor = target.style.color;

    // Press Spacebar down -> reverts to original
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true, cancelable: true }));
    expect(target.style.color).toBe('rgb(0, 0, 0)');

    // Release Spacebar -> restores modified color
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'Space', bubbles: true, cancelable: true }));
    expect(target.style.color).toBe(modifiedColor);
  });

  it('supports undoing applied preset with Ctrl+Z', async () => {
    app.activate();

    const target = document.createElement('button');
    target.style.backgroundColor = 'rgb(0, 0, 0)';
    document.body.appendChild(target);

    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    const firstPreset = shadow?.querySelector('.auracss-preset-card') as HTMLElement;
    firstPreset.click();

    expect(target.style.backgroundColor).not.toBe('rgb(0, 0, 0)');

    // Press Ctrl+Z -> undoes preset
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true, cancelable: true }));
    expect(target.style.backgroundColor).toBe('rgb(0, 0, 0)');
  });

  it('does not increment export count when clicking the same preset repeatedly', async () => {
    app.activate();

    const target = document.createElement('button');
    document.body.appendChild(target);

    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    const cards = shadow?.querySelectorAll('.auracss-preset-card');
    const firstPreset = cards?.[0] as HTMLElement;
    const exportBtn = shadow?.querySelectorAll('.auracss-toggle-btn')[1] as HTMLElement;

    // First click -> Export (1)
    firstPreset.click();
    expect(exportBtn.textContent).toBe('Export (1)');

    // Re-clicking the active preset -> Deselects, reverting element to original -> Export (0)
    firstPreset.click();
    expect(exportBtn.textContent).toBe('Export (0)');

    // Re-clicking again -> Re-selects -> Export (1)
    firstPreset.click();
    expect(exportBtn.textContent).toBe('Export (1)');

    // Clicking a different preset on the same button -> unique element count is still 1!
    const secondPreset = cards?.[1] as HTMLElement;
    secondPreset.click();
    expect(exportBtn.textContent).toBe('Export (1)');
  });

  it('immediately reverts element to original style via Revert button or Alt+R', async () => {
    app.activate();

    const target = document.createElement('button');
    target.style.cssText = 'color: rgb(10, 10, 10);';
    document.body.appendChild(target);

    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    const firstPreset = shadow?.querySelector('.auracss-preset-card') as HTMLElement;
    const exportBtn = shadow?.querySelectorAll('.auracss-toggle-btn')[1] as HTMLElement;

    // Apply preset
    firstPreset.click();
    expect(target.style.color).not.toBe('rgb(10, 10, 10)');
    expect(exportBtn.textContent).toBe('Export (1)');

    // Revert button is rendered in the dock
    const revertBtn = shadow?.querySelector('.auracss-preset-reset') as HTMLButtonElement;
    expect(revertBtn).not.toBeNull();

    // 1-click revert
    revertBtn.click();
    expect(target.style.color).toBe('rgb(10, 10, 10)');
    expect(exportBtn.textContent).toBe('Export (0)');

    // Re-apply and test Alt+R hotkey
    const newCards = shadow?.querySelectorAll('.auracss-preset-card');
    (newCards?.[0] as HTMLElement).click();
    expect(exportBtn.textContent).toBe('Export (1)');

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', altKey: true, bubbles: true, cancelable: true }));
    expect(target.style.color).toBe('rgb(10, 10, 10)');
    expect(exportBtn.textContent).toBe('Export (0)');
  });

  it('has removed redundant dock prompt area in favor of direct agent harness bridge styling', async () => {
    app.activate();

    const target = document.createElement('button');
    target.id = 'prompt-target';
    document.body.appendChild(target);

    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    const promptInput = shadow?.querySelector('.auracss-prompt-input');
    const promptForm = shadow?.querySelector('.auracss-prompt-form');
    // Prompt area is cleanly removed from dock toolbar
    expect(promptInput).toBeNull();
    expect(promptForm).toBeNull();

    // Verify bridge live styling via applyPreset works seamlessly on locked element
    (app as unknown as { applyPreset: (el: HTMLElement, p: unknown) => void }).applyPreset(target, {
      id: 'bridge-style-test',
      name: 'Agent Crimson Glow',
      description: 'Streamed live from Antigravity agent',
      cssText: 'background-color: #ef4444; border-radius: 9999px;',
      tailwindClasses: 'bg-red-500 rounded-full',
    });

    expect(target.style.borderRadius).toBe('9999px');
    expect(target.style.backgroundColor).toMatch(/#ef4444|rgb\(239, 68, 68\)/);

    const exportBtn = shadow?.querySelectorAll('.auracss-toggle-btn')[1] as HTMLElement;
    expect(exportBtn.textContent).toBe('Export (1)');
  });

  it('toggles typography & font popover and applies font options to locked element', async () => {
    app.activate();

    const target = document.createElement('button');
    document.body.appendChild(target);

    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    const paletteBtn = shadow?.querySelector('.auracss-dock-palette-btn') as HTMLButtonElement;
    const popover = shadow?.querySelector('.auracss-palette-popover') as HTMLElement;
    expect(paletteBtn).not.toBeNull();
    expect(popover).not.toBeNull();

    // Toggle popover open
    paletteBtn.click();
    expect(popover.classList.contains('visible')).toBe(true);

    // 1. Fonts (Font Family) - 7 curated families
    const fontPills = popover.querySelectorAll('.auracss-font-pill');
    expect(fontPills.length).toBe(7);
    (fontPills[2] as HTMLButtonElement).click(); // Modern Mono
    expect(target.style.fontFamily).toContain('monospace');

    // 2. Font Sizes (6 sizes)
    const sizePills = popover.querySelectorAll('.auracss-size-pill');
    expect(sizePills.length).toBe(6);
    (sizePills[3] as HTMLButtonElement).click(); // LG (18px)
    expect(target.style.fontSize).toBe('18px');

    // 3. Font Colors (9 colors)
    const swatches = popover.querySelectorAll('.auracss-font-color-btn');
    expect(swatches.length).toBe(9);
    (swatches[3] as HTMLButtonElement).click(); // Sky Cyan (#38bdf8)
    expect(target.style.color).toMatch(/#38bdf8|rgb\(56, 189, 248\)/);

    // 4. Seven sections: Family, Size, Color, Weight, Tracking, Leading, Align
    const sections = popover.querySelectorAll('.auracss-palette-section');
    expect(sections.length).toBe(7);

    // Section 4: Font Style & Weight (9 items)
    const stylePills = sections[3]!.querySelectorAll('.auracss-style-pill');
    expect(stylePills.length).toBe(9);
    (stylePills[3] as HTMLButtonElement).click(); // Bold (700)
    expect(target.style.fontWeight).toBe('700');

    // Section 5: Letter Spacing (Tracking) (5 items)
    const trackingPills = sections[4]!.querySelectorAll('.auracss-style-pill');
    expect(trackingPills.length).toBe(5);
    (trackingPills[3] as HTMLButtonElement).click(); // Wide (0.05em)
    expect(target.style.letterSpacing).toBe('0.05em');

    // Section 6: Line Height (Leading) (4 items)
    const leadingPills = sections[5]!.querySelectorAll('.auracss-style-pill');
    expect(leadingPills.length).toBe(4);
    (leadingPills[3] as HTMLButtonElement).click(); // Relaxed (1.75)
    expect(target.style.lineHeight).toBe('1.75');

    // Section 7: Text Alignment (4 items)
    const alignPills = sections[6]!.querySelectorAll('.auracss-style-pill');
    expect(alignPills.length).toBe(4);
    (alignPills[1] as HTMLButtonElement).click(); // Center
    expect(target.style.textAlign).toBe('center');

    // 8. Revert button undoes all typography modifications back to baseline
    const revertBtn = popover.querySelector('.auracss-palette-revert') as HTMLButtonElement;
    expect(revertBtn).not.toBeNull();
    revertBtn.click();
    expect(target.style.letterSpacing).toBe('');
    expect(target.style.lineHeight).toBe('');
    expect(target.style.textAlign).toBe('');

    const exportBtn = shadow?.querySelectorAll('.auracss-toggle-btn')[1] as HTMLElement;
    expect(exportBtn.textContent).toBe('Export (1)');

    // Verify that manual typography tweaks did NOT pollute saved prompted styles
    const savedBtn = shadow?.querySelector('.auracss-saved-styles-btn') as HTMLButtonElement;
    expect(savedBtn).not.toBeNull();
    savedBtn.click();

    const savedPopover = shadow?.querySelector('.auracss-saved-popover') as HTMLElement;
    expect(savedPopover.classList.contains('visible')).toBe(true);
    const savedCards = savedPopover.querySelectorAll('.auracss-saved-card');
    expect(savedCards.length).toBe(0); // Zero prompt results saved for manual typography tweaks!
    const emptyNotice = savedPopover.querySelector('.auracss-saved-empty');
    expect(emptyNotice).not.toBeNull();
  });
});
