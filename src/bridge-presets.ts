import type { StylePreset } from './types';

export function getAiVariationCyclePresets(cycleIndex: number, isAction: boolean): StylePreset[] {
  const cycle = Math.abs(Number(cycleIndex) || 0) % 3;

  // Set 0: Neo-Digital Glass & Volumetric Elevation
  const set0: StylePreset[] = [
    {
      id: `ai-elevated-${Date.now()}`,
      name: 'AI Modern Elevated Solid',
      description: 'Rich opaque indigo surface with deep drop shadow',
      cssText: isAction
        ? 'background: #4f46e5; color: #ffffff; border: none; border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); cursor: pointer;'
        : 'background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);',
      tailwindClasses: isAction
        ? 'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/30'
        : 'bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl',
    },
    {
      id: `ai-glass-${Date.now()}`,
      name: 'AI Frosted Glassmorphism',
      description: 'Multi-layer frosted backdrop blur with crisp optical specular edge',
      cssText: isAction
        ? 'background: rgba(255, 255, 255, 0.1); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.25); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius: 8px; padding: 10px 22px; font-weight: 600; cursor: pointer;'
        : 'background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.15); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 14px; padding: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);',
      tailwindClasses: isAction
        ? 'bg-white/10 hover:bg-white/15 border border-white/25 text-white backdrop-blur-md px-5 py-2.5 rounded-lg font-semibold'
        : 'bg-slate-900/70 border border-white/15 backdrop-blur-xl rounded-2xl p-6 shadow-2xl',
    },
    {
      id: `ai-neon-${Date.now()}`,
      name: 'AI Radiant Cyan Halo',
      description: 'Dark space surface wrapped in luminous cyan glow',
      cssText: isAction
        ? 'background: #0f172a; color: #38bdf8; border: 1px solid #38bdf8; border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 0 16px rgba(56, 189, 248, 0.5); cursor: pointer;'
        : 'background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.5); border-radius: 12px; padding: 24px; box-shadow: 0 0 28px rgba(56, 189, 248, 0.2);',
      tailwindClasses: isAction
        ? 'bg-slate-900 border border-sky-400 text-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.5)] px-5 py-2.5 rounded-lg font-semibold'
        : 'bg-slate-900 border border-sky-400/50 shadow-[0_0_28px_rgba(56,189,248,0.2)] rounded-xl p-6',
    },
    {
      id: `ai-brutalist-${Date.now()}`,
      name: 'AI Surgical Brutalist',
      description: 'Razor-sharp geometry with high-contrast type and zero blur',
      cssText: isAction
        ? 'background: #ffffff; color: #0f172a; border: 2px solid #0f172a; border-radius: 0px; padding: 10px 22px; font-weight: 700; cursor: pointer;'
        : 'background: #020617; border: 2px solid #334155; border-radius: 0px; padding: 24px;',
      tailwindClasses: isAction
        ? 'bg-white text-slate-900 border-2 border-slate-900 rounded-none px-5 py-2.5 font-bold'
        : 'bg-slate-950 border-2 border-slate-700 rounded-none p-6',
    },
  ];

  // Set 1: Organic Sunset & Tactile Claymorphism
  const set1: StylePreset[] = [
    {
      id: `ai-sunset-${Date.now()}`,
      name: 'AI Warm Sunset Flame',
      description: 'Radiant warm amber to rose gradient with ambient sunset glow',
      cssText: isAction
        ? 'background: linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%); color: #ffffff; border: none; border-radius: 12px; padding: 12px 24px; font-weight: 600; box-shadow: 0 6px 18px rgba(244, 63, 94, 0.35); cursor: pointer;'
        : 'background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(244, 63, 94, 0.15) 100%); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 16px; padding: 24px; box-shadow: 0 12px 30px rgba(244, 63, 94, 0.15);',
      tailwindClasses: isAction
        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-rose-500/30'
        : 'bg-gradient-to-br from-amber-500/10 to-rose-500/10 border border-rose-500/30 rounded-2xl p-6',
    },
    {
      id: `ai-clay-${Date.now()}`,
      name: 'AI Soft Tactile Claymorphic',
      description: 'Soft tactile surface with dual offset inner & outer depth highlights',
      cssText: isAction
        ? 'background: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 9999px; padding: 12px 26px; font-weight: 700; box-shadow: 6px 6px 12px #94a3b8, -4px -4px 10px #ffffff; cursor: pointer;'
        : 'background: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 20px; padding: 26px; box-shadow: 8px 8px 16px #94a3b8, -6px -6px 14px #ffffff;',
      tailwindClasses: isAction
        ? 'bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-full shadow-[6px_6px_12px_#94a3b8,-4px_-4px_10px_#ffffff]'
        : 'bg-slate-200 text-slate-800 rounded-3xl p-6 shadow-[8px_8px_16px_#94a3b8,-6px_-6px_14px_#ffffff]',
    },
    {
      id: `ai-crimson-${Date.now()}`,
      name: 'AI Crimson Velvet Pulse',
      description: 'Vibrant ruby red surface with radiant crimson halo',
      cssText: isAction
        ? 'background: #dc2626; color: #ffffff; border: 1px solid #ef4444; border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 0 20px rgba(220, 38, 38, 0.45); cursor: pointer;'
        : 'background: #1a0505; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 14px; padding: 24px; box-shadow: 0 0 30px rgba(220, 38, 38, 0.25);',
      tailwindClasses: isAction
        ? 'bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.45)]'
        : 'bg-red-950/40 border border-red-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(220,38,38,0.25)]',
    },
    {
      id: `ai-wire-${Date.now()}`,
      name: 'AI Minimal Neutral Wire',
      description: 'Understated crisp wireframe outline with spacious balance',
      cssText: isAction
        ? 'background: transparent; color: #f8fafc; border: 2px solid #94a3b8; border-radius: 6px; padding: 10px 22px; font-weight: 600; cursor: pointer;'
        : 'background: #020617; border: 1px solid #475569; border-radius: 8px; padding: 24px;',
      tailwindClasses: isAction
        ? 'bg-transparent border-2 border-slate-400 text-white px-5 py-2.5 rounded-md font-semibold'
        : 'bg-slate-950 border border-slate-600 rounded-lg p-6',
    },
  ];

  // Set 2: Cyberpunk & High-Tech Dark
  const set2: StylePreset[] = [
    {
      id: `ai-emerald-${Date.now()}`,
      name: 'AI Cyberpunk Emerald Matrix',
      description: 'High-contrast neon emerald borders against deep terminal dark',
      cssText: isAction
        ? 'background: #022c22; color: #34d399; border: 2px solid #10b981; border-radius: 4px; padding: 10px 22px; font-weight: 700; box-shadow: 0 0 18px rgba(16, 185, 129, 0.4); cursor: pointer;'
        : 'background: #021a14; border: 2px solid #10b981; border-radius: 8px; padding: 24px; box-shadow: 0 0 32px rgba(16, 185, 129, 0.25);',
      tailwindClasses: isAction
        ? 'bg-emerald-950 border-2 border-emerald-500 text-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.4)] px-5 py-2.5 rounded font-bold'
        : 'bg-emerald-950/80 border-2 border-emerald-500 rounded-lg p-6 shadow-[0_0_32px_rgba(16,185,129,0.25)]',
    },
    {
      id: `ai-obsidian-${Date.now()}`,
      name: 'AI Obsidian Glass Void',
      description: 'Ultra-dark translucent obsidian glass with purple specular rim',
      cssText: isAction
        ? 'background: rgba(2, 6, 23, 0.85); color: #e2e8f0; border: 1px solid #a855f7; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6); cursor: pointer;'
        : 'background: rgba(2, 6, 23, 0.85); border: 1px solid rgba(168, 85, 247, 0.4); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-radius: 16px; padding: 24px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);',
      tailwindClasses: isAction
        ? 'bg-slate-950/85 border border-purple-500 text-slate-200 backdrop-blur-xl px-5 py-2.5 rounded-lg font-semibold shadow-2xl'
        : 'bg-slate-950/85 border border-purple-500/40 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl',
    },
    {
      id: `ai-violet-${Date.now()}`,
      name: 'AI Electric Violet Gradient',
      description: 'Dynamic violet to fuchsia gradient with luminous electric halo',
      cssText: isAction
        ? 'background: linear-gradient(135deg, #7c3aed 0%, #d946ef 100%); color: #ffffff; border: none; border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 4px 18px rgba(217, 70, 239, 0.4); cursor: pointer;'
        : 'background: linear-gradient(135deg, #2e1065 0%, #4a044e 100%); border: 1px solid rgba(217, 70, 239, 0.35); border-radius: 12px; padding: 24px;',
      tailwindClasses: isAction
        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-fuchsia-500/30'
        : 'bg-gradient-to-br from-violet-950 to-fuchsia-950 border border-fuchsia-500/30 rounded-xl p-6',
    },
    {
      id: `ai-hyper-${Date.now()}`,
      name: 'AI Hyper-Dense Industrial Pill',
      description: 'Compact capsule form factor with crisp contrast and tracked typography',
      cssText: isAction
        ? 'background: #0f172a; color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 9999px; padding: 8px 20px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer;'
        : 'background: #0f172a; border: 2px solid #e2e8f0; border-radius: 9999px; padding: 16px 28px;',
      tailwindClasses: isAction
        ? 'bg-slate-900 border-2 border-slate-200 text-white px-5 py-2 rounded-full font-bold uppercase tracking-wider text-xs'
        : 'bg-slate-900 border-2 border-slate-200 rounded-full p-6',
    },
  ];

  const allSets = [set0, set1, set2];
  return allSets[cycle] ?? set0;
}
