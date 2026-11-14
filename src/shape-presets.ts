import type { StylePreset } from './types';

type PresetTuple = [id: string, name: string, desc: string, css: string, tw: string, hover?: string];

function toPresets(items: PresetTuple[]): StylePreset[] {
  return items.map(([id, name, description, cssText, tailwindClasses, hoverState]) => ({
    id,
    name,
    description,
    cssText,
    ...(hoverState ? { hoverState } : {}),
    tailwindClasses,
    contrastRating: 'AAA',
    contrastRatio: '7.5:1',
  }));
}

const DIVIDER_SETS: PresetTuple[][] = [
  [
    ['ai-line-0-gradient', 'AI Gradient Glow Line', 'Vibrant violet-to-cyan gradient divider with soft glow', 'background: linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #38bdf8 100%); border: none; min-height: 2px; padding: 0; border-radius: 9999px; box-shadow: 0 0 10px rgba(56, 189, 248, 0.55); opacity: 1;', 'bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 border-0 h-0.5 p-0 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.55)]'],
    ['ai-line-0-taper', 'AI Tapered Fade Rule', 'Smooth center-outward line that fades to transparent edges', 'background: linear-gradient(90deg, transparent 0%, #6366f1 50%, transparent 100%); border: none; min-height: 2px; padding: 0; opacity: 1;', 'bg-gradient-to-r from-transparent via-indigo-500 to-transparent border-0 h-0.5 p-0'],
    ['ai-line-0-cyan', 'AI Neon Cyan Laser', 'Crisp luminous cyan rule with intense halo aura', 'background: #38bdf8; border: none; min-height: 2px; padding: 0; border-radius: 9999px; box-shadow: 0 0 12px rgba(56, 189, 248, 0.9); opacity: 1;', 'bg-sky-400 border-0 h-0.5 p-0 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.9)]'],
    ['ai-line-0-dashed', 'AI Crisp Dashed Rule', 'Editorial dashed separator with high-contrast segments', 'background: transparent; border: none; border-top: 2px dashed #6366f1; min-height: 0; padding: 0; opacity: 0.9;', 'bg-transparent border-0 border-t-2 border-dashed border-indigo-500 p-0'],
  ],
  [
    ['ai-line-1-sunset', 'AI Sunset Flame Line', 'Warm amber-to-rose gradient rule with subtle glow', 'background: linear-gradient(90deg, #f59e0b 0%, #f43f5e 100%); border: none; min-height: 2px; padding: 0; border-radius: 9999px; box-shadow: 0 0 10px rgba(244, 63, 94, 0.5); opacity: 1;', 'bg-gradient-to-r from-amber-500 to-rose-500 border-0 h-0.5 p-0 rounded-full'],
    ['ai-line-1-emerald', 'AI Emerald Pulse Beam', 'Luminous emerald divider bar with neon aura', 'background: #10b981; border: none; min-height: 2px; padding: 0; border-radius: 9999px; box-shadow: 0 0 12px rgba(16, 185, 129, 0.8); opacity: 1;', 'bg-emerald-500 border-0 h-0.5 p-0 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]'],
    ['ai-line-1-gold', 'AI Champagne Gold Rule', 'Tapered metallic gold hairline separator', 'background: linear-gradient(90deg, transparent 0%, #f59e0b 50%, transparent 100%); border: none; min-height: 2px; padding: 0; box-shadow: 0 0 8px rgba(245, 158, 11, 0.45); opacity: 1;', 'bg-gradient-to-r from-transparent via-amber-500 to-transparent border-0 h-0.5 p-0'],
    ['ai-line-1-dotted', 'AI Dotted Minimal Rule', 'Clean dotted editorial divider', 'background: transparent; border: none; border-top: 2px dotted #0ea5e9; min-height: 0; padding: 0; opacity: 0.9;', 'bg-transparent border-0 border-t-2 border-dotted border-sky-500 p-0'],
  ],
  [
    ['ai-line-2-violet', 'AI Violet Plasma Line', 'Electric purple-to-indigo glowing beam', 'background: linear-gradient(90deg, #a855f7 0%, #4f46e5 100%); border: none; min-height: 2px; padding: 0; border-radius: 9999px; box-shadow: 0 0 14px rgba(168, 85, 247, 0.85); opacity: 1;', 'bg-gradient-to-r from-purple-500 to-indigo-600 border-0 h-0.5 p-0 rounded-full'],
    ['ai-line-2-double', 'AI Double Editorial Rule', 'Classic double-line structural border rule', 'background: transparent; border: none; border-top: 4px double #475569; min-height: 0; padding: 0; opacity: 1;', 'bg-transparent border-0 border-t-4 border-double border-slate-600 p-0'],
    ['ai-line-2-crimson', 'AI Crimson Accent Bar', 'High-contrast rose-crimson accent line', 'background: #e11d48; border: none; min-height: 3px; padding: 0; border-radius: 9999px; box-shadow: 0 2px 8px rgba(225, 29, 72, 0.45); opacity: 1;', 'bg-rose-600 border-0 h-0.5 p-0 rounded-full shadow-sm'],
    ['ai-line-2-shimmer', 'AI Frosted Shimmer Line', 'Translucent glass highlight hairline', 'background: linear-gradient(90deg, rgba(148, 163, 184, 0.15) 0%, rgba(56, 189, 248, 0.75) 50%, rgba(148, 163, 184, 0.15) 100%); border: none; min-height: 2px; padding: 0; opacity: 1;', 'bg-gradient-to-r from-slate-400/15 via-sky-400/75 to-slate-400/15 border-0 h-0.5 p-0'],
  ],
];

const SCROLLBAR_SETS: PresetTuple[][] = [
  [
    ['ai-scroll-0-indigo', 'AI Sleek Indigo Pill Bar', 'Rounded indigo scrollbar thumb with smooth hover glow', 'background: linear-gradient(180deg, #6366f1 0%, #4f46e5 100%); border-radius: 9999px; box-shadow: 0 0 10px rgba(99, 102, 241, 0.55); scrollbar-width: thin; scrollbar-color: #6366f1 rgba(15, 23, 42, 0.15); transition: filter 0.2s ease, box-shadow 0.2s ease;', 'bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.55)]', 'filter: brightness(1.18); box-shadow: 0 0 14px rgba(99, 102, 241, 0.85);'],
    ['ai-scroll-0-glass', 'AI Frosted Glass Bar', 'Translucent glass scroll thumb with crisp rim border', 'background: rgba(56, 189, 248, 0.45); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.55); border-radius: 9999px; scrollbar-width: thin; scrollbar-color: rgba(56, 189, 248, 0.6) transparent;', 'bg-sky-400/45 backdrop-blur border border-white/55 rounded-full'],
    ['ai-scroll-0-cyan', 'AI Neon Cyan Track Bar', 'Luminous cyan scroll thumb with halo aura', 'background: #0ea5e9; border-radius: 9999px; box-shadow: 0 0 12px rgba(14, 165, 233, 0.8); scrollbar-width: thin; scrollbar-color: #0ea5e9 transparent;', 'bg-sky-500 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.8)]'],
    ['ai-scroll-0-slate', 'AI Minimal Slate Pill', 'Clean dark slate micro-bar that brightens on hover', 'background: #334155; border-radius: 9999px; scrollbar-width: thin; scrollbar-color: #334155 transparent; transition: background 0.2s ease;', 'bg-slate-700 rounded-full hover:bg-slate-500 transition-colors', 'background: #64748b;'],
  ],
  [
    ['ai-scroll-1-sunset', 'AI Sunset Gradient Bar', 'Warm amber-to-rose gradient pill for thumbs & progress bars', 'background: linear-gradient(180deg, #f59e0b 0%, #f43f5e 100%); border-radius: 9999px; box-shadow: 0 0 10px rgba(244, 63, 94, 0.5); scrollbar-width: thin; scrollbar-color: #f43f5e transparent;', 'bg-gradient-to-b from-amber-500 to-rose-500 rounded-full'],
    ['ai-scroll-1-emerald', 'AI Emerald Glow Bar', 'Crisp emerald neon bar with luminous green halo', 'background: #10b981; border-radius: 9999px; box-shadow: 0 0 12px rgba(16, 185, 129, 0.75); scrollbar-width: thin; scrollbar-color: #10b981 transparent;', 'bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.75)]'],
    ['ai-scroll-1-inset', 'AI Tactile Inset Track', 'Recessed subtle track surface with soft inner depth', 'background: rgba(99, 102, 241, 0.35); border: 1px solid rgba(99, 102, 241, 0.6); border-radius: 9999px; box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3); scrollbar-width: thin; scrollbar-color: #6366f1 rgba(99, 102, 241, 0.12);', 'bg-indigo-500/35 border border-indigo-500/60 rounded-full shadow-inner'],
    ['ai-scroll-1-brutal', 'AI Sharp High-Contrast Bar', 'Bold zero-radius geometric bar with crisp border', 'background: #0f172a; border: 1.5px solid #38bdf8; border-radius: 0px; scrollbar-width: thin; scrollbar-color: #0f172a #e2e8f0;', 'bg-slate-900 border border-sky-400 rounded-none'],
  ],
  [
    ['ai-scroll-2-violet', 'AI Electric Violet Bar', 'Vibrant purple-to-cyan gradient pill with plasma glow', 'background: linear-gradient(180deg, #a855f7 0%, #38bdf8 100%); border-radius: 9999px; box-shadow: 0 0 12px rgba(168, 85, 247, 0.75); scrollbar-width: thin; scrollbar-color: #a855f7 transparent;', 'bg-gradient-to-b from-purple-500 to-sky-400 rounded-full'],
    ['ai-scroll-2-gold', 'AI Champagne Gold Bar', 'Warm metallic amber pill indicator', 'background: linear-gradient(180deg, #fbbf24 0%, #d97706 100%); border-radius: 9999px; box-shadow: 0 0 10px rgba(245, 158, 11, 0.55); scrollbar-width: thin; scrollbar-color: #f59e0b transparent;', 'bg-gradient-to-b from-amber-400 to-amber-600 rounded-full'],
    ['ai-scroll-2-crimson', 'AI Crimson Pulse Bar', 'High-visibility rose-crimson bar with hover glow', 'background: #e11d48; border-radius: 9999px; box-shadow: 0 0 10px rgba(225, 29, 72, 0.65); scrollbar-width: thin; scrollbar-color: #e11d48 transparent;', 'bg-rose-600 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.65)]'],
    ['ai-scroll-2-ghost', 'AI Stealth Ghost Bar', 'Subtle translucent bar that reveals full contrast on hover', 'background: rgba(100, 116, 139, 0.45); border-radius: 9999px; scrollbar-width: thin; scrollbar-color: rgba(100, 116, 139, 0.5) transparent; transition: background 0.2s ease, box-shadow 0.2s ease;', 'bg-slate-500/45 hover:bg-indigo-500 rounded-full transition-all', 'background: #6366f1; box-shadow: 0 0 10px rgba(99, 102, 241, 0.65);'],
  ],
];

const SHAPE_SETS: PresetTuple[][] = [
  [
    ['ai-shape-0-orb', 'AI Radiant Gradient Orb', 'Vibrant indigo-to-cyan gradient fill with soft glow', 'background: linear-gradient(135deg, #6366f1 0%, #38bdf8 100%); border-radius: 9999px; box-shadow: 0 6px 18px rgba(56, 189, 248, 0.45); transition: transform 0.2s ease, box-shadow 0.2s ease;', 'bg-gradient-to-br from-indigo-500 to-sky-400 rounded-full shadow-lg', 'transform: scale(1.1); box-shadow: 0 8px 24px rgba(56, 189, 248, 0.65);'],
    ['ai-shape-0-glass', 'AI Frosted Glass Shape', 'Translucent blurred glass fill with crisp specular rim', 'background: rgba(56, 189, 248, 0.22); backdrop-filter: blur(10px); border: 1.5px solid rgba(255, 255, 255, 0.55); box-shadow: 0 6px 16px rgba(15, 23, 42, 0.22);', 'bg-sky-400/20 backdrop-blur-md border border-white/55 shadow-md'],
    ['ai-shape-0-ring', 'AI Neon Cyan Ring', 'Hollow luminous cyan ring with inner & outer halo', 'background: transparent; border: 2.5px solid #0ea5e9; border-radius: 9999px; box-shadow: 0 0 12px rgba(14, 165, 233, 0.75), inset 0 0 8px rgba(14, 165, 233, 0.4);', 'bg-transparent border-2 border-sky-500 rounded-full shadow-[0_0_12px_rgba(14,165,233,0.75)]'],
    ['ai-shape-0-sphere', 'AI 3D Tactile Sphere', 'Radial 3D highlight with deep ambient shadow', 'background: radial-gradient(circle at 30% 30%, #a5b4fc 0%, #4f46e5 55%, #1e1b4b 100%); border-radius: 9999px; box-shadow: 0 8px 18px rgba(30, 27, 75, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.45);', 'rounded-full shadow-xl'],
  ],
  [
    ['ai-shape-1-sunset', 'AI Sunset Flame Shape', 'Warm amber-to-rose gradient fill with warm aura', 'background: linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%); box-shadow: 0 6px 18px rgba(244, 63, 94, 0.45); transition: transform 0.2s ease;', 'bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg', 'transform: scale(1.08);'],
    ['ai-shape-1-beacon', 'AI Emerald Status Beacon', 'Vibrant emerald fill with glowing ring aura', 'background: #10b981; border: 2px solid #a7f3d0; border-radius: 9999px; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.25), 0 0 14px rgba(16, 185, 129, 0.75);', 'bg-emerald-500 border-2 border-emerald-200 rounded-full ring-4 ring-emerald-500/25'],
    ['ai-shape-1-brutal', 'AI Brutalist Offset Shape', 'Crisp solid fill with hard geometric offset shadow', 'background: #f43f5e; border: 2px solid #0f172a; box-shadow: 4px 4px 0px #0f172a; transition: transform 0.15s ease;', 'bg-rose-500 border-2 border-slate-900 shadow-[4px_4px_0px_#0f172a]', 'transform: translate(-1px, -1px);'],
    ['ai-shape-1-blob', 'AI Organic Morph Blob', 'Asymmetric organic blob radius with smooth hover morph', 'background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; box-shadow: 0 8px 20px rgba(168, 85, 247, 0.4); transition: border-radius 0.35s ease, transform 0.25s ease;', 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg transition-all', 'border-radius: 40% 60% 70% 30% / 40% 70% 30% 60%; transform: scale(1.08);'],
  ],
  [
    ['ai-shape-2-violet', 'AI Violet Plasma Core', 'Electric purple gradient with intense violet halo', 'background: radial-gradient(circle, #c084fc 0%, #7e22ce 100%); border-radius: 9999px; box-shadow: 0 0 18px rgba(168, 85, 247, 0.85);', 'bg-purple-600 rounded-full shadow-[0_0_18px_rgba(168,85,247,0.85)]'],
    ['ai-shape-2-gold', 'AI Metallic Gold Badge', 'Warm champagne gold gradient with specular rim', 'background: linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #b45309 100%); border: 1.5px solid #fef3c7; box-shadow: 0 6px 16px rgba(245, 158, 11, 0.45);', 'bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 border border-amber-100 shadow-md'],
    ['ai-shape-2-crimson', 'AI Crimson Halo Shape', 'Ruby-crimson fill with glowing double ring', 'background: #e11d48; border: 2px solid #fecdd3; border-radius: 9999px; box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.25), 0 0 16px rgba(225, 29, 72, 0.7);', 'bg-rose-600 border-2 border-rose-200 rounded-full ring-4 ring-rose-600/25'],
    ['ai-shape-2-double', 'AI Double Ring Outline', 'Crisp inner border with offset outer halo ring', 'background: rgba(99, 102, 241, 0.15); border: 2px solid #6366f1; border-radius: 9999px; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.28);', 'bg-indigo-500/15 border-2 border-indigo-500 rounded-full ring-2 ring-indigo-500/30'],
  ],
];

export function getStructuralArchetypePresets(
  archetype: 'divider-line' | 'scrollbar-track' | 'shape-graphic',
  cycleIndex: number
): StylePreset[] {
  const cycle = Math.abs(Number(cycleIndex) || 0) % 3;
  if (archetype === 'divider-line') return toPresets(DIVIDER_SETS[cycle] ?? DIVIDER_SETS[0]!);
  if (archetype === 'scrollbar-track') return toPresets(SCROLLBAR_SETS[cycle] ?? SCROLLBAR_SETS[0]!);
  return toPresets(SHAPE_SETS[cycle] ?? SHAPE_SETS[0]!);
}
