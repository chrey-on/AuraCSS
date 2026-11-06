// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
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
  });
});
