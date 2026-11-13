import type { ElementStrategy, ExtractedTokens, StylePreset } from './types';

export class BadgeStrategy implements ElementStrategy {
  public supports(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    const cl = el.classList;
    const hasBadgeClass = cl.contains('badge') || cl.contains('tag') || cl.contains('chip') || cl.contains('pill') || cl.contains('status');
    const isTagElement = ['span', 'small', 'strong', 'em', 'div'].includes(tag);
    const textLen = (el.textContent || '').trim().length;
    return hasBadgeClass || role === 'status' || (isTagElement && textLen > 0 && textLen <= 28 && el.children.length === 0);
  }

  public generatePresets(_el: HTMLElement, tokens: ExtractedTokens): StylePreset[] {
    const primary = tokens.primaryColor || '#6366f1';
    return [
      {
        id: 'badge-breathing-status',
        name: 'Pulse Status Glow',
        description: 'Atmospheric status chip with breathing emerald perimeter',
        cssText: 'background-color: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 9999px; padding: 3px 10px; font-size: 11.5px; font-weight: 600; display: inline-flex; align-items: center; box-shadow: 0 0 12px rgba(16, 185, 129, 0.25); transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;',
        hoverState: 'transform: translateY(-1px) scale(1.04); filter: brightness(1.12); box-shadow: 0 0 18px rgba(16, 185, 129, 0.4);',
        activeState: 'transform: scale(0.96);',
        tailwindClasses: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
        contrastRating: 'AAA',
        contrastRatio: '7.6:1',
      },
      {
        id: 'badge-frosted-pill',
        name: 'Frosted Glass Chip',
        description: 'Delicate translucent glass surface with micro border',
        cssText: 'background-color: rgba(255, 255, 255, 0.08); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.22); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 9999px; padding: 3px 11px; font-size: 11.5px; font-weight: 500; display: inline-flex; align-items: center; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;',
        hoverState: 'background-color: rgba(255, 255, 255, 0.16); border-color: rgba(255, 255, 255, 0.35);',
        activeState: 'transform: scale(0.96);',
        tailwindClasses: 'inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white border border-white/20 backdrop-blur-md',
        contrastRating: 'AA',
        contrastRatio: '5.2:1',
      },
      {
        id: 'badge-luminous-accent',
        name: 'Luminous Brand Pill',
        description: 'Primary tinted badge with vibrant micro typography',
        cssText: `background-color: ${primary}26; color: #c7d2fe; border: 1px solid ${primary}73; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: inline-flex; align-items: center; box-shadow: 0 0 14px ${primary}4d; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;`,
        hoverState: `box-shadow: 0 0 22px ${primary}8c; filter: brightness(1.1);`,
        activeState: 'transform: scale(0.96);',
        tailwindClasses: 'inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-200 border border-indigo-500/40 shadow-sm',
        contrastRating: 'AAA',
        contrastRatio: '8.4:1',
      },
      {
        id: 'badge-crisp-outline',
        name: 'Crisp Minimal Outline',
        description: 'Subtle slate outline tag with smooth highlight response',
        cssText: 'background-color: transparent; color: #94a3b8; border: 1px solid #475569; border-radius: 9999px; padding: 2px 10px; font-size: 11.5px; font-weight: 500; display: inline-flex; align-items: center; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;',
        hoverState: 'border-color: #94a3b8; color: #f8fafc; background-color: rgba(255, 255, 255, 0.04);',
        activeState: 'transform: scale(0.96);',
        tailwindClasses: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-600 text-slate-400 hover:text-white hover:border-slate-400',
        contrastRating: 'AA',
        contrastRatio: '4.6:1',
      },
    ];
  }
}

export class InputStrategy implements ElementStrategy {
  public supports(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    if (tag === 'textarea' || tag === 'select') return true;
    if (tag === 'input') {
      const type = (el.getAttribute('type') || 'text').toLowerCase();
      return !['button', 'submit', 'reset', 'checkbox', 'radio', 'file', 'hidden'].includes(type);
    }
    return false;
  }

  public generatePresets(_el: HTMLElement, _tokens: ExtractedTokens): StylePreset[] {
    return [
      {
        id: 'input-focus-glow',
        name: 'Dark Focus Glow',
        description: 'Deep slate field with ambient indigo focus bloom',
        cssText: 'background-color: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 8px; padding: 10px 14px; font-size: 14px; outline: none; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3); transition: border-color 0.2s ease, box-shadow 0.2s ease;',
        hoverState: 'border-color: #475569;',
        activeState: 'border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25) !important;',
        tailwindClasses: 'bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white rounded-lg px-3.5 py-2.5 text-sm',
      },
      {
        id: 'input-frosted-glass',
        name: 'Frosted Glass Field',
        description: 'Translucent glass input with delicate backdrop blur',
        cssText: 'background-color: rgba(255, 255, 255, 0.06); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.18); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 8px; padding: 10px 14px; font-size: 14px; outline: none; transition: all 0.2s ease;',
        hoverState: 'background-color: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3);',
        activeState: 'border-color: #38bdf8 !important; box-shadow: 0 0 16px rgba(56, 189, 248, 0.3) !important;',
        tailwindClasses: 'bg-white/5 border border-white/20 text-white backdrop-blur-md rounded-lg px-3.5 py-2.5 text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20',
      },
      {
        id: 'input-pill-search',
        name: 'Pill Search Surface',
        description: 'Full-radius rounded input with clean elevation shadow',
        cssText: 'background-color: #1e293b; color: #f8fafc; border: 1px solid #334155; border-radius: 9999px; padding: 10px 20px; font-size: 13.5px; outline: none; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); transition: all 0.2s ease;',
        hoverState: 'border-color: #64748b;',
        activeState: 'border-color: #818cf8 !important; box-shadow: 0 0 12px rgba(129, 140, 248, 0.25) !important;',
        tailwindClasses: 'bg-slate-800 border border-slate-700 text-white rounded-full px-5 py-2.5 text-sm shadow-md',
      },
      {
        id: 'input-underlined-minimal',
        name: 'Underline Accent Minimal',
        description: 'Borderless field with high-contrast bottom border highlight',
        cssText: 'background-color: transparent; color: #f8fafc; border: none; border-bottom: 2px solid #334155; border-radius: 0px; padding: 8px 4px; font-size: 14px; outline: none; transition: border-color 0.2s ease;',
        hoverState: 'border-bottom-color: #64748b;',
        activeState: 'border-bottom-color: #6366f1 !important;',
        tailwindClasses: 'bg-transparent border-b-2 border-slate-700 text-white px-1 py-2 text-sm focus:border-indigo-500',
      },
    ];
  }
}
