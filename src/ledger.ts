import type { StyleCommand } from './types';

export function formatCssDiff(commands: readonly StyleCommand[]): string {
  if (commands.length === 0) return '/* No style changes recorded */';

  const seen = new Map<string, string>();
  for (const cmd of commands) {
    seen.set(cmd.selectorPath, cmd.appliedCssText);
  }

  const chunks: string[] = ['/* === AuraCSS Generated CSS Export === */'];
  for (const [selector, css] of seen.entries()) {
    const formattedCss = css
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => `  ${s};`)
      .join('\n');
    chunks.push(`${selector} {\n${formattedCss}\n}`);
  }

  return chunks.join('\n\n');
}

export function formatTailwindExport(commands: readonly StyleCommand[]): string {
  if (commands.length === 0) return '// No Tailwind mutations recorded';

  const seen = new Map<string, string>();
  for (const cmd of commands) {
    seen.set(cmd.selectorPath, cmd.tailwindClasses);
  }

  const chunks: string[] = ['// === AuraCSS Tailwind Mapping ==='];
  for (const [selector, tw] of seen.entries()) {
    chunks.push(`// ${selector}\nclassName="${tw}"`);
  }

  return chunks.join('\n\n');
}

export function formatJsxExport(commands: readonly StyleCommand[]): string {
  if (commands.length === 0) return '// No element mutations recorded';

  const seen = new Map<string, { tw: string; css: string }>();
  for (const cmd of commands) {
    seen.set(cmd.selectorPath, { tw: cmd.tailwindClasses, css: cmd.appliedCssText });
  }

  const chunks: string[] = ['// === AuraCSS JSX / Component Export ==='];
  for (const [selector, item] of seen.entries()) {
    const styleObj = item.css
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const colonIdx = s.indexOf(':');
        if (colonIdx === -1) return null;
        const prop = s.slice(0, colonIdx).trim();
        const val = s.slice(colonIdx + 1).trim();
        const camel = prop.replace(/-([a-z])/g, (_, g) => (g as string).toUpperCase());
        return `    ${camel}: "${val}"`;
      })
      .filter(Boolean)
      .join(',\n');
    chunks.push(`// ${selector}\n<div className="${item.tw}" style={{\n${styleObj}\n}}>...</div>`);
  }

  return chunks.join('\n\n');
}

const MODAL_STYLES = `
.auracss-ledger-modal {
  position: fixed;
  inset: 0;
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 2147483647;
  pointer-events: auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.auracss-ledger-modal.visible { display: flex; }
.auracss-ledger-card {
  width: 90%;
  max-width: 680px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px;
  padding: 22px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #f8fafc;
}
.auracss-ledger-header { display: flex; justify-content: space-between; align-items: flex-start; }
.auracss-ledger-title-group { display: flex; flex-direction: column; gap: 2px; }
.auracss-ledger-title { color: #f8fafc; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
.auracss-ledger-subtitle { color: #94a3b8; font-size: 11.5px; font-weight: 500; }
.auracss-ledger-close { background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; padding: 4px; border-radius: 4px; }
.auracss-ledger-close:hover { color: #f8fafc; background: rgba(255, 255, 255, 0.1); }
.auracss-ledger-chips {
  display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none;
}
.auracss-ledger-chips::-webkit-scrollbar { display: none; }
.auracss-ledger-chip {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 10.5px;
  background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.25);
  padding: 3px 8px; border-radius: 6px; white-space: nowrap; flex-shrink: 0;
}
.auracss-ledger-tabs { display: flex; gap: 8px; }
.auracss-ledger-tab {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.auracss-ledger-tab:hover { background: rgba(255, 255, 255, 0.1); color: #f8fafc; }
.auracss-ledger-tab.active { background: #38bdf8; color: #0f172a; font-weight: 700; border-color: #38bdf8; }
.auracss-ledger-textarea {
  width: 100%;
  height: 220px;
  box-sizing: border-box;
  background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #38bdf8;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 12px;
  line-height: 1.5;
  padding: 14px;
  resize: vertical;
  outline: none;
}
.auracss-ledger-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 4px; }
.auracss-ledger-download {
  background: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.auracss-ledger-download:hover { background: rgba(255, 255, 255, 0.16); border-color: rgba(255, 255, 255, 0.3); }
.auracss-ledger-copy {
  background: #4f46e5;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.auracss-ledger-copy:hover { background: #6366f1; transform: translateY(-1px); }
`;

export class ChangeLedgerModal {
  private modalEl: HTMLDivElement | null = null;
  private textAreaEl: HTMLTextAreaElement | null = null;
  private subtitleEl: HTMLSpanElement | null = null;
  private chipsEl: HTMLDivElement | null = null;
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

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'auracss-ledger-download';
    downloadBtn.type = 'button';
    downloadBtn.textContent = '📥 Download .css';
    downloadBtn.onclick = () => {
      try {
        const content = formatCssDiff(this.commands);
        const blob = new Blob([content], { type: 'text/css;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `auracss-changes-${Date.now()}.css`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch { /* ignore */ }
    };

    const copyBtn = document.createElement('button');
    copyBtn.className = 'auracss-ledger-copy';
    copyBtn.type = 'button';
    copyBtn.textContent = 'Copy to Clipboard';

    actions.append(downloadBtn, copyBtn);

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

    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(textarea.value);
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy to Clipboard'; }, 1500);
      } catch {
        textarea.select();
        document.execCommand('copy');
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy to Clipboard'; }, 1500);
      }
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
      this.subtitleEl.textContent = `${count} element${count === 1 ? '' : 's'} modified • Ready to copy or download`;
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
  }
}
