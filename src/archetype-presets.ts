import type { StylePreset } from './types';
import type { ElementArchetype } from './element-classifier';
import { getAiVariationCyclePresets } from './bridge-presets';
import { getIconVariationCyclePresets } from './icon-presets';

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

const PHOTO_SETS: PresetTuple[][] = [
  [
    ['ai-photo-0-editorial', 'AI Rounded Editorial', 'Smooth rounded corners with soft depth shadow', 'border-radius: 16px; box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28); object-fit: cover; transition: transform 0.25s ease, box-shadow 0.25s ease;', 'rounded-2xl shadow-xl object-cover transition-transform', 'transform: scale(1.02); box-shadow: 0 18px 36px rgba(0, 0, 0, 0.36);'],
    ['ai-photo-0-cinema', 'AI Cinematic Contrast', 'Rich contrast & crisp frame for media', 'border-radius: 12px; filter: contrast(1.12) saturate(1.15); box-shadow: 0 8px 24px rgba(15, 23, 42, 0.35); transition: filter 0.25s ease;', 'rounded-xl contrast-110 saturate-110 shadow-lg', 'filter: contrast(1.18) saturate(1.25);'],
    ['ai-photo-0-glass', 'AI Frosted Media Frame', 'Translucent glass border framing the image', 'padding: 6px; background: rgba(255, 255, 255, 0.14); border: 1px solid rgba(255, 255, 255, 0.3); backdrop-filter: blur(10px); border-radius: 16px;', 'p-1.5 bg-white/15 border border-white/30 backdrop-blur-md rounded-2xl'],
    ['ai-photo-0-mono', 'AI Monochrome Film', 'Editorial black & white that reveals color on hover', 'border-radius: 12px; filter: grayscale(1) contrast(1.2); transition: filter 0.3s ease, transform 0.25s ease;', 'rounded-xl grayscale contrast-125 hover:grayscale-0 transition-all', 'filter: grayscale(0) saturate(1.1); transform: scale(1.02);'],
  ],
  [
    ['ai-photo-1-warm', 'AI Warm Golden Hour', 'Warm sepia-tinted sunlit photography feel', 'border-radius: 16px; filter: sepia(0.25) saturate(1.25) brightness(1.04); box-shadow: 0 10px 24px rgba(245, 158, 11, 0.22);', 'rounded-2xl sepia-[.25] saturate-125 shadow-lg'],
    ['ai-photo-1-circle', 'AI Soft Avatar Crop', 'Circular crop with crisp ring border', 'border-radius: 9999px; object-fit: cover; border: 2px solid rgba(56, 189, 248, 0.6); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);', 'rounded-full object-cover border-2 border-sky-400/60 shadow-lg'],
    ['ai-photo-1-cyan', 'AI Cyan Rim Glow', 'Subtle luminous cyan halo around media', 'border-radius: 14px; border: 1px solid rgba(56, 189, 248, 0.55); box-shadow: 0 0 22px rgba(56, 189, 248, 0.35);', 'rounded-xl border border-sky-400/55 shadow-[0_0_22px_rgba(56,189,248,0.35)]'],
    ['ai-photo-1-sharp', 'AI Brutalist Sharp Crop', 'Zero-radius high-contrast editorial frame', 'border-radius: 0px; border: 2px solid #0f172a; box-shadow: 6px 6px 0px #0f172a;', 'rounded-none border-2 border-slate-900 shadow-[6px_6px_0px_#0f172a]'],
  ],
  [
    ['ai-photo-2-vivid', 'AI Vivid HDR Pop', 'Boosted vibrance and crisp shadow depth', 'border-radius: 14px; filter: saturate(1.35) contrast(1.08); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);', 'rounded-xl saturate-150 contrast-105 shadow-xl'],
    ['ai-photo-2-violet', 'AI Violet Aura Frame', 'Electric violet border glow for spotlight media', 'border-radius: 16px; border: 1px solid rgba(168, 85, 247, 0.5); box-shadow: 0 0 24px rgba(168, 85, 247, 0.3);', 'rounded-2xl border border-purple-500/50 shadow-[0_0_24px_rgba(168,85,247,0.3)]'],
    ['ai-photo-2-polaroid', 'AI Tactile Card Frame', 'Clean white border frame with soft drop shadow', 'padding: 8px; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);', 'p-2 bg-white rounded-xl shadow-xl'],
    ['ai-photo-2-zoom', 'AI Interactive Zoom', 'Smooth scale-up on hover for galleries', 'border-radius: 12px; transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: pointer;', 'rounded-xl transition-transform hover:scale-105 cursor-pointer', 'transform: scale(1.05); box-shadow: 0 14px 28px rgba(0, 0, 0, 0.32);'],
  ],
];

const INPUT_SETS: PresetTuple[][] = [
  [
    ['ai-input-0-glass', 'AI Glass Input Field', 'Translucent input with crisp hairline border', 'background: rgba(255, 255, 255, 0.08); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.25); border-radius: 10px; padding: 10px 14px; backdrop-filter: blur(10px); outline: none;', 'bg-white/10 text-white border border-white/25 rounded-lg px-3.5 py-2.5 backdrop-blur-md'],
    ['ai-input-0-clean', 'AI Clean Elevated Input', 'Crisp light surface with soft focus shadow', 'background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06); outline: none;', 'bg-white text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2.5 shadow-sm'],
    ['ai-input-0-cyan', 'AI Cyan Focus Ring', 'Dark field with glowing cyan focus accent', 'background: #0f172a; color: #f8fafc; border: 1px solid #38bdf8; border-radius: 10px; padding: 10px 14px; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25); outline: none;', 'bg-slate-900 text-white border border-sky-400 rounded-lg px-3.5 py-2.5 ring-2 ring-sky-400/25'],
    ['ai-input-0-underline', 'AI Minimal Underline', 'Clean bottom-border-only editorial input', 'background: transparent; border: none; border-bottom: 2px solid #64748b; border-radius: 0px; padding: 8px 4px; outline: none;', 'bg-transparent border-0 border-b-2 border-slate-500 rounded-none px-1 py-2'],
  ],
  [
    ['ai-input-1-pill', 'AI Pill Search Bar', 'Full pill radius for modern search inputs', 'background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 9999px; padding: 10px 18px; outline: none;', 'bg-slate-100 text-slate-900 border border-slate-300 rounded-full px-4 py-2.5'],
    ['ai-input-1-inset', 'AI Tactile Soft Inset', 'Recessed claymorphic input surface', 'background: #e2e8f0; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 12px; padding: 10px 14px; box-shadow: inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff; outline: none;', 'bg-slate-200 text-slate-900 border border-slate-300 rounded-xl px-3.5 py-2.5 shadow-inner'],
    ['ai-input-1-emerald', 'AI Emerald Accent Field', 'Crisp emerald border for validated inputs', 'background: #0f172a; color: #ecfdf5; border: 1px solid #10b981; border-radius: 10px; padding: 10px 14px; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); outline: none;', 'bg-slate-900 text-emerald-50 border border-emerald-500 rounded-lg px-3.5 py-2.5'],
    ['ai-input-1-brutal', 'AI High-Contrast Box', 'Sharp 2px border for bold form clarity', 'background: #ffffff; color: #0f172a; border: 2px solid #0f172a; border-radius: 0px; padding: 10px 14px; font-weight: 600; outline: none;', 'bg-white text-slate-900 border-2 border-slate-900 rounded-none px-3.5 py-2.5 font-semibold'],
  ],
  [
    ['ai-input-2-violet', 'AI Violet Focus Glow', 'Deep dark field with electric violet ring', 'background: #1e1b4b; color: #f5f3ff; border: 1px solid #a855f7; border-radius: 10px; padding: 10px 14px; box-shadow: 0 0 14px rgba(168, 85, 247, 0.35); outline: none;', 'bg-indigo-950 text-violet-50 border border-purple-500 rounded-lg px-3.5 py-2.5'],
    ['ai-input-2-obsidian', 'AI Obsidian Minimal', 'Sleek dark input with subtle slate border', 'background: #020617; color: #f8fafc; border: 1px solid #334155; border-radius: 8px; padding: 10px 14px; outline: none;', 'bg-slate-950 text-white border border-slate-700 rounded-lg px-3.5 py-2.5'],
    ['ai-input-2-warm', 'AI Warm Cream Field', 'Soft warm neutral surface for friendly forms', 'background: #fffbeb; color: #1e293b; border: 1px solid #fcd34d; border-radius: 10px; padding: 10px 14px; outline: none;', 'bg-amber-50 text-slate-800 border border-amber-300 rounded-lg px-3.5 py-2.5'],
    ['ai-input-2-dense', 'AI Compact Dense Input', 'Tight, crisp spacing for data-dense UIs', 'background: #ffffff; color: #0f172a; border: 1px solid #94a3b8; border-radius: 6px; padding: 6px 10px; font-size: 0.875rem; outline: none;', 'bg-white text-slate-900 border border-slate-400 rounded-md px-2.5 py-1.5 text-sm'],
  ],
];

const HEADING_SETS: PresetTuple[][] = [
  [
    ['ai-head-0-gradient', 'AI Electric Gradient Text', 'Vibrant violet-to-cyan gradient clipped to text', 'background: linear-gradient(135deg, #a855f7 0%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.025em;', 'bg-gradient-to-r from-purple-500 to-sky-400 bg-clip-text text-transparent font-extrabold tracking-tight'],
    ['ai-head-0-editorial', 'AI Crisp Editorial Tight', 'Tight tracking and bold weight for clean hierarchy', 'font-weight: 800; letter-spacing: -0.03em; line-height: 1.15;', 'font-extrabold tracking-tight leading-tight'],
    ['ai-head-0-accentbar', 'AI Accent Left Bar', 'Clean vertical accent indicator beside heading', 'border-left: 4px solid #38bdf8; padding-left: 12px; font-weight: 700; letter-spacing: -0.02em;', 'border-l-4 border-sky-400 pl-3 font-bold tracking-tight'],
    ['ai-head-0-glow', 'AI Luminous Halo Title', 'Subtle radiant text glow for hero headlines', 'color: #f8fafc; font-weight: 800; letter-spacing: -0.02em; text-shadow: 0 0 20px rgba(56, 189, 248, 0.55);', 'text-slate-50 font-extrabold tracking-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.55)]'],
  ],
  [
    ['ai-head-1-sunset', 'AI Sunset Flame Gradient', 'Warm amber-to-rose gradient headline', 'background: linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.025em;', 'bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent font-extrabold tracking-tight'],
    ['ai-head-1-underline', 'AI Accent Underline', 'Crisp colored underline beneath the title', 'border-bottom: 3px solid #6366f1; padding-bottom: 6px; display: inline-block; font-weight: 700;', 'border-b-2 border-indigo-500 pb-1.5 inline-block font-bold'],
    ['ai-head-1-pill', 'AI Highlighted Banner', 'Compact tinted pill backdrop behind headline', 'background: rgba(99, 102, 241, 0.14); color: #818cf8; padding: 6px 14px; border-radius: 10px; display: inline-block; font-weight: 700;', 'bg-indigo-500/15 text-indigo-400 px-3.5 py-1.5 rounded-lg inline-block font-bold'],
    ['ai-head-1-caps', 'AI Brutalist Display', 'Bold uppercase tracking for impact headers', 'font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;', 'font-extrabold uppercase tracking-wider'],
  ],
  [
    ['ai-head-2-emerald', 'AI Emerald Tech Gradient', 'Crisp emerald-to-cyan gradient text', 'background: linear-gradient(135deg, #10b981 0%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.025em;', 'bg-gradient-to-r from-emerald-500 to-sky-400 bg-clip-text text-transparent font-extrabold tracking-tight'],
    ['ai-head-2-glass', 'AI Frosted Title Chip', 'Subtle translucent glass container for headers', 'background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; padding: 6px 14px; display: inline-block; font-weight: 700;', 'bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3.5 py-1.5 inline-block font-bold'],
    ['ai-head-2-serif', 'AI Luxury Light Display', 'Refined lighter weight with generous tracking', 'font-weight: 600; letter-spacing: 0.03em; line-height: 1.25;', 'font-semibold tracking-wide leading-snug'],
    ['ai-head-2-rose', 'AI Punchy Crimson Accent', 'High-contrast crimson text with crisp shadow', 'color: #e11d48; font-weight: 800; letter-spacing: -0.02em;', 'text-rose-600 font-extrabold tracking-tight'],
  ],
];

const BADGE_SETS: PresetTuple[][] = [
  [
    ['ai-badge-0-tint', 'AI Soft Tinted Pill', 'Compact pill with subtle cyan tint', 'background: rgba(56, 189, 248, 0.14); color: #0284c7; border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 9999px; padding: 3px 10px; font-size: 0.8em; font-weight: 600; display: inline-flex; align-items: center;', 'bg-sky-500/15 text-sky-600 border border-sky-400/35 rounded-full px-2.5 py-0.5 text-xs font-semibold inline-flex'],
    ['ai-badge-0-solid', 'AI Bold Primary Pill', 'High-contrast indigo status pill', 'background: #4f46e5; color: #ffffff; border-radius: 9999px; padding: 4px 12px; font-size: 0.8em; font-weight: 600; display: inline-flex; align-items: center;', 'bg-indigo-600 text-white rounded-full px-3 py-1 text-xs font-semibold inline-flex'],
    ['ai-badge-0-glass', 'AI Frosted Micro Tag', 'Translucent glass pill with hairline border', 'background: rgba(255, 255, 255, 0.14); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 9999px; padding: 3px 10px; font-size: 0.8em; font-weight: 600;', 'bg-white/15 backdrop-blur border border-white/30 rounded-full px-2.5 py-0.5 text-xs font-semibold'],
    ['ai-badge-0-outline', 'AI Crisp Outline Tag', 'Border-only minimal tag', 'background: transparent; color: #38bdf8; border: 1.5px solid #38bdf8; border-radius: 9999px; padding: 3px 10px; font-size: 0.8em; font-weight: 600;', 'bg-transparent text-sky-400 border border-sky-400 rounded-full px-2.5 py-0.5 text-xs font-semibold'],
  ],
  [
    ['ai-badge-1-sunset', 'AI Warm Sunset Chip', 'Vibrant amber-to-rose gradient pill', 'background: linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%); color: #ffffff; border-radius: 9999px; padding: 4px 12px; font-size: 0.8em; font-weight: 600;', 'bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full px-3 py-1 text-xs font-semibold'],
    ['ai-badge-1-emerald', 'AI Emerald Status Pill', 'Fresh emerald success pill badge', 'background: rgba(16, 185, 129, 0.16); color: #059669; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 9999px; padding: 3px 10px; font-size: 0.8em; font-weight: 600;', 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/40 rounded-full px-2.5 py-0.5 text-xs font-semibold'],
    ['ai-badge-1-dark', 'AI Obsidian Dark Pill', 'Sleek dark slate pill with crisp contrast', 'background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 9999px; padding: 4px 12px; font-size: 0.8em; font-weight: 600;', 'bg-slate-900 text-white border border-slate-700 rounded-full px-3 py-1 text-xs font-semibold'],
    ['ai-badge-1-stamp', 'AI Sharp Stamp Tag', 'Uppercase boxy stamp label', 'background: #ffffff; color: #0f172a; border: 1.5px solid #0f172a; border-radius: 4px; padding: 2px 8px; font-size: 0.75em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;', 'bg-white text-slate-900 border border-slate-900 rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider'],
  ],
  [
    ['ai-badge-2-violet', 'AI Violet Neon Pill', 'Glowing violet pill for featured tags', 'background: rgba(168, 85, 247, 0.16); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.5); border-radius: 9999px; padding: 3px 10px; box-shadow: 0 0 12px rgba(168, 85, 247, 0.35); font-size: 0.8em; font-weight: 600;', 'bg-purple-500/15 text-purple-300 border border-purple-500/50 rounded-full px-2.5 py-0.5 text-xs font-semibold'],
    ['ai-badge-2-rose', 'AI Crimson Alert Pill', 'High-visibility rose pill for urgent tags', 'background: #e11d48; color: #ffffff; border-radius: 9999px; padding: 4px 12px; font-size: 0.8em; font-weight: 600;', 'bg-rose-600 text-white rounded-full px-3 py-1 text-xs font-semibold'],
    ['ai-badge-2-soft', 'AI Neutral Slate Chip', 'Subtle muted badge for metadata', 'background: rgba(148, 163, 184, 0.16); color: #475569; border-radius: 6px; padding: 3px 9px; font-size: 0.8em; font-weight: 500;', 'bg-slate-400/15 text-slate-600 rounded-md px-2 py-0.5 text-xs font-medium'],
    ['ai-badge-2-gold', 'AI Champagne Gold Tag', 'Warm amber-tinted luxury badge', 'background: rgba(245, 158, 11, 0.15); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 9999px; padding: 3px 10px; font-size: 0.8em; font-weight: 600;', 'bg-amber-500/15 text-amber-600 border border-amber-500/40 rounded-full px-2.5 py-0.5 text-xs font-semibold'],
  ],
];

const PROSE_SETS: PresetTuple[][] = [
  [
    ['ai-prose-0-read', 'AI High-Legibility Prose', 'Relaxed 1.65 line-height for effortless reading', 'line-height: 1.65; letter-spacing: 0.01em; max-width: 65ch;', 'leading-relaxed tracking-normal max-w-prose'],
    ['ai-prose-0-callout', 'AI Accent Callout Block', 'Left border callout with subtle tinted surface', 'border-left: 3px solid #38bdf8; background: rgba(56, 189, 248, 0.08); padding: 12px 16px; border-radius: 0 10px 10px 0; line-height: 1.6;', 'border-l-4 border-sky-400 bg-sky-500/10 px-4 py-3 rounded-r-lg leading-relaxed'],
    ['ai-prose-0-muted', 'AI Muted Secondary Copy', 'Subtle softened tone for supporting text', 'opacity: 0.78; font-size: 0.95em; line-height: 1.6;', 'opacity-80 text-sm leading-relaxed'],
    ['ai-prose-0-glass', 'AI Frosted Note Card', 'Clean translucent surface around text block', 'background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 12px; padding: 14px 18px; line-height: 1.6;', 'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3.5 leading-relaxed'],
  ],
  [
    ['ai-prose-1-warm', 'AI Warm Highlight Note', 'Warm amber callout tint for key takeaways', 'border-left: 3px solid #f59e0b; background: rgba(245, 158, 11, 0.1); padding: 12px 16px; border-radius: 8px; line-height: 1.6;', 'border-l-4 border-amber-500 bg-amber-500/10 px-4 py-3 rounded-lg leading-relaxed'],
    ['ai-prose-1-lead', 'AI Lead Intro Paragraph', 'Slightly larger, airy intro text treatment', 'font-size: 1.12em; line-height: 1.7; font-weight: 500;', 'text-lg leading-relaxed font-medium'],
    ['ai-prose-1-quote', 'AI Italic Pull Quote', 'Editorial italic styling with crisp left rule', 'border-left: 3px solid #a855f7; padding-left: 14px; font-style: italic; line-height: 1.65;', 'border-l-4 border-purple-500 pl-3.5 italic leading-relaxed'],
    ['ai-prose-1-card', 'AI Elevated Dark Prose', 'High-contrast dark surface for standalone copy', 'background: #0f172a; color: #f1f5f9; padding: 14px 18px; border-radius: 12px; line-height: 1.65;', 'bg-slate-900 text-slate-100 px-4 py-3.5 rounded-xl leading-relaxed'],
  ],
  [
    ['ai-prose-2-emerald', 'AI Emerald Tip Callout', 'Fresh emerald tip container with crisp border', 'border-left: 3px solid #10b981; background: rgba(16, 185, 129, 0.09); padding: 12px 16px; border-radius: 8px; line-height: 1.6;', 'border-l-4 border-emerald-500 bg-emerald-500/10 px-4 py-3 rounded-lg leading-relaxed'],
    ['ai-prose-2-crisp', 'AI Crisp High-Contrast', 'Sharp contrast boost for effortless scanning', 'font-weight: 500; line-height: 1.6; letter-spacing: 0.005em;', 'font-medium leading-relaxed'],
    ['ai-prose-2-compact', 'AI Compact Dense Copy', 'Tighter line-height for compact UI labels', 'font-size: 0.9em; line-height: 1.45;', 'text-sm leading-snug'],
    ['ai-prose-2-rose', 'AI Rose Emphasis Note', 'Subtle rose callout for important notices', 'border-left: 3px solid #f43f5e; background: rgba(244, 63, 94, 0.09); padding: 12px 16px; border-radius: 8px; line-height: 1.6;', 'border-l-4 border-rose-500 bg-rose-500/10 px-4 py-3 rounded-lg leading-relaxed'],
  ],
];

export function getArchetypeVariationPresets(archetype: ElementArchetype, cycleIndex: number): StylePreset[] {
  const cycle = Math.abs(Number(cycleIndex) || 0) % 3;
  if (archetype === 'icon-emoji') return getIconVariationCyclePresets(cycle);
  if (archetype === 'button-action') return getAiVariationCyclePresets(cycle, true);
  if (archetype === 'card-container') return getAiVariationCyclePresets(cycle, false);
  if (archetype === 'photo-media') return toPresets(PHOTO_SETS[cycle] ?? PHOTO_SETS[0]!);
  if (archetype === 'input-control') return toPresets(INPUT_SETS[cycle] ?? INPUT_SETS[0]!);
  if (archetype === 'heading-title') return toPresets(HEADING_SETS[cycle] ?? HEADING_SETS[0]!);
  if (archetype === 'badge-pill') return toPresets(BADGE_SETS[cycle] ?? BADGE_SETS[0]!);
  return toPresets(PROSE_SETS[cycle] ?? PROSE_SETS[0]!);
}
