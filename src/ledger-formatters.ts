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
