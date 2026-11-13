import type { StyleCommand } from './types';
import { formatCssDiff } from './ledger-formatters';

export function syncCommittedStyles(cssText: string): void {
  if (typeof document === 'undefined') return;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('auracss_committed_css', cssText);
    }
  } catch {}

  // 1. If any <link> to auracss-mutations.css exists, bust cache with timestamp
  const links = document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]');
  links.forEach((link) => {
    if (link.href && link.href.includes('auracss-mutations.css')) {
      const base = link.href.split('?')[0];
      link.href = `${base}?t=${Date.now()}`;
    }
  });

  // 2. Ensure live <style id="auracss-committed-mutations"> has latest CSS rules
  let styleEl = document.getElementById('auracss-committed-mutations') as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'auracss-committed-mutations';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = cssText;
}

export async function commitLedgerToWorkspace(
  commands: readonly StyleCommand[],
  commitBtn: HTMLButtonElement | null,
  subtitleEl: HTMLSpanElement | null
): Promise<boolean> {
  if (!commitBtn) return false;
  if (commands.length === 0) {
    const origHtml = commitBtn.innerHTML;
    commitBtn.innerHTML = '<span>⚠️</span><span>No changes to commit</span>';
    setTimeout(() => { if (commitBtn) commitBtn.innerHTML = origHtml; }, 1500);
    return false;
  }

  const origHtml = commitBtn.innerHTML;
  commitBtn.disabled = true;
  commitBtn.innerHTML = '<span>⏳</span><span>Committing...</span>';

  const cssContent = formatCssDiff(commands);
  syncCommittedStyles(cssContent);

  const candidates = ['http://127.0.0.1:4999', 'http://localhost:4999'];
  for (const base of candidates) {
    try {
      const res = await fetch(`${base}/api/commit-to-source`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: 'auracss-mutations.css',
          cssText: cssContent,
        }),
      });

      if (res.ok) {
        const data = (await res.json().catch(() => ({}))) as { filePath?: string };
        commitBtn.innerHTML = '<span>✓</span><span>Committed!</span>';
        if (subtitleEl && data.filePath) {
          const fileName = data.filePath.split(/[\\/]/).pop() || 'auracss-mutations.css';
          subtitleEl.textContent = `Committed to ${fileName} in workspace • Persists on reload`;
        }
        setTimeout(() => {
          if (commitBtn) {
            commitBtn.innerHTML = origHtml;
            commitBtn.disabled = false;
          }
        }, 2000);
        return true;
      }
    } catch {
      // try next candidate
    }
  }

  // If bridge wasn't reachable, styles are still preserved in localStorage and DOM
  commitBtn.innerHTML = '<span>✓</span><span>Saved locally!</span>';
  if (subtitleEl) {
    subtitleEl.textContent = 'Saved to browser storage & DOM • Start bridge to write to workspace file';
  }
  setTimeout(() => {
    if (commitBtn) {
      commitBtn.innerHTML = origHtml;
      commitBtn.disabled = false;
    }
  }, 2500);
  return true;
}

export async function copyLedgerToClipboard(
  btn: HTMLButtonElement,
  textarea: HTMLTextAreaElement
): Promise<void> {
  try {
    await navigator.clipboard.writeText(textarea.value);
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = 'Copy to Clipboard'; }, 1500);
  } catch {
    textarea.select();
    document.execCommand('copy');
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = 'Copy to Clipboard'; }, 1500);
  }
}
