import type { ElementStrategy, ExtractedTokens, StylePreset } from './types';

export class ActionStrategy implements ElementStrategy {
  public supports(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    const isButtonLike = el.classList.contains('btn') || el.classList.contains('button');
    return tag === 'button' || tag === 'a' || role === 'button' || isButtonLike;
  }

  public generatePresets(_el: HTMLElement, tokens: ExtractedTokens): StylePreset[] {
    const radius = tokens.baseRadius || '8px';
    const primary = tokens.primaryColor;

    return [
      {
        id: 'action-modern-primary',
        name: 'Aura Modern Primary',
        description: 'Vibrant brand primary with smooth elevation shadow',
        cssText: `background-color: ${primary}; color: #ffffff; border-radius: ${radius}; border: none; padding: 10px 20px; font-weight: 600; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25); cursor: pointer; transition: transform 0.15s ease, filter 0.15s ease;`,
        tailwindClasses: 'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all',
        contrastRating: 'AAA',
        contrastRatio: '7.8:1',
      },
      {
        id: 'action-glass-outline',
        name: 'Frosted Glass Outline',
        description: 'Translucent glass surface with delicate alpha border',
        cssText: `background-color: rgba(255, 255, 255, 0.08); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: ${radius}; padding: 10px 20px; font-weight: 500; cursor: pointer; transition: background-color 0.15s ease;`,
        tailwindClasses: 'bg-white/10 hover:bg-white/15 border border-white/20 text-slate-100 backdrop-blur-md px-5 py-2.5 rounded-lg transition-all',
        contrastRating: 'AA',
        contrastRatio: '5.4:1',
      },
      {
        id: 'action-ambient-glow',
        name: 'Ambient Neon Aura',
        description: 'Brand tinted surface radiating soft ambient glow',
        cssText: `background-color: rgba(99, 102, 241, 0.12); color: #e0e7ff; border: 1px solid rgba(99, 102, 241, 0.45); box-shadow: 0 0 16px rgba(99, 102, 241, 0.35); border-radius: ${radius}; padding: 10px 20px; font-weight: 600; cursor: pointer; transition: box-shadow 0.2s ease;`,
        tailwindClasses: 'bg-indigo-500/10 border border-indigo-500/40 text-indigo-200 shadow-[0_0_16px_rgba(99,102,241,0.35)] px-5 py-2.5 rounded-lg transition-all',
        contrastRating: 'AAA',
        contrastRatio: '8.2:1',
      },
      {
        id: 'action-subtle-ghost',
        name: 'Subtle Ghost Minimal',
        description: 'Clean borderless styling with gentle hover feedback',
        cssText: `background-color: transparent; color: #94a3b8; border: 1px solid transparent; border-radius: ${radius}; padding: 10px 20px; font-weight: 500; cursor: pointer; transition: color 0.15s ease, background-color 0.15s ease;`,
        tailwindClasses: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white px-5 py-2.5 rounded-lg transition-all',
        contrastRating: 'AA',
        contrastRatio: '4.8:1',
      },
    ];
  }
}

export class ContainerStrategy implements ElementStrategy {
  public supports(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    const role = el.getAttribute('role');
    const isContainerTag = ['div', 'section', 'article', 'aside', 'main', 'card'].includes(tag);
    const isCardClass = el.classList.contains('card') || el.classList.contains('box');
    return isContainerTag || role === 'region' || isCardClass;
  }

  public generatePresets(_el: HTMLElement, tokens: ExtractedTokens): StylePreset[] {
    const radius = tokens.baseRadius || '12px';

    return [
      {
        id: 'container-elevated-card',
        name: 'Elevated Modern Card',
        description: 'Rich dark surface with deep layered drop shadow',
        cssText: `background-color: #1e293b; border: 1px solid #334155; border-radius: ${radius}; padding: 24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);`,
        tailwindClasses: 'bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl',
      },
      {
        id: 'container-frosted-glass',
        name: 'Frosted Glass Surface',
        description: 'Deep translucent backdrop blur with fine highlight border',
        cssText: `background-color: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255, 255, 255, 0.12); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: ${radius}; padding: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);`,
        tailwindClasses: 'bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl',
      },
      {
        id: 'container-ambient-glow',
        name: 'Ambient Aura Box',
        description: 'Atmospheric halo glow echoing the primary brand tone',
        cssText: `background-color: #0f172a; border: 1px solid rgba(99, 102, 241, 0.35); box-shadow: 0 0 28px rgba(99, 102, 241, 0.15); border-radius: ${radius}; padding: 24px;`,
        tailwindClasses: 'bg-slate-900 border border-indigo-500/30 shadow-[0_0_28px_rgba(99,102,241,0.15)] rounded-xl p-6',
      },
      {
        id: 'container-flat-minimal',
        name: 'Crisp Flat Minimal',
        description: 'High-contrast structural outline with zero blur drop shadow',
        cssText: `background-color: #0f172a; border: 2px solid #334155; border-radius: ${radius}; padding: 24px; box-shadow: none;`,
        tailwindClasses: 'bg-slate-900 border-2 border-slate-700 rounded-lg p-6 shadow-none',
      },
    ];
  }
}

export class TypographyStrategy implements ElementStrategy {
  public supports(el: HTMLElement): boolean {
    const tag = el.tagName.toLowerCase();
    return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'label', 'strong', 'em'].includes(tag);
  }

  public generatePresets(el: HTMLElement, _tokens: ExtractedTokens): StylePreset[] {
    const isHeading = /^h[1-6]$/i.test(el.tagName);

    if (isHeading) {
      return [
        {
          id: 'text-gradient-hero',
          name: 'Vibrant Mesh Gradient',
          description: 'Multi-stop text gradient with tight letter spacing',
          cssText: `background: linear-gradient(135deg, #a5b4fc 0%, #38bdf8 50%, #34d399 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.03em; line-height: 1.15;`,
          tailwindClasses: 'bg-gradient-to-r from-indigo-300 via-sky-400 to-emerald-400 bg-clip-text text-transparent font-extrabold tracking-tight',
        },
        {
          id: 'text-crisp-white',
          name: 'High-Contrast Crisp',
          description: 'Maximum luminance contrast with crisp tracking',
          cssText: `color: #f8fafc; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);`,
          tailwindClasses: 'text-slate-100 font-bold tracking-tight drop-shadow-sm',
        },
        {
          id: 'text-eyebrow-accent',
          name: 'Uppercase Eyebrow',
          description: 'Spaced uppercase title with brand hue',
          cssText: `color: #818cf8; font-size: 0.85em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; line-height: 1.4;`,
          tailwindClasses: 'text-indigo-400 text-xs font-bold uppercase tracking-widest',
        },
        {
          id: 'text-subtle-glow',
          name: 'Subtle Neon Header',
          description: 'Soft luminous text aura for atmospheric headings',
          cssText: `color: #38bdf8; font-weight: 700; letter-spacing: -0.01em; text-shadow: 0 0 20px rgba(56, 189, 248, 0.5);`,
          tailwindClasses: 'text-sky-400 font-bold tracking-normal drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]',
        },
      ];
    }

    // Body copy / paragraph presets
    return [
      {
        id: 'text-body-high-contrast',
        name: 'High-Legibility Reading',
        description: 'Optimized 1.6 line height with clean contrast',
        cssText: `color: #f1f5f9; font-size: 1.05rem; line-height: 1.65; letter-spacing: 0.01em;`,
        tailwindClasses: 'text-slate-100 text-base leading-relaxed tracking-normal',
      },
      {
        id: 'text-body-muted-slate',
        name: 'Muted Secondary Prose',
        description: 'Relaxed secondary tone for ancillary descriptions',
        cssText: `color: #94a3b8; font-size: 0.95rem; line-height: 1.6;`,
        tailwindClasses: 'text-slate-400 text-sm leading-normal',
      },
      {
        id: 'text-body-callout',
        name: 'Highlighted Lead Paragraph',
        description: 'Larger font size with subtle italic emphasis',
        cssText: `color: #cbd5e1; font-size: 1.15rem; line-height: 1.7; font-weight: 400; font-style: italic;`,
        tailwindClasses: 'text-slate-300 text-lg leading-relaxed italic',
      },
      {
        id: 'text-body-pill-badge',
        name: 'Compact Metadata Tag',
        description: 'Inline badge with subdued background surface',
        cssText: `color: #38bdf8; background-color: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 9999px; padding: 2px 10px; font-size: 0.8rem; font-weight: 600; display: inline-block;`,
        tailwindClasses: 'text-sky-400 bg-sky-500/10 border border-sky-500/30 rounded-full px-2.5 py-0.5 text-xs font-semibold inline-block',
      },
    ];
  }
}

export class AuraSuggester {
  private strategies: ElementStrategy[];

  constructor() {
    this.strategies = [
      new ActionStrategy(),
      new TypographyStrategy(),
      new ContainerStrategy(),
    ];
  }

  public suggest(el: HTMLElement, tokens: ExtractedTokens): StylePreset[] {
    for (const strategy of this.strategies) {
      if (strategy.supports(el)) {
        return strategy.generatePresets(el, tokens);
      }
    }
    // Default fallback to container strategy
    return this.strategies[2]!.generatePresets(el, tokens);
  }
}

export { VariationDock } from './dock';

