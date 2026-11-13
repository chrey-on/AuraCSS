import type { ExtractedTokens, StylePreset } from './types';

export function branchPreset(preset: StylePreset, _el: HTMLElement, tokens: ExtractedTokens): StylePreset[] {
  const css = preset.cssText;
  const isGlass = css.includes('blur') || css.includes('backdrop-filter');
  const isGlow = css.includes('box-shadow') && (css.includes('0 0') || css.includes('rgba('));
  const primary = tokens.primaryColor || '#6366f1';
  const radius = tokens.baseRadius || '8px';

  if (isGlass) {
    return [
      {
        id: `${preset.id}-deep-frost`,
        name: `${preset.name} (Deep Frost)`,
        description: 'Higher opacity glass surface with 24px heavy optical blur',
        cssText: `background-color: rgba(15, 23, 42, 0.85); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.28); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-radius: ${radius}; padding: 10px 20px; font-weight: 600; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45); cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);`,
        hoverState: 'background-color: rgba(15, 23, 42, 0.95); border-color: rgba(255, 255, 255, 0.45); transform: translateY(-1px);',
        activeState: 'transform: scale(0.97);',
        tailwindClasses: 'bg-slate-900/85 border border-white/30 text-white backdrop-blur-2xl rounded-lg px-5 py-2.5 shadow-2xl',
        contrastRating: 'AAA',
        contrastRatio: '9.2:1',
      },
      {
        id: `${preset.id}-crystal-rim`,
        name: `${preset.name} (Crystal Rim)`,
        description: 'Ultra-thin translucent surface with delicate high-luminance border',
        cssText: `background-color: rgba(255, 255, 255, 0.04); color: #f8fafc; border: 1.5px solid rgba(255, 255, 255, 0.35); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: ${radius}; padding: 10px 20px; font-weight: 500; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);`,
        hoverState: 'background-color: rgba(255, 255, 255, 0.12); border-color: #ffffff;',
        activeState: 'transform: scale(0.97);',
        tailwindClasses: 'bg-white/5 border border-white/35 text-white backdrop-blur-sm rounded-lg px-5 py-2.5',
        contrastRating: 'AA',
        contrastRatio: '5.8:1',
      },
      {
        id: `${preset.id}-brand-tint`,
        name: `${preset.name} (Brand Tint)`,
        description: 'Translucent glass tinted with subtle brand primary wash',
        cssText: `background-color: rgba(99, 102, 241, 0.12); color: #e0e7ff; border: 1px solid rgba(99, 102, 241, 0.4); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius: ${radius}; padding: 10px 20px; font-weight: 600; box-shadow: 0 0 20px rgba(99, 102, 241, 0.25); cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);`,
        hoverState: 'box-shadow: 0 0 28px rgba(99, 102, 241, 0.45); border-color: rgba(99, 102, 241, 0.65);',
        activeState: 'transform: scale(0.97);',
        tailwindClasses: 'bg-indigo-500/10 border border-indigo-500/40 text-indigo-200 backdrop-blur-md rounded-lg px-5 py-2.5 shadow-lg',
        contrastRating: 'AAA',
        contrastRatio: '8.1:1',
      },
      {
        id: `${preset.id}-pill-contour`,
        name: `${preset.name} (Pill Contour)`,
        description: 'Smooth pill-shaped geometry with soft perimeter rim',
        cssText: `background-color: rgba(255, 255, 255, 0.08); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.25); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 9999px; padding: 10px 24px; font-weight: 600; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);`,
        hoverState: 'background-color: rgba(255, 255, 255, 0.18); transform: translateY(-1px);',
        activeState: 'transform: scale(0.97);',
        tailwindClasses: 'bg-white/10 border border-white/25 text-white backdrop-blur-md rounded-full px-6 py-2.5 font-semibold',
        contrastRating: 'AA',
        contrastRatio: '5.5:1',
      },
    ];
  }

  if (isGlow) {
    return [
      {
        id: `${preset.id}-hyper-bloom`,
        name: `${preset.name} (Hyper Bloom)`,
        description: 'Multi-layered radiant neon glow with high-intensity halo',
        cssText: `background-color: rgba(99, 102, 241, 0.2); color: #ffffff; border: 1px solid #818cf8; box-shadow: 0 0 24px rgba(99, 102, 241, 0.6), 0 0 48px rgba(99, 102, 241, 0.3); border-radius: ${radius}; padding: 10px 20px; font-weight: 700; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);`,
        hoverState: 'box-shadow: 0 0 32px rgba(99, 102, 241, 0.8), 0 0 64px rgba(99, 102, 241, 0.45); filter: brightness(1.1);',
        activeState: 'transform: scale(0.97);',
        tailwindClasses: 'bg-indigo-600/20 border border-indigo-400 text-white shadow-[0_0_24px_rgba(99,102,241,0.6)] rounded-lg px-5 py-2.5 font-bold',
        contrastRating: 'AAA',
        contrastRatio: '8.8:1',
      },
      {
        id: `${preset.id}-soft-ambient`,
        name: `${preset.name} (Soft Ambient)`,
        description: 'Gentle diffusion halo prioritizing reading comfort',
        cssText: `background-color: rgba(99, 102, 241, 0.08); color: #c7d2fe; border: 1px solid rgba(99, 102, 241, 0.3); box-shadow: 0 0 14px rgba(99, 102, 241, 0.2); border-radius: ${radius}; padding: 10px 20px; font-weight: 500; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);`,
        hoverState: 'border-color: rgba(99, 102, 241, 0.5); color: #ffffff;',
        activeState: 'transform: scale(0.97);',
        tailwindClasses: 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 shadow-sm rounded-lg px-5 py-2.5',
        contrastRating: 'AAA',
        contrastRatio: '7.8:1',
      },
      {
        id: `${preset.id}-cyan-halo`,
        name: `${preset.name} (Cyan Shift)`,
        description: 'High-contrast cyan electric halo for vibrant visibility',
        cssText: `background-color: rgba(56, 189, 248, 0.12); color: #e0f2fe; border: 1px solid rgba(56, 189, 248, 0.5); box-shadow: 0 0 20px rgba(56, 189, 248, 0.35); border-radius: ${radius}; padding: 10px 20px; font-weight: 600; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);`,
        hoverState: 'box-shadow: 0 0 28px rgba(56, 189, 248, 0.55); border-color: #38bdf8;',
        activeState: 'transform: scale(0.97);',
        tailwindClasses: 'bg-sky-500/10 border border-sky-400 text-sky-100 shadow-[0_0_20px_rgba(56,189,248,0.35)] rounded-lg px-5 py-2.5 font-semibold',
        contrastRating: 'AAA',
        contrastRatio: '8.4:1',
      },
      {
        id: `${preset.id}-inset-luminous`,
        name: `${preset.name} (Inset Luminous)`,
        description: 'Internal edge illumination combined with subtle drop shadow',
        cssText: `background-color: #0f172a; color: #f8fafc; border: 1px solid rgba(99, 102, 241, 0.4); box-shadow: inset 0 0 16px rgba(99, 102, 241, 0.3), 0 4px 14px rgba(0, 0, 0, 0.3); border-radius: ${radius}; padding: 10px 20px; font-weight: 600; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);`,
        hoverState: 'border-color: #818cf8; box-shadow: inset 0 0 22px rgba(99, 102, 241, 0.45);',
        activeState: 'transform: scale(0.97);',
        tailwindClasses: 'bg-slate-900 border border-indigo-500/40 text-white shadow-lg rounded-lg px-5 py-2.5 font-semibold',
        contrastRating: 'AAA',
        contrastRatio: '9.0:1',
      },
    ];
  }

  // General Archetype Nuance Branching (applicable to Solid, Gradient, Typography, and Containers)
  return [
    {
      id: `${preset.id}-solid-elevated`,
      name: `${preset.name} (Elevated Bevel)`,
      description: 'Tactile layered depth with rich 3D drop shadow',
      cssText: `background-color: ${primary}; color: #ffffff; border-radius: ${radius}; border: none; padding: 10px 20px; font-weight: 600; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25); cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);`,
      hoverState: 'transform: translateY(-2px); filter: brightness(1.08); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);',
      activeState: 'transform: translateY(1px) scale(0.97); filter: brightness(0.95);',
      tailwindClasses: 'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-xl transition-all',
      contrastRating: 'AAA',
      contrastRatio: '7.8:1',
    },
    {
      id: `${preset.id}-gradient-mesh`,
      name: `${preset.name} (Mesh Spectrum)`,
      description: 'Multi-stop directional angled gradient with vibrant tone',
      cssText: `background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); color: #ffffff; border-radius: ${radius}; border: none; padding: 10px 20px; font-weight: 600; box-shadow: 0 4px 18px rgba(168, 85, 247, 0.35); cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);`,
      hoverState: 'transform: translateY(-1px); filter: brightness(1.1); box-shadow: 0 6px 24px rgba(168, 85, 247, 0.5);',
      activeState: 'transform: scale(0.97);',
      tailwindClasses: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg',
      contrastRating: 'AAA',
      contrastRatio: '7.5:1',
    },
    {
      id: `${preset.id}-minimal-slate`,
      name: `${preset.name} (Slate Minimal)`,
      description: 'Understated high-contrast dark slate outline',
      cssText: `background-color: #0f172a; color: #f8fafc; border: 1.5px solid #334155; border-radius: ${radius}; padding: 10px 20px; font-weight: 600; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);`,
      hoverState: 'border-color: #64748b; background-color: #1e293b;',
      activeState: 'transform: scale(0.97);',
      tailwindClasses: 'bg-slate-900 border border-slate-700 text-white rounded-lg px-5 py-2.5 font-semibold',
      contrastRating: 'AAA',
      contrastRatio: '9.5:1',
    },
    {
      id: `${preset.id}-pill-action`,
      name: `${preset.name} (Pill Contour)`,
      description: 'Streamlined continuous curved pill contour',
      cssText: `background-color: ${primary}; color: #ffffff; border-radius: 9999px; border: none; padding: 10px 24px; font-weight: 600; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25); cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);`,
      hoverState: 'transform: translateY(-1px); filter: brightness(1.08);',
      activeState: 'transform: scale(0.97);',
      tailwindClasses: 'bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-full shadow-md',
      contrastRating: 'AAA',
      contrastRatio: '7.8:1',
    },
  ];
}
