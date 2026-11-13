import type { StyleCommand } from './types';
import { formatCssDiff, formatTailwindExport, formatJsxExport } from './ledger-formatters';
import { MODAL_STYLES } from './ledger-styles';
import { commitLedgerToWorkspace, copyLedgerToClipboard, syncCommittedStyles } from './ledger-actions';

export { formatCssDiff, formatTailwindExport, formatJsxExport };
export { commitLedgerToWorkspace, copyLedgerToClipboard, syncCommittedStyles };

export class ChangeLedgerModal {
  private modalEl: HTMLDivElement | null = null;
  private textAreaEl: HTMLTextAreaElement | null = null;
  private subtitleEl: HTMLSpanElement | null = null;
  private chipsEl: HTMLDivElement | null = null;
  private commitBtn: HTMLButtonElement | null = null;
  private currentMode: 'css' | 'tailwind' | 'jsx' = 'css';
  private commands: readonly StyleCommand[] = [];

  public mount(shadow: ShadowRoot): void {
    if (this.modalEl) return;

    const styleEl = document.createElement('style');
    styleEl.textContent = MODAL_STYLES;
    shadow.appendChild(styleEl);

    const modal = document.createElement('div');
    modal.className = 'auracss-ledger-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'AuraCSS Export Ledger');

    const card = document.createElement('div');
    card.className = 'auracss-ledger-card';

    const header = document.createElement('div');
    header.className = 'auracss-ledger-header';

    const titleGroup = document.createElement('div');
    titleGroup.className = 'auracss-ledger-title-group';

    const title = document.createElement('span');
    title.className = 'auracss-ledger-title';
    title.innerHTML = '✦ AuraCSS Change Ledger';

    const subtitle = document.createElement('span');
    subtitle.className = 'auracss-ledger-subtitle';
    subtitle.textContent = '0 elements modified';
    this.subtitleEl = subtitle;

    titleGroup.append(title, subtitle);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'auracss-ledger-close';
    closeBtn.type = 'button';
    closeBtn.textContent = '✕';
    closeBtn.onclick = () => this.hide();

    header.appendChild(titleGroup);
    header.appendChild(closeBtn);

    const chips = document.createElement('div');
    chips.className = 'auracss-ledger-chips';
    this.chipsEl = chips;

    const tabs = document.createElement('div');
    tabs.className = 'auracss-ledger-tabs';

    const cssTab = document.createElement('button');
    cssTab.className = 'auracss-ledger-tab active';
    cssTab.type = 'button';
    cssTab.textContent = 'CSS Diff';

    const twTab = document.createElement('button');
    twTab.className = 'auracss-ledger-tab';
    twTab.type = 'button';
    twTab.textContent = 'Tailwind';

    const jsxTab = document.createElement('button');
    jsxTab.className = 'auracss-ledger-tab';
    jsxTab.type = 'button';
    jsxTab.textContent = 'JSX Component';

    tabs.append(cssTab, twTab, jsxTab);

    const textarea = document.createElement('textarea');
    textarea.className = 'auracss-ledger-textarea';
    textarea.readOnly = true;

    const actions = document.createElement('div');
    actions.className = 'auracss-ledger-actions';

    const commitBtn = document.createElement('button');
    commitBtn.className = 'auracss-ledger-commit';
    commitBtn.type = 'button';
    commitBtn.innerHTML = '<span>✦</span><span>Commit to Workspace</span>';
    commitBtn.onclick = () => this.handleCommit();
    this.commitBtn = commitBtn;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'auracss-ledger-copy';
    copyBtn.type = 'button';
    copyBtn.textContent = 'Copy to Clipboard';
    copyBtn.onclick = () => copyLedgerToClipboard(copyBtn, textarea);

    actions.append(commitBtn, copyBtn);

    cssTab.onclick = () => {
      this.currentMode = 'css';
      cssTab.classList.add('active');
      twTab.classList.remove('active');
      jsxTab.classList.remove('active');
      this.updateText();
    };

    twTab.onclick = () => {
      this.currentMode = 'tailwind';
      twTab.classList.add('active');
      cssTab.classList.remove('active');
      jsxTab.classList.remove('active');
      this.updateText();
    };

    jsxTab.onclick = () => {
      this.currentMode = 'jsx';
      jsxTab.classList.add('active');
      cssTab.classList.remove('active');
      twTab.classList.remove('active');
      this.updateText();
    };

    card.appendChild(header);
    card.appendChild(chips);
    card.appendChild(tabs);
    card.appendChild(textarea);
    card.appendChild(actions);
    modal.appendChild(card);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.hide();
    });

    shadow.appendChild(modal);
    this.modalEl = modal;
    this.textAreaEl = textarea;
  }

  private handleCommit(): Promise<boolean> {
    return commitLedgerToWorkspace(this.commands, this.commitBtn, this.subtitleEl);
  }

  private updateText(): void {
    if (!this.textAreaEl) return;
    if (this.currentMode === 'css') {
      this.textAreaEl.value = formatCssDiff(this.commands);
    } else if (this.currentMode === 'tailwind') {
      this.textAreaEl.value = formatTailwindExport(this.commands);
    } else {
      this.textAreaEl.value = formatJsxExport(this.commands);
    }
  }

  public show(commands: readonly StyleCommand[]): void {
    if (!this.modalEl || !this.textAreaEl) return;
    this.commands = commands;

    const uniqueSelectors = new Set<string>();
    commands.forEach((c) => uniqueSelectors.add(c.selectorPath));
    const count = uniqueSelectors.size;

    if (this.subtitleEl) {
      this.subtitleEl.textContent = `${count} element${count === 1 ? '' : 's'} modified • Ready to copy, commit, or download`;
    }

    if (this.chipsEl) {
      this.chipsEl.innerHTML = '';
      uniqueSelectors.forEach((sel) => {
        const chip = document.createElement('span');
        chip.className = 'auracss-ledger-chip';
        chip.textContent = sel;
        this.chipsEl?.appendChild(chip);
      });
    }

    this.updateText();
    this.modalEl.classList.add('visible');
  }

  public hide(): void {
    if (this.modalEl) {
      this.modalEl.classList.remove('visible');
    }
  }

  public destroy(): void {
    if (this.modalEl && this.modalEl.parentNode) {
      this.modalEl.parentNode.removeChild(this.modalEl);
    }
    this.modalEl = null;
    this.textAreaEl = null;
    this.subtitleEl = null;
    this.chipsEl = null;
    this.commitBtn = null;
  }
}
