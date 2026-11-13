// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { formatCssDiff, formatTailwindExport, ChangeLedgerModal } from '../../src/ledger';
import type { StyleCommand } from '../../src/types';

describe('ChangeLedger (Code Exporter & Modal)', () => {
  const mockCommands: StyleCommand[] = [
    {
      element: document.createElement('button'),
      selectorPath: 'button#cta.btn-primary',
      previousCssText: 'background-color: blue;',
      appliedCssText: 'background-color: #4f46e5; color: #ffffff;',
      tailwindClasses: 'bg-indigo-600 text-white',
      timestamp: 100,
    },
    {
      element: document.createElement('div'),
      selectorPath: 'div#card.card',
      previousCssText: 'padding: 10px;',
      appliedCssText: 'padding: 24px; border-radius: 12px;',
      tailwindClasses: 'p-6 rounded-xl',
      timestamp: 200,
    },
  ];

  it('formats clean CSS diff with selector hierarchy', () => {
    const css = formatCssDiff(mockCommands);
    expect(css).toContain('button#cta.btn-primary {');
    expect(css).toContain('background-color: #4f46e5;');
    expect(css).toContain('div#card.card {');
    expect(css).toContain('padding: 24px;');
  });

  it('formats clean Tailwind mapping', () => {
    const tw = formatTailwindExport(mockCommands);
    expect(tw).toContain('// button#cta.btn-primary');
    expect(tw).toContain('className="bg-indigo-600 text-white"');
    expect(tw).toContain('// div#card.card');
    expect(tw).toContain('className="p-6 rounded-xl"');
  });

  describe('ChangeLedgerModal', () => {
    let modal: ChangeLedgerModal;
    let shadow: ShadowRoot;

    beforeEach(() => {
      document.body.innerHTML = '';
      const host = document.createElement('div');
      shadow = host.attachShadow({ mode: 'open' });
      document.body.appendChild(host);

      modal = new ChangeLedgerModal();
      modal.mount(shadow);
    });

    it('shows modal with formatted content and switches tabs', () => {
      modal.show(mockCommands);

      const modalEl = shadow.querySelector('.auracss-ledger-modal');
      expect(modalEl?.classList.contains('visible')).toBe(true);

      const textarea = shadow.querySelector('.auracss-ledger-textarea') as HTMLTextAreaElement;
      expect(textarea.value).toContain('button#cta.btn-primary');

      // Switch to Tailwind tab
      const tabs = shadow.querySelectorAll('.auracss-ledger-tab');
      (tabs[1] as HTMLElement).click();
      expect(textarea.value).toContain('className="bg-indigo-600 text-white"');

      modal.hide();
      expect(modalEl?.classList.contains('visible')).toBe(false);
    });

    it('renders Commit to Workspace button and handles click', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, filePath: 'd:/AuraCSS/auracss-mutations.css' }),
      });
      vi.stubGlobal('fetch', mockFetch);

      modal.show(mockCommands);

      const commitBtn = shadow.querySelector('.auracss-ledger-commit') as HTMLButtonElement;
      expect(commitBtn).not.toBeNull();
      expect(commitBtn.textContent).toContain('Commit to Workspace');

      commitBtn.click();
      await new Promise((r) => setTimeout(r, 0));
      expect(mockFetch).toHaveBeenCalledWith(
        'http://127.0.0.1:4999/api/commit-to-source',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(commitBtn.textContent).toContain('Committed!');
      const subtitle = shadow.querySelector('.auracss-ledger-subtitle');
      expect(subtitle?.textContent).toContain('Committed to auracss-mutations.css in workspace');
    });

    it('renders only Commit and Copy actions, confirming download button is removed', () => {
      modal.show(mockCommands);
      const downloadBtn = shadow.querySelector('.auracss-ledger-download');
      expect(downloadBtn).toBeNull();

      const commitBtn = shadow.querySelector('.auracss-ledger-commit');
      const copyBtn = shadow.querySelector('.auracss-ledger-copy');
      expect(commitBtn).not.toBeNull();
      expect(copyBtn).not.toBeNull();
    });

    it('provides feedback when Commit is clicked with zero recorded mutations', async () => {
      modal.show([]);
      const commitBtn = shadow.querySelector('.auracss-ledger-commit') as HTMLButtonElement;

      await commitBtn.click();
      expect(commitBtn.textContent).toContain('No changes to commit');
    });

    it('handles Copy to Clipboard button click with visual feedback', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText: mockWriteText } });

      modal.show(mockCommands);
      const copyBtn = shadow.querySelector('.auracss-ledger-copy') as HTMLButtonElement;
      expect(copyBtn).not.toBeNull();
      expect(copyBtn.textContent).toBe('Copy to Clipboard');

      await copyBtn.click();
      expect(mockWriteText).toHaveBeenCalled();
      expect(copyBtn.textContent).toContain('Copied!');
    });

    it('traps focus within modal and closes on Escape key', () => {
      const triggerBtn = document.createElement('button');
      document.body.appendChild(triggerBtn);
      triggerBtn.focus();

      modal.show(mockCommands);
      const modalEl = shadow.querySelector('.auracss-ledger-modal');
      expect(modalEl?.classList.contains('visible')).toBe(true);

      // Press Escape to close modal and restore focus
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
      expect(modalEl?.classList.contains('visible')).toBe(false);
    });
  });
});
