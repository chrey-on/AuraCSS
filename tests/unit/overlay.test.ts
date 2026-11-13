// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OverlayManager } from '../../src/overlay';

describe('OverlayManager (Host Isolation & FastDOM Lifecycle)', () => {
  let overlay: OverlayManager;

  beforeEach(() => {
    document.body.innerHTML = '';
    overlay = new OverlayManager();
  });

  afterEach(() => {
    overlay.destroy();
    document.body.innerHTML = '';
  });

  it('mounts #auracss-root with an open Shadow DOM container', () => {
    const shadow = overlay.mount();
    expect(shadow).toBeInstanceOf(ShadowRoot);
    expect(shadow.mode).toBe('open');

    const host = document.getElementById('auracss-root');
    expect(host).not.toBeNull();
    expect(host?.shadowRoot).toBe(shadow);

    const container = overlay.getContainer();
    expect(container).not.toBeNull();
    expect(container?.className).toContain('auracss-container');
  });

  it('is idempotent on duplicate mount calls', () => {
    const shadow1 = overlay.mount();
    const shadow2 = overlay.mount();
    expect(shadow1).toBe(shadow2);
    expect(document.querySelectorAll('#auracss-root').length).toBe(1);
  });

  it('coalesces multiple updateHighlight calls in a single animation frame', async () => {
    overlay.mount();

    const target1 = document.createElement('button');
    target1.className = 'btn-primary';
    document.body.appendChild(target1);

    const target2 = document.createElement('div');
    target2.id = 'card';
    document.body.appendChild(target2);

    overlay.updateHighlight(target1, false);
    overlay.updateHighlight(target2, true);

    // Wait for rAF tick
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = overlay.getShadowRoot();
    const ring = shadow?.querySelector('.auracss-ring') as HTMLElement | null;
    const pill = shadow?.querySelector('.auracss-pill') as HTMLElement | null;

    expect(ring?.style.display).toBe('block');
    expect(ring?.classList.contains('locked')).toBe(true);
    expect(pill?.textContent).toBe('div#card');
  });

  it('defensively handles disconnected or nil targets without throwing', async () => {
    overlay.mount();

    const transientEl = document.createElement('span');
    document.body.appendChild(transientEl);

    overlay.updateHighlight(transientEl, false);
    // Remove element before rAF executes
    transientEl.remove();

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = overlay.getShadowRoot();
    const ring = shadow?.querySelector('.auracss-ring') as HTMLElement | null;
    expect(ring?.style.display).toBe('none');
  });

  it('fully cleans up host and cancels frame on destroy', () => {
    const rafSpy = vi.spyOn(window, 'cancelAnimationFrame');
    overlay.mount();

    const target = document.createElement('button');
    document.body.appendChild(target);
    overlay.updateHighlight(target);

    overlay.destroy();

    expect(rafSpy).toHaveBeenCalled();
    expect(document.getElementById('auracss-root')).toBeNull();
    expect(overlay.getShadowRoot()).toBeNull();
  });

  it('mounts an accessible aria-live region and dispatches announcements', async () => {
    const shadow = overlay.mount();
    const live = shadow.querySelector('.auracss-sr-live');
    expect(live).not.toBeNull();
    expect(live?.getAttribute('aria-live')).toBe('polite');
    expect(live?.getAttribute('aria-atomic')).toBe('true');

    overlay.announce('AuraCSS activated test');
    await new Promise((r) => setTimeout(r, 60));
    expect(live?.textContent).toBe('AuraCSS activated test');
  });
});
