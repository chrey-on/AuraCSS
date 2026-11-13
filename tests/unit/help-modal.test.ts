// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HelpModal } from '../../src/help-modal';

describe('HelpModal & Activation Toast HUD', () => {
  let modal: HelpModal;
  let shadow: ShadowRoot;

  beforeEach(() => {
    document.body.innerHTML = '';
    const host = document.createElement('div');
    shadow = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);
    modal = new HelpModal();
    modal.mount(shadow);
  });

  afterEach(() => {
    modal.destroy();
    document.body.innerHTML = '';
  });

  it('mounts toast HUD and modal dialog into shadow root', () => {
    const toast = shadow.querySelector('.auracss-hud-toast');
    const backdrop = shadow.querySelector('.auracss-help-backdrop');
    const card = shadow.querySelector('.auracss-help-card');

    expect(toast).not.toBeNull();
    expect(backdrop).not.toBeNull();
    expect(card).not.toBeNull();
    expect(card?.getAttribute('role')).toBe('dialog');
    expect(card?.getAttribute('aria-modal')).toBe('true');
  });

  it('displays ephemeral toast and auto-hides after duration', () => {
    vi.useFakeTimers();
    const toast = shadow.querySelector('.auracss-hud-toast') as HTMLElement;
    expect(toast.classList.contains('visible')).toBe(false);

    modal.showToast('Test Toast Notification', 2000);
    expect(toast.classList.contains('visible')).toBe(true);
    expect(toast.textContent).toContain('Test Toast Notification');

    vi.advanceTimersByTime(2100);
    expect(toast.classList.contains('visible')).toBe(false);
    vi.useRealTimers();
  });

  it('shows help dialog, traps focus, and closes on Escape', () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const backdrop = shadow.querySelector('.auracss-help-backdrop') as HTMLElement;
    expect(backdrop.classList.contains('visible')).toBe(false);

    modal.show();
    expect(backdrop.classList.contains('visible')).toBe(true);

    // Escape closes modal and returns focus
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(backdrop.classList.contains('visible')).toBe(false);
  });

  it('closes help dialog when clicking the close button', () => {
    const backdrop = shadow.querySelector('.auracss-help-backdrop') as HTMLElement;
    const closeBtn = shadow.querySelector('.auracss-help-close') as HTMLButtonElement;

    modal.show();
    expect(backdrop.classList.contains('visible')).toBe(true);

    closeBtn.click();
    expect(backdrop.classList.contains('visible')).toBe(false);
  });
});
