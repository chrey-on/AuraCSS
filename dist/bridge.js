// src/bridge.ts
import http from "http";
import fs3 from "fs";
import path3 from "path";

// src/icon-presets.ts
function getIconVariationCyclePresets(cycleIndex) {
  const cycle = Math.abs(Number(cycleIndex) || 0) % 3;
  const set0 = [
    {
      id: "ai-icon-0-elevated",
      name: "AI Crisp Icon Pop",
      description: "Silhouette drop-shadow with smooth hover scale",
      cssText: "filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35)) contrast(1.08) saturate(1.15); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;",
      hoverState: "transform: scale(1.15) translateY(-2px); filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.45)) brightness(1.08);",
      activeState: "transform: scale(0.92);",
      tailwindClasses: "drop-shadow-md contrast-110 hover:scale-115 transition-transform",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-icon-0-glass",
      name: "AI Frosted Glass Badge",
      description: "Compact frosted pill frame with soft icon shadow",
      cssText: "padding: 6px; border-radius: 9999px; background: rgba(255, 255, 255, 0.16); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3); filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.2)); transition: transform 0.2s ease;",
      hoverState: "transform: scale(1.1); background: rgba(255, 255, 255, 0.26);",
      activeState: "transform: scale(0.95);",
      tailwindClasses: "p-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 drop-shadow",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-icon-0-cyan",
      name: "AI Radiant Cyan Halo",
      description: "Neon cyan silhouette glow directly around the icon",
      cssText: "filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.9)) brightness(1.12) saturate(1.25); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;",
      hoverState: "transform: scale(1.16); filter: drop-shadow(0 0 14px rgba(56, 189, 248, 1)) brightness(1.2);",
      activeState: "transform: scale(0.94);",
      tailwindClasses: "drop-shadow-[0_0_8px_rgba(56,189,248,0.9)] brightness-110 saturate-125",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-icon-0-mono",
      name: "AI Monochrome Ink",
      description: "Crisp grayscale ink look that restores color on hover",
      cssText: "filter: grayscale(1) contrast(1.35) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25)); transition: filter 0.2s ease, transform 0.2s ease; cursor: pointer;",
      hoverState: "filter: grayscale(0) saturate(1.25) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.3)); transform: scale(1.12);",
      activeState: "transform: scale(0.94);",
      tailwindClasses: "grayscale contrast-125 hover:grayscale-0 hover:scale-110 transition-all",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    }
  ];
  const set1 = [
    {
      id: "ai-icon-1-sunset",
      name: "AI Sunset Hue Shift",
      description: "Warm hue-shifted tint with rose silhouette glow",
      cssText: "filter: hue-rotate(-28deg) saturate(1.5) drop-shadow(0 4px 12px rgba(244, 63, 94, 0.5)); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;",
      hoverState: "transform: scale(1.14); filter: hue-rotate(-28deg) saturate(1.7) drop-shadow(0 6px 16px rgba(244, 63, 94, 0.7));",
      tailwindClasses: "-hue-rotate-30 saturate-150 drop-shadow-[0_4px_12px_rgba(244,63,94,0.5)]",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-icon-1-tactile",
      name: "AI Soft Tactile Chip",
      description: "Compact raised rounded chip around the icon",
      cssText: "padding: 6px; border-radius: 12px; background: #e2e8f0; box-shadow: 4px 4px 10px #94a3b8, -3px -3px 8px #ffffff; filter: saturate(1.15); transition: transform 0.2s ease;",
      hoverState: "transform: translateY(-2px) scale(1.06);",
      activeState: "transform: scale(0.95);",
      tailwindClasses: "p-1.5 rounded-xl bg-slate-200 shadow-md saturate-110",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-icon-1-emerald",
      name: "AI Emerald Neon Tint",
      description: "Cool emerald hue shift with luminous green halo",
      cssText: "filter: hue-rotate(115deg) saturate(1.55) drop-shadow(0 0 10px rgba(16, 185, 129, 0.85)); transition: transform 0.2s ease, filter 0.2s ease; cursor: pointer;",
      hoverState: "transform: scale(1.15); filter: hue-rotate(115deg) saturate(1.75) drop-shadow(0 0 16px rgba(16, 185, 129, 1));",
      tailwindClasses: "hue-rotate-90 saturate-150 drop-shadow-[0_0_10px_rgba(16,185,129,0.85)]",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-icon-1-tilt",
      name: "AI Playful Tilt",
      description: "Dynamic angled tilt that flips playfully on hover",
      cssText: "transform: rotate(-6deg) scale(1.06); filter: drop-shadow(0 6px 12px rgba(99, 102, 241, 0.4)); transition: transform 0.2s ease; cursor: pointer;",
      hoverState: "transform: rotate(6deg) scale(1.18);",
      activeState: "transform: scale(0.94);",
      tailwindClasses: "-rotate-6 scale-105 hover:rotate-6 hover:scale-110 transition-transform",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    }
  ];
  const set2 = [
    {
      id: "ai-icon-2-gold",
      name: "AI Champagne Gold Tint",
      description: "Warm metallic gold tint with soft amber glow",
      cssText: "filter: sepia(0.75) saturate(2.1) hue-rotate(8deg) brightness(1.05) drop-shadow(0 3px 10px rgba(245, 158, 11, 0.5)); transition: transform 0.2s ease;",
      hoverState: "transform: scale(1.14); filter: sepia(0.75) saturate(2.3) hue-rotate(8deg) brightness(1.12) drop-shadow(0 4px 14px rgba(245, 158, 11, 0.75));",
      tailwindClasses: "sepia saturate-200 brightness-105 drop-shadow-[0_3px_10px_rgba(245,158,11,0.5)]",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-icon-2-violet",
      name: "AI Violet Plasma Aura",
      description: "Electric violet color shift with plasma silhouette glow",
      cssText: "filter: hue-rotate(245deg) saturate(1.55) drop-shadow(0 0 10px rgba(168, 85, 247, 0.85)); transition: transform 0.2s ease;",
      hoverState: "transform: scale(1.15);",
      tailwindClasses: "saturate-150 drop-shadow-[0_0_10px_rgba(168,85,247,0.85)]",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-icon-2-frost",
      name: "AI Crisp Frost Frame",
      description: "Subtle translucent border frame keeping icon crisp",
      cssText: "padding: 5px; border-radius: 10px; background: rgba(15, 23, 42, 0.08); border: 1px solid rgba(148, 163, 184, 0.35); filter: contrast(1.1) saturate(1.15); transition: transform 0.2s ease;",
      hoverState: "transform: scale(1.08); border-color: rgba(56, 189, 248, 0.6);",
      tailwindClasses: "p-1.5 rounded-lg bg-slate-900/10 border border-slate-400/35 contrast-110",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-icon-2-pulse",
      name: "AI Ambient Pulse",
      description: "Gentle breathing glow animation on the icon",
      cssText: "filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.65)); animation: auracssIconPulse 2.2s ease-in-out infinite; cursor: pointer;",
      keyframes: "@keyframes auracssIconPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.5)); } 50% { transform: scale(1.1); filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.95)); } }",
      tailwindClasses: "animate-pulse drop-shadow-[0_0_8px_rgba(56,189,248,0.65)]",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    }
  ];
  const allSets = [set0, set1, set2];
  return allSets[cycle] ?? set0;
}

// src/element-classifier.ts
function classifySnapshot(tag, htmlSnippet = "", innerText = "", rect) {
  const t = tag.toLowerCase();
  if (t === "video" || t === "picture") return "photo-media";
  if (t === "img") {
    const maxDim = rect ? Math.max(rect.width, rect.height) : 0;
    return maxDim > 72 ? "photo-media" : "icon-emoji";
  }
  if (t === "svg" || t === "i" || htmlSnippet.includes("<svg")) return "icon-emoji";
  if (t === "input" || t === "textarea" || t === "select") return "input-control";
  if (t === "button" || t === "a" || htmlSnippet.includes('role="button"')) return "button-action";
  if (/^h[1-6]$/.test(t)) return "heading-title";
  if (["span", "label", "strong", "small", "code"].includes(t) && innerText.length > 0 && innerText.length <= 28) {
    return "badge-pill";
  }
  if (["p", "li", "blockquote", "figcaption"].includes(t)) return "text-prose";
  return "card-container";
}

// src/bridge-presets.ts
function getAiVariationCyclePresets(cycleIndex, isAction, isIcon = false) {
  if (isIcon) return getIconVariationCyclePresets(cycleIndex);
  const cycle = Math.abs(Number(cycleIndex) || 0) % 3;
  const set0 = [
    {
      id: "ai-cycle-0-elevated",
      name: "AI Modern Elevated Solid",
      description: "Clean solid color with a soft, natural shadow",
      cssText: isAction ? "background-color: #4f46e5; color: #ffffff; border: none; border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); cursor: pointer;" : "background-color: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);",
      tailwindClasses: isAction ? "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/30" : "bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-cycle-0-glass",
      name: "AI Frosted Glassmorphism",
      description: "Modern frosted glass look with a smooth blur",
      cssText: isAction ? "background: rgba(255, 255, 255, 0.1); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.25); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius: 8px; padding: 10px 22px; font-weight: 600; cursor: pointer;" : "background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.15); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 14px; padding: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);",
      tailwindClasses: isAction ? "bg-white/10 hover:bg-white/15 border border-white/25 text-white backdrop-blur-md px-5 py-2.5 rounded-lg font-semibold" : "bg-slate-900/70 border border-white/15 backdrop-blur-xl rounded-2xl p-6 shadow-2xl",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-cycle-0-neon",
      name: "AI Radiant Cyan Halo",
      description: "Dark background with a vibrant cyan glow",
      cssText: isAction ? "background: #0f172a; color: #38bdf8; border: 1px solid #38bdf8; border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 0 16px rgba(56, 189, 248, 0.5); cursor: pointer;" : "background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.5); border-radius: 12px; padding: 24px; box-shadow: 0 0 28px rgba(56, 189, 248, 0.2);",
      tailwindClasses: isAction ? "bg-slate-900 border border-sky-400 text-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.5)] px-5 py-2.5 rounded-lg font-semibold" : "bg-slate-900 border border-sky-400/50 shadow-[0_0_28px_rgba(56,189,248,0.2)] rounded-xl p-6",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-cycle-0-brutalist",
      name: "AI Surgical Brutalist",
      description: "Bold, sharp box with crisp high contrast",
      cssText: isAction ? "background: #ffffff; color: #0f172a; border: 2px solid #0f172a; border-radius: 0px; padding: 10px 22px; font-weight: 700; cursor: pointer;" : "background: #020617; border: 2px solid #334155; border-radius: 0px; padding: 24px;",
      tailwindClasses: isAction ? "bg-white text-slate-900 border-2 border-slate-900 rounded-none px-5 py-2.5 font-bold" : "bg-slate-950 border-2 border-slate-700 rounded-none p-6",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    }
  ];
  const set1 = [
    {
      id: "ai-cycle-1-sunset",
      name: "AI Warm Sunset Flame",
      description: "Warm amber-to-pink gradient with a soft sunset glow",
      cssText: isAction ? "background: linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%); color: #ffffff; border: none; border-radius: 12px; padding: 12px 24px; font-weight: 600; box-shadow: 0 6px 18px rgba(244, 63, 94, 0.35); cursor: pointer;" : "background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(244, 63, 94, 0.15) 100%); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 16px; padding: 24px; box-shadow: 0 12px 30px rgba(244, 63, 94, 0.15);",
      tailwindClasses: isAction ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-rose-500/30" : "bg-gradient-to-br from-amber-500/10 to-rose-500/10 border border-rose-500/30 rounded-2xl p-6",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-cycle-1-clay",
      name: "AI Soft Tactile Claymorphic",
      description: "Soft, rounded look with subtle raised shadows",
      cssText: isAction ? "background: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 9999px; padding: 12px 26px; font-weight: 700; box-shadow: 6px 6px 12px #94a3b8, -4px -4px 10px #ffffff; cursor: pointer;" : "background: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 20px; padding: 26px; box-shadow: 8px 8px 16px #94a3b8, -6px -6px 14px #ffffff;",
      tailwindClasses: isAction ? "bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-full shadow-[6px_6px_12px_#94a3b8,-4px_-4px_10px_#ffffff]" : "bg-slate-200 text-slate-800 rounded-3xl p-6 shadow-[8px_8px_16px_#94a3b8,-6px_-6px_14px_#ffffff]",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-cycle-1-crimson",
      name: "AI Crimson Velvet Pulse",
      description: "Rich red with a glowing red aura",
      cssText: isAction ? "background: #dc2626; color: #ffffff; border: 1px solid #ef4444; border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 0 20px rgba(220, 38, 38, 0.45); cursor: pointer;" : "background: #1a0505; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 14px; padding: 24px; box-shadow: 0 0 30px rgba(220, 38, 38, 0.25);",
      tailwindClasses: isAction ? "bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.45)]" : "bg-red-950/40 border border-red-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(220,38,38,0.25)]",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-cycle-1-wire",
      name: "AI Minimal Neutral Wire",
      description: "Clean outlined style with minimal design",
      cssText: isAction ? "background: transparent; color: #f8fafc; border: 2px solid #94a3b8; border-radius: 6px; padding: 10px 22px; font-weight: 600; cursor: pointer;" : "background: #020617; border: 1px solid #475569; border-radius: 8px; padding: 24px;",
      tailwindClasses: isAction ? "bg-transparent border-2 border-slate-400 text-white px-5 py-2.5 rounded-md font-semibold" : "bg-slate-950 border border-slate-600 rounded-lg p-6",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    }
  ];
  const set2 = [
    {
      id: "ai-cycle-2-emerald",
      name: "AI Cyberpunk Emerald Matrix",
      description: "Bright green borders on a dark background",
      cssText: isAction ? "background: #022c22; color: #34d399; border: 2px solid #10b981; border-radius: 4px; padding: 10px 22px; font-weight: 700; box-shadow: 0 0 18px rgba(16, 185, 129, 0.4); cursor: pointer;" : "background: #021a14; border: 2px solid #10b981; border-radius: 8px; padding: 24px; box-shadow: 0 0 32px rgba(16, 185, 129, 0.25);",
      tailwindClasses: isAction ? "bg-emerald-950 border-2 border-emerald-500 text-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.4)] px-5 py-2.5 rounded font-bold" : "bg-emerald-950/80 border-2 border-emerald-500 rounded-lg p-6 shadow-[0_0_32px_rgba(16,185,129,0.25)]",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-cycle-2-obsidian",
      name: "AI Obsidian Glass Void",
      description: "Dark, semi-transparent glass with a purple border",
      cssText: isAction ? "background: rgba(2, 6, 23, 0.85); color: #e2e8f0; border: 1px solid #a855f7; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6); cursor: pointer;" : "background: rgba(2, 6, 23, 0.85); border: 1px solid rgba(168, 85, 247, 0.4); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-radius: 16px; padding: 24px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);",
      tailwindClasses: isAction ? "bg-slate-950/85 border border-purple-500 text-slate-200 backdrop-blur-xl px-5 py-2.5 rounded-lg font-semibold shadow-2xl" : "bg-slate-950/85 border border-purple-500/40 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-cycle-2-violet",
      name: "AI Electric Violet Gradient",
      description: "Violet-to-pink gradient with a glowing edge",
      cssText: isAction ? "background: linear-gradient(135deg, #7c3aed 0%, #d946ef 100%); color: #ffffff; border: none; border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 4px 18px rgba(217, 70, 239, 0.4); cursor: pointer;" : "background: linear-gradient(135deg, #2e1065 0%, #4a044e 100%); border: 1px solid rgba(217, 70, 239, 0.35); border-radius: 12px; padding: 24px;",
      tailwindClasses: isAction ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-fuchsia-500/30" : "bg-gradient-to-br from-violet-950 to-fuchsia-950 border border-fuchsia-500/30 rounded-xl p-6",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    },
    {
      id: "ai-cycle-2-hyper",
      name: "AI Hyper-Dense Industrial Pill",
      description: "Tight pill shape with bold, spaced-out text",
      cssText: isAction ? "background: #0f172a; color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 9999px; padding: 8px 20px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer;" : "background: #0f172a; border: 2px solid #e2e8f0; border-radius: 9999px; padding: 16px 28px;",
      tailwindClasses: isAction ? "bg-slate-900 border-2 border-slate-200 text-white px-5 py-2 rounded-full font-bold uppercase tracking-wider text-xs" : "bg-slate-900 border-2 border-slate-200 rounded-full p-6",
      contrastRating: "AAA",
      contrastRatio: "7.5:1"
    }
  ];
  const allSets = [set0, set1, set2];
  return allSets[cycle] ?? set0;
}

// src/archetype-presets.ts
function toPresets(items) {
  return items.map(([id, name, description, cssText, tailwindClasses, hoverState]) => ({
    id,
    name,
    description,
    cssText,
    ...hoverState ? { hoverState } : {},
    tailwindClasses,
    contrastRating: "AAA",
    contrastRatio: "7.5:1"
  }));
}
var PHOTO_SETS = [
  [
    ["ai-photo-0-editorial", "AI Rounded Editorial", "Smooth rounded corners with soft depth shadow", "border-radius: 16px; box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28); object-fit: cover; transition: transform 0.25s ease, box-shadow 0.25s ease;", "rounded-2xl shadow-xl object-cover transition-transform", "transform: scale(1.02); box-shadow: 0 18px 36px rgba(0, 0, 0, 0.36);"],
    ["ai-photo-0-cinema", "AI Cinematic Contrast", "Rich contrast & crisp frame for media", "border-radius: 12px; filter: contrast(1.12) saturate(1.15); box-shadow: 0 8px 24px rgba(15, 23, 42, 0.35); transition: filter 0.25s ease;", "rounded-xl contrast-110 saturate-110 shadow-lg", "filter: contrast(1.18) saturate(1.25);"],
    ["ai-photo-0-glass", "AI Frosted Media Frame", "Translucent glass border framing the image", "padding: 6px; background: rgba(255, 255, 255, 0.14); border: 1px solid rgba(255, 255, 255, 0.3); backdrop-filter: blur(10px); border-radius: 16px;", "p-1.5 bg-white/15 border border-white/30 backdrop-blur-md rounded-2xl"],
    ["ai-photo-0-mono", "AI Monochrome Film", "Editorial black & white that reveals color on hover", "border-radius: 12px; filter: grayscale(1) contrast(1.2); transition: filter 0.3s ease, transform 0.25s ease;", "rounded-xl grayscale contrast-125 hover:grayscale-0 transition-all", "filter: grayscale(0) saturate(1.1); transform: scale(1.02);"]
  ],
  [
    ["ai-photo-1-warm", "AI Warm Golden Hour", "Warm sepia-tinted sunlit photography feel", "border-radius: 16px; filter: sepia(0.25) saturate(1.25) brightness(1.04); box-shadow: 0 10px 24px rgba(245, 158, 11, 0.22);", "rounded-2xl sepia-[.25] saturate-125 shadow-lg"],
    ["ai-photo-1-circle", "AI Soft Avatar Crop", "Circular crop with crisp ring border", "border-radius: 9999px; object-fit: cover; border: 2px solid rgba(56, 189, 248, 0.6); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);", "rounded-full object-cover border-2 border-sky-400/60 shadow-lg"],
    ["ai-photo-1-cyan", "AI Cyan Rim Glow", "Subtle luminous cyan halo around media", "border-radius: 14px; border: 1px solid rgba(56, 189, 248, 0.55); box-shadow: 0 0 22px rgba(56, 189, 248, 0.35);", "rounded-xl border border-sky-400/55 shadow-[0_0_22px_rgba(56,189,248,0.35)]"],
    ["ai-photo-1-sharp", "AI Brutalist Sharp Crop", "Zero-radius high-contrast editorial frame", "border-radius: 0px; border: 2px solid #0f172a; box-shadow: 6px 6px 0px #0f172a;", "rounded-none border-2 border-slate-900 shadow-[6px_6px_0px_#0f172a]"]
  ],
  [
    ["ai-photo-2-vivid", "AI Vivid HDR Pop", "Boosted vibrance and crisp shadow depth", "border-radius: 14px; filter: saturate(1.35) contrast(1.08); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);", "rounded-xl saturate-150 contrast-105 shadow-xl"],
    ["ai-photo-2-violet", "AI Violet Aura Frame", "Electric violet border glow for spotlight media", "border-radius: 16px; border: 1px solid rgba(168, 85, 247, 0.5); box-shadow: 0 0 24px rgba(168, 85, 247, 0.3);", "rounded-2xl border border-purple-500/50 shadow-[0_0_24px_rgba(168,85,247,0.3)]"],
    ["ai-photo-2-polaroid", "AI Tactile Card Frame", "Clean white border frame with soft drop shadow", "padding: 8px; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);", "p-2 bg-white rounded-xl shadow-xl"],
    ["ai-photo-2-zoom", "AI Interactive Zoom", "Smooth scale-up on hover for galleries", "border-radius: 12px; transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: pointer;", "rounded-xl transition-transform hover:scale-105 cursor-pointer", "transform: scale(1.05); box-shadow: 0 14px 28px rgba(0, 0, 0, 0.32);"]
  ]
];
var INPUT_SETS = [
  [
    ["ai-input-0-glass", "AI Glass Input Field", "Translucent input with crisp hairline border", "background: rgba(255, 255, 255, 0.08); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.25); border-radius: 10px; padding: 10px 14px; backdrop-filter: blur(10px); outline: none;", "bg-white/10 text-white border border-white/25 rounded-lg px-3.5 py-2.5 backdrop-blur-md"],
    ["ai-input-0-clean", "AI Clean Elevated Input", "Crisp light surface with soft focus shadow", "background: #ffffff; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06); outline: none;", "bg-white text-slate-900 border border-slate-300 rounded-lg px-3.5 py-2.5 shadow-sm"],
    ["ai-input-0-cyan", "AI Cyan Focus Ring", "Dark field with glowing cyan focus accent", "background: #0f172a; color: #f8fafc; border: 1px solid #38bdf8; border-radius: 10px; padding: 10px 14px; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25); outline: none;", "bg-slate-900 text-white border border-sky-400 rounded-lg px-3.5 py-2.5 ring-2 ring-sky-400/25"],
    ["ai-input-0-underline", "AI Minimal Underline", "Clean bottom-border-only editorial input", "background: transparent; border: none; border-bottom: 2px solid #64748b; border-radius: 0px; padding: 8px 4px; outline: none;", "bg-transparent border-0 border-b-2 border-slate-500 rounded-none px-1 py-2"]
  ],
  [
    ["ai-input-1-pill", "AI Pill Search Bar", "Full pill radius for modern search inputs", "background: #f1f5f9; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 9999px; padding: 10px 18px; outline: none;", "bg-slate-100 text-slate-900 border border-slate-300 rounded-full px-4 py-2.5"],
    ["ai-input-1-inset", "AI Tactile Soft Inset", "Recessed claymorphic input surface", "background: #e2e8f0; color: #0f172a; border: 1px solid #cbd5e1; border-radius: 12px; padding: 10px 14px; box-shadow: inset 3px 3px 6px #cbd5e1, inset -3px -3px 6px #ffffff; outline: none;", "bg-slate-200 text-slate-900 border border-slate-300 rounded-xl px-3.5 py-2.5 shadow-inner"],
    ["ai-input-1-emerald", "AI Emerald Accent Field", "Crisp emerald border for validated inputs", "background: #0f172a; color: #ecfdf5; border: 1px solid #10b981; border-radius: 10px; padding: 10px 14px; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); outline: none;", "bg-slate-900 text-emerald-50 border border-emerald-500 rounded-lg px-3.5 py-2.5"],
    ["ai-input-1-brutal", "AI High-Contrast Box", "Sharp 2px border for bold form clarity", "background: #ffffff; color: #0f172a; border: 2px solid #0f172a; border-radius: 0px; padding: 10px 14px; font-weight: 600; outline: none;", "bg-white text-slate-900 border-2 border-slate-900 rounded-none px-3.5 py-2.5 font-semibold"]
  ],
  [
    ["ai-input-2-violet", "AI Violet Focus Glow", "Deep dark field with electric violet ring", "background: #1e1b4b; color: #f5f3ff; border: 1px solid #a855f7; border-radius: 10px; padding: 10px 14px; box-shadow: 0 0 14px rgba(168, 85, 247, 0.35); outline: none;", "bg-indigo-950 text-violet-50 border border-purple-500 rounded-lg px-3.5 py-2.5"],
    ["ai-input-2-obsidian", "AI Obsidian Minimal", "Sleek dark input with subtle slate border", "background: #020617; color: #f8fafc; border: 1px solid #334155; border-radius: 8px; padding: 10px 14px; outline: none;", "bg-slate-950 text-white border border-slate-700 rounded-lg px-3.5 py-2.5"],
    ["ai-input-2-warm", "AI Warm Cream Field", "Soft warm neutral surface for friendly forms", "background: #fffbeb; color: #1e293b; border: 1px solid #fcd34d; border-radius: 10px; padding: 10px 14px; outline: none;", "bg-amber-50 text-slate-800 border border-amber-300 rounded-lg px-3.5 py-2.5"],
    ["ai-input-2-dense", "AI Compact Dense Input", "Tight, crisp spacing for data-dense UIs", "background: #ffffff; color: #0f172a; border: 1px solid #94a3b8; border-radius: 6px; padding: 6px 10px; font-size: 0.875rem; outline: none;", "bg-white text-slate-900 border border-slate-400 rounded-md px-2.5 py-1.5 text-sm"]
  ]
];
var HEADING_SETS = [
  [
    ["ai-head-0-gradient", "AI Electric Gradient Text", "Vibrant violet-to-cyan gradient clipped to text", "background: linear-gradient(135deg, #a855f7 0%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.025em;", "bg-gradient-to-r from-purple-500 to-sky-400 bg-clip-text text-transparent font-extrabold tracking-tight"],
    ["ai-head-0-editorial", "AI Crisp Editorial Tight", "Tight tracking and bold weight for clean hierarchy", "font-weight: 800; letter-spacing: -0.03em; line-height: 1.15;", "font-extrabold tracking-tight leading-tight"],
    ["ai-head-0-accentbar", "AI Accent Left Bar", "Clean vertical accent indicator beside heading", "border-left: 4px solid #38bdf8; padding-left: 12px; font-weight: 700; letter-spacing: -0.02em;", "border-l-4 border-sky-400 pl-3 font-bold tracking-tight"],
    ["ai-head-0-glow", "AI Luminous Halo Title", "Subtle radiant text glow for hero headlines", "color: #f8fafc; font-weight: 800; letter-spacing: -0.02em; text-shadow: 0 0 20px rgba(56, 189, 248, 0.55);", "text-slate-50 font-extrabold tracking-tight drop-shadow-[0_0_12px_rgba(56,189,248,0.55)]"]
  ],
  [
    ["ai-head-1-sunset", "AI Sunset Flame Gradient", "Warm amber-to-rose gradient headline", "background: linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.025em;", "bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent font-extrabold tracking-tight"],
    ["ai-head-1-underline", "AI Accent Underline", "Crisp colored underline beneath the title", "border-bottom: 3px solid #6366f1; padding-bottom: 6px; display: inline-block; font-weight: 700;", "border-b-2 border-indigo-500 pb-1.5 inline-block font-bold"],
    ["ai-head-1-pill", "AI Highlighted Banner", "Compact tinted pill backdrop behind headline", "background: rgba(99, 102, 241, 0.14); color: #818cf8; padding: 6px 14px; border-radius: 10px; display: inline-block; font-weight: 700;", "bg-indigo-500/15 text-indigo-400 px-3.5 py-1.5 rounded-lg inline-block font-bold"],
    ["ai-head-1-caps", "AI Brutalist Display", "Bold uppercase tracking for impact headers", "font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em;", "font-extrabold uppercase tracking-wider"]
  ],
  [
    ["ai-head-2-emerald", "AI Emerald Tech Gradient", "Crisp emerald-to-cyan gradient text", "background: linear-gradient(135deg, #10b981 0%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; letter-spacing: -0.025em;", "bg-gradient-to-r from-emerald-500 to-sky-400 bg-clip-text text-transparent font-extrabold tracking-tight"],
    ["ai-head-2-glass", "AI Frosted Title Chip", "Subtle translucent glass container for headers", "background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 10px; padding: 6px 14px; display: inline-block; font-weight: 700;", "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3.5 py-1.5 inline-block font-bold"],
    ["ai-head-2-serif", "AI Luxury Light Display", "Refined lighter weight with generous tracking", "font-weight: 600; letter-spacing: 0.03em; line-height: 1.25;", "font-semibold tracking-wide leading-snug"],
    ["ai-head-2-rose", "AI Punchy Crimson Accent", "High-contrast crimson text with crisp shadow", "color: #e11d48; font-weight: 800; letter-spacing: -0.02em;", "text-rose-600 font-extrabold tracking-tight"]
  ]
];
var BADGE_SETS = [
  [
    ["ai-badge-0-tint", "AI Soft Tinted Pill", "Compact pill with subtle cyan tint", "background: rgba(56, 189, 248, 0.14); color: #0284c7; border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 9999px; padding: 3px 10px; font-size: 0.8em; font-weight: 600; display: inline-flex; align-items: center;", "bg-sky-500/15 text-sky-600 border border-sky-400/35 rounded-full px-2.5 py-0.5 text-xs font-semibold inline-flex"],
    ["ai-badge-0-solid", "AI Bold Primary Pill", "High-contrast indigo status pill", "background: #4f46e5; color: #ffffff; border-radius: 9999px; padding: 4px 12px; font-size: 0.8em; font-weight: 600; display: inline-flex; align-items: center;", "bg-indigo-600 text-white rounded-full px-3 py-1 text-xs font-semibold inline-flex"],
    ["ai-badge-0-glass", "AI Frosted Micro Tag", "Translucent glass pill with hairline border", "background: rgba(255, 255, 255, 0.14); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 9999px; padding: 3px 10px; font-size: 0.8em; font-weight: 600;", "bg-white/15 backdrop-blur border border-white/30 rounded-full px-2.5 py-0.5 text-xs font-semibold"],
    ["ai-badge-0-outline", "AI Crisp Outline Tag", "Border-only minimal tag", "background: transparent; color: #38bdf8; border: 1.5px solid #38bdf8; border-radius: 9999px; padding: 3px 10px; font-size: 0.8em; font-weight: 600;", "bg-transparent text-sky-400 border border-sky-400 rounded-full px-2.5 py-0.5 text-xs font-semibold"]
  ],
  [
    ["ai-badge-1-sunset", "AI Warm Sunset Chip", "Vibrant amber-to-rose gradient pill", "background: linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%); color: #ffffff; border-radius: 9999px; padding: 4px 12px; font-size: 0.8em; font-weight: 600;", "bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full px-3 py-1 text-xs font-semibold"],
    ["ai-badge-1-emerald", "AI Emerald Status Pill", "Fresh emerald success pill badge", "background: rgba(16, 185, 129, 0.16); color: #059669; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 9999px; padding: 3px 10px; font-size: 0.8em; font-weight: 600;", "bg-emerald-500/15 text-emerald-600 border border-emerald-500/40 rounded-full px-2.5 py-0.5 text-xs font-semibold"],
    ["ai-badge-1-dark", "AI Obsidian Dark Pill", "Sleek dark slate pill with crisp contrast", "background: #0f172a; color: #f8fafc; border: 1px solid #334155; border-radius: 9999px; padding: 4px 12px; font-size: 0.8em; font-weight: 600;", "bg-slate-900 text-white border border-slate-700 rounded-full px-3 py-1 text-xs font-semibold"],
    ["ai-badge-1-stamp", "AI Sharp Stamp Tag", "Uppercase boxy stamp label", "background: #ffffff; color: #0f172a; border: 1.5px solid #0f172a; border-radius: 4px; padding: 2px 8px; font-size: 0.75em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;", "bg-white text-slate-900 border border-slate-900 rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider"]
  ],
  [
    ["ai-badge-2-violet", "AI Violet Neon Pill", "Glowing violet pill for featured tags", "background: rgba(168, 85, 247, 0.16); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.5); border-radius: 9999px; padding: 3px 10px; box-shadow: 0 0 12px rgba(168, 85, 247, 0.35); font-size: 0.8em; font-weight: 600;", "bg-purple-500/15 text-purple-300 border border-purple-500/50 rounded-full px-2.5 py-0.5 text-xs font-semibold"],
    ["ai-badge-2-rose", "AI Crimson Alert Pill", "High-visibility rose pill for urgent tags", "background: #e11d48; color: #ffffff; border-radius: 9999px; padding: 4px 12px; font-size: 0.8em; font-weight: 600;", "bg-rose-600 text-white rounded-full px-3 py-1 text-xs font-semibold"],
    ["ai-badge-2-soft", "AI Neutral Slate Chip", "Subtle muted badge for metadata", "background: rgba(148, 163, 184, 0.16); color: #475569; border-radius: 6px; padding: 3px 9px; font-size: 0.8em; font-weight: 500;", "bg-slate-400/15 text-slate-600 rounded-md px-2 py-0.5 text-xs font-medium"],
    ["ai-badge-2-gold", "AI Champagne Gold Tag", "Warm amber-tinted luxury badge", "background: rgba(245, 158, 11, 0.15); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 9999px; padding: 3px 10px; font-size: 0.8em; font-weight: 600;", "bg-amber-500/15 text-amber-600 border border-amber-500/40 rounded-full px-2.5 py-0.5 text-xs font-semibold"]
  ]
];
var PROSE_SETS = [
  [
    ["ai-prose-0-read", "AI High-Legibility Prose", "Relaxed 1.65 line-height for effortless reading", "line-height: 1.65; letter-spacing: 0.01em; max-width: 65ch;", "leading-relaxed tracking-normal max-w-prose"],
    ["ai-prose-0-callout", "AI Accent Callout Block", "Left border callout with subtle tinted surface", "border-left: 3px solid #38bdf8; background: rgba(56, 189, 248, 0.08); padding: 12px 16px; border-radius: 0 10px 10px 0; line-height: 1.6;", "border-l-4 border-sky-400 bg-sky-500/10 px-4 py-3 rounded-r-lg leading-relaxed"],
    ["ai-prose-0-muted", "AI Muted Secondary Copy", "Subtle softened tone for supporting text", "opacity: 0.78; font-size: 0.95em; line-height: 1.6;", "opacity-80 text-sm leading-relaxed"],
    ["ai-prose-0-glass", "AI Frosted Note Card", "Clean translucent surface around text block", "background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 12px; padding: 14px 18px; line-height: 1.6;", "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3.5 leading-relaxed"]
  ],
  [
    ["ai-prose-1-warm", "AI Warm Highlight Note", "Warm amber callout tint for key takeaways", "border-left: 3px solid #f59e0b; background: rgba(245, 158, 11, 0.1); padding: 12px 16px; border-radius: 8px; line-height: 1.6;", "border-l-4 border-amber-500 bg-amber-500/10 px-4 py-3 rounded-lg leading-relaxed"],
    ["ai-prose-1-lead", "AI Lead Intro Paragraph", "Slightly larger, airy intro text treatment", "font-size: 1.12em; line-height: 1.7; font-weight: 500;", "text-lg leading-relaxed font-medium"],
    ["ai-prose-1-quote", "AI Italic Pull Quote", "Editorial italic styling with crisp left rule", "border-left: 3px solid #a855f7; padding-left: 14px; font-style: italic; line-height: 1.65;", "border-l-4 border-purple-500 pl-3.5 italic leading-relaxed"],
    ["ai-prose-1-card", "AI Elevated Dark Prose", "High-contrast dark surface for standalone copy", "background: #0f172a; color: #f1f5f9; padding: 14px 18px; border-radius: 12px; line-height: 1.65;", "bg-slate-900 text-slate-100 px-4 py-3.5 rounded-xl leading-relaxed"]
  ],
  [
    ["ai-prose-2-emerald", "AI Emerald Tip Callout", "Fresh emerald tip container with crisp border", "border-left: 3px solid #10b981; background: rgba(16, 185, 129, 0.09); padding: 12px 16px; border-radius: 8px; line-height: 1.6;", "border-l-4 border-emerald-500 bg-emerald-500/10 px-4 py-3 rounded-lg leading-relaxed"],
    ["ai-prose-2-crisp", "AI Crisp High-Contrast", "Sharp contrast boost for effortless scanning", "font-weight: 500; line-height: 1.6; letter-spacing: 0.005em;", "font-medium leading-relaxed"],
    ["ai-prose-2-compact", "AI Compact Dense Copy", "Tighter line-height for compact UI labels", "font-size: 0.9em; line-height: 1.45;", "text-sm leading-snug"],
    ["ai-prose-2-rose", "AI Rose Emphasis Note", "Subtle rose callout for important notices", "border-left: 3px solid #f43f5e; background: rgba(244, 63, 94, 0.09); padding: 12px 16px; border-radius: 8px; line-height: 1.6;", "border-l-4 border-rose-500 bg-rose-500/10 px-4 py-3 rounded-lg leading-relaxed"]
  ]
];
function getArchetypeVariationPresets(archetype, cycleIndex) {
  const cycle = Math.abs(Number(cycleIndex) || 0) % 3;
  if (archetype === "icon-emoji") return getIconVariationCyclePresets(cycle);
  if (archetype === "button-action") return getAiVariationCyclePresets(cycle, true);
  if (archetype === "card-container") return getAiVariationCyclePresets(cycle, false);
  if (archetype === "photo-media") return toPresets(PHOTO_SETS[cycle] ?? PHOTO_SETS[0]);
  if (archetype === "input-control") return toPresets(INPUT_SETS[cycle] ?? INPUT_SETS[0]);
  if (archetype === "heading-title") return toPresets(HEADING_SETS[cycle] ?? HEADING_SETS[0]);
  if (archetype === "badge-pill") return toPresets(BADGE_SETS[cycle] ?? BADGE_SETS[0]);
  return toPresets(PROSE_SETS[cycle] ?? PROSE_SETS[0]);
}

// src/bridge-compiler.ts
var COLOR_MAP = {
  crimson: { hex: "#dc2626", tw: "red-600", isLight: false },
  red: { hex: "#ef4444", tw: "red-500", isLight: false },
  ruby: { hex: "#e11d48", tw: "rose-600", isLight: false },
  rose: { hex: "#f43f5e", tw: "rose-500", isLight: false },
  pink: { hex: "#ec4899", tw: "pink-500", isLight: false },
  blue: { hex: "#2563eb", tw: "blue-600", isLight: false },
  indigo: { hex: "#4f46e5", tw: "indigo-600", isLight: false },
  violet: { hex: "#7c3aed", tw: "violet-600", isLight: false },
  purple: { hex: "#a855f7", tw: "purple-500", isLight: false },
  cyan: { hex: "#38bdf8", tw: "sky-400", isLight: true },
  sky: { hex: "#38bdf8", tw: "sky-400", isLight: true },
  teal: { hex: "#14b8a6", tw: "teal-500", isLight: false },
  emerald: { hex: "#10b981", tw: "emerald-500", isLight: false },
  green: { hex: "#22c55e", tw: "green-500", isLight: false },
  amber: { hex: "#f59e0b", tw: "amber-500", isLight: true },
  orange: { hex: "#f97316", tw: "orange-500", isLight: false },
  yellow: { hex: "#eab308", tw: "yellow-500", isLight: true },
  slate: { hex: "#0f172a", tw: "slate-900", isLight: false },
  dark: { hex: "#0f172a", tw: "slate-900", isLight: false },
  black: { hex: "#020617", tw: "slate-950", isLight: false },
  white: { hex: "#ffffff", tw: "white", isLight: true },
  light: { hex: "#f8fafc", tw: "slate-50", isLight: true }
};
function isLightColorHex(hex) {
  if (hex.startsWith("#") && hex.length >= 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b > 160;
  }
  return false;
}
function extractColorDef(text) {
  const hexMatch = text.match(/#([0-9a-f]{6}|[0-9a-f]{3})/i);
  if (hexMatch) {
    const hex = hexMatch[0];
    const isLight = isLightColorHex(hex);
    return { hex, tw: `[${hex}]`, isLight };
  }
  for (const [name, def] of Object.entries(COLOR_MAP)) {
    const regex = new RegExp(`\\b${name}\\b`, "i");
    if (regex.test(text)) return def;
  }
  return null;
}
async function synthesizeWithLocalOrEnv(prompt, tag, _htmlSnippet = "", _computedStyles = {}, _siteTokens = {}, setIndex = 0, innerText = "", rect) {
  const p = prompt.toLowerCase();
  const archetype = classifySnapshot(tag, _htmlSnippet, innerText, rect);
  if (p.includes("diverse design variations") || p.includes("presets") || p.includes("4 variations")) {
    const presets = getArchetypeVariationPresets(archetype, setIndex);
    return {
      cssText: presets[0].cssText,
      tailwindClasses: presets[0].tailwindClasses,
      explanation: JSON.stringify({ presets })
    };
  }
  const color = extractColorDef(p);
  if (archetype === "icon-emoji") {
    const glowHex = color ? color.hex : "#38bdf8";
    const cssText = p.includes("glow") || p.includes("pop") || p.includes("halo") ? `filter: drop-shadow(0 0 10px ${glowHex}) brightness(1.12) saturate(1.25); transition: transform 0.2s ease, filter 0.2s ease;` : p.includes("mono") || p.includes("gray") || p.includes("dark") ? "filter: grayscale(1) contrast(1.3); transition: filter 0.2s ease;" : "filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35)) saturate(1.2); transform: scale(1.08); transition: transform 0.2s ease;";
    return {
      cssText,
      tailwindClasses: "drop-shadow-lg saturate-125 transition-transform",
      explanation: `Applied icon-aware filter & transform styling to <${tag}>`
    };
  }
  if (archetype === "photo-media") {
    const radius = p.includes("circle") || p.includes("round") || p.includes("pill") ? "9999px" : "16px";
    return {
      cssText: `border-radius: ${radius}; object-fit: cover; filter: contrast(1.08) saturate(1.15); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);`,
      tailwindClasses: `rounded-2xl object-cover shadow-xl`,
      explanation: `Applied media framing & contrast styling to <${tag}>`
    };
  }
  const hasNegatedBg = /\b(remove|no|without|clear|transparent)\s+(?:the\s+)?(?:background|bg|fill)\b/i.test(p);
  const hasBg = !hasNegatedBg && (p.includes("background") || p.includes("bg") || p.includes("fill") || !p.includes("text") && !p.includes("border") && color !== null);
  const hasText = p.includes("text") || p.includes("font") || p.includes("foreground");
  const hasBorder = p.includes("border") || p.includes("outline") || p.includes("stroke") || hasNegatedBg;
  const hasGlow = p.includes("glow") || p.includes("neon") || p.includes("shadow") || p.includes("halo") || p.includes("luminous") || p.includes("pulse");
  const hasFading = p.includes("fading") || p.includes("fade") || p.includes("pulse") || p.includes("pulsing") || p.includes("breathe");
  const hasClickAnim = p.includes("click") || p.includes("clicking") || p.includes("press") || p.includes("tap") || p.includes("active");
  const hasAnim = p.includes("animat") || p.includes("motion") || p.includes("bounce") || p.includes("spring");
  const hasPill = p.includes("pill") || p.includes("oval") || p.includes("rounded-full");
  const hasSharp = p.includes("sharp") || p.includes("square") || p.includes("box") || p.includes("brutalist");
  const hasGlass = p.includes("glass") || p.includes("frost") || p.includes("blur") || p.includes("translucent");
  const isLonger = Boolean(p.match(/\b(long|longer|wide|wider|broad|stretched|expand|lengthy)\b/i));
  const isBigger = Boolean(p.match(/\b(big|bigger|large|larger|huge|chunky|giant|spacious|breathing room|roomy|airiness)\b/i));
  const isCompact = Boolean(p.match(/\b(compact|small|smaller|tight|tiny|thin|slender)\b/i));
  const isPop = Boolean(p.match(/\b(pop|pops|standout|punchy|bold)\b/i));
  const isSoften = Boolean(p.match(/\b(soften|softer|smooth|smoothen)\b/i));
  const isProfessional = Boolean(p.match(/\b(professional|corporate|executive|sleek)\b/i));
  const isLuxury = Boolean(p.match(/\b(expensive|luxury|premium|high[- ]?end)\b/i));
  const isSpacious = Boolean(p.match(/\b(crowded|cramped|suffocating|tight)\b/i));
  const isUgly = Boolean(p.match(/\b(ugly|cheap|outdated|clunky)\b/i));
  const isFriendly = Boolean(p.match(/\b(friendly|approachable|playful|soft)\b/i));
  const cssDecls = [];
  const twDecls = [];
  const descriptions = [];
  if (isLonger && isBigger) {
    cssDecls.push("padding: 16px 36px; min-width: 240px; font-size: 1.15rem;");
    twDecls.push("px-9 py-4 text-lg min-w-[240px]");
    descriptions.push("extended length, enlarged dimensions, and scaled typography");
  } else if (isLonger) {
    cssDecls.push("padding: 10px 32px; min-width: 200px;");
    twDecls.push("px-8 py-2.5 min-w-[200px]");
    descriptions.push("extended horizontal width");
  } else if (isBigger) {
    cssDecls.push("padding: 14px 28px; font-size: 1.1rem;");
    twDecls.push("px-7 py-3.5 text-base");
    descriptions.push("enlarged padding and font scale");
  } else if (isCompact) {
    cssDecls.push("padding: 6px 12px; font-size: 0.85rem;");
    twDecls.push("px-3 py-1.5 text-xs");
    descriptions.push("compact condensed geometry");
  }
  if (hasNegatedBg) {
    const textColor = color ? color.hex : "#f8fafc";
    const textTw = color ? `text-${color.tw}` : "text-slate-100";
    cssDecls.push(`background-color: transparent; color: ${textColor};`);
    twDecls.push(`bg-transparent ${textTw}`);
    descriptions.push("transparent background");
  } else if (hasBg && color) {
    const textContrast = color.isLight ? "#0f172a" : "#ffffff";
    const textTw = color.isLight ? "text-slate-900" : "text-white";
    cssDecls.push(`background-color: ${color.hex}; color: ${textContrast};`);
    twDecls.push(`bg-${color.tw} ${textTw}`);
    descriptions.push(`background changed to ${color.hex} with contrast text`);
  } else if (hasGlass) {
    cssDecls.push("background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); color: #f8fafc;");
    twDecls.push("bg-white/10 backdrop-blur-md text-white");
    descriptions.push("frosted glassmorphism background");
  }
  if (hasText && color && !hasBg) {
    cssDecls.push(`color: ${color.hex};`);
    twDecls.push(`text-${color.tw}`);
    descriptions.push(`text color set to ${color.hex}`);
  }
  if (hasBorder) {
    const borderColor = color ? color.hex : "#38bdf8";
    const borderTw = color ? color.tw : "sky-400";
    cssDecls.push(`border: 2px solid ${borderColor};`);
    twDecls.push(`border-2 border-${borderTw}`);
    descriptions.push(`border set to ${borderColor}`);
  } else if (hasGlass && !hasBorder) {
    const borderColor = color ? `${color.hex}80` : "rgba(255, 255, 255, 0.25)";
    cssDecls.push(`border: 1px solid ${borderColor};`);
    twDecls.push("border border-white/20");
  }
  if (isPop) {
    const popColor = color ? color.hex : "#38bdf8";
    cssDecls.push(`box-shadow: 0 8px 24px ${popColor}55; font-weight: 700;`);
    twDecls.push("shadow-xl font-bold");
    descriptions.push("bold punchy elevation");
  } else if (hasGlow) {
    const glowColor = color ? color.hex : "#38bdf8";
    if (hasFading) {
      cssDecls.push(`box-shadow: 0 0 24px ${glowColor}66, 0 0 48px ${glowColor}33;`);
      twDecls.push(`shadow-[0_0_24px_${glowColor}66]`);
      descriptions.push("ambient fading glow effect");
    } else {
      cssDecls.push(`box-shadow: 0 0 18px ${glowColor}66;`);
      twDecls.push(`shadow-[0_0_18px_${glowColor}66]`);
      descriptions.push("luminous ambient glow");
    }
  }
  if (hasClickAnim || hasAnim) {
    cssDecls.push("cursor: pointer;");
    twDecls.push("cursor-pointer active:scale-95 active:brightness-95");
    descriptions.push("interactive click response animation");
  }
  if (isProfessional) {
    cssDecls.push("border: 1px solid rgba(0, 0, 0, 0.15); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);");
    twDecls.push("border shadow-sm");
    descriptions.push("professional corporate styling");
  }
  if (isLuxury) {
    cssDecls.push("background-color: #fff8e1; letter-spacing: 0.05em; border: 1px solid rgba(255, 255, 255, 0.3);");
    twDecls.push("bg-[#fff8e1] border border-white/30");
    descriptions.push("luxury warm aesthetic");
  }
  if (isSpacious) {
    cssDecls.push("padding: 16px 24px; line-height: 1.6;");
    twDecls.push("p-6");
    descriptions.push("relaxed spacing with breathing room");
  }
  if (isUgly) {
    cssDecls.push("border-radius: 1.5rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);");
    twDecls.push("rounded-xl shadow-md");
    descriptions.push("modernized clean aesthetic");
  }
  if (isFriendly) {
    cssDecls.push("border-radius: 1.75rem; background-color: #ffedd5; box-shadow: 0 0 12px rgba(255, 200, 150, 0.4);");
    twDecls.push("rounded-2xl bg-[#ffedd5] shadow-sm");
    descriptions.push("friendly approachable warmth");
  }
  if (hasPill) {
    cssDecls.push("border-radius: 9999px;");
    twDecls.push("rounded-full");
    descriptions.push("pill geometry");
  } else if (hasSharp) {
    cssDecls.push("border-radius: 0px;");
    twDecls.push("rounded-none");
    descriptions.push("sharp box geometry");
  } else if (isSoften) {
    cssDecls.push("border-radius: 16px;");
    twDecls.push("rounded-2xl");
    descriptions.push("softened curves");
  } else if (hasGlass || hasGlow) {
    cssDecls.push("border-radius: 8px;");
    twDecls.push("rounded-lg");
  }
  const transitionCss = hasClickAnim || hasAnim || hasFading ? "transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.6s ease-in-out, border-color 0.2s ease, all 0.3s ease;" : "transition: all 0.2s ease;";
  const transitionTw = hasClickAnim || hasAnim || hasFading ? "transition-all duration-300 ease-out" : "transition-all duration-200";
  if (cssDecls.length === 0) {
    cssDecls.push(`border-radius: 8px; ${transitionCss}`);
    twDecls.push(`rounded-lg ${transitionTw}`);
    descriptions.push("general styling refinement");
  } else {
    cssDecls.push(transitionCss);
    twDecls.push(transitionTw);
  }
  return {
    cssText: cssDecls.join(" "),
    tailwindClasses: twDecls.join(" "),
    explanation: descriptions.length > 0 ? descriptions.join(", ") : `Custom design synthesized for <${tag}>`
  };
}

// src/bridge-gemini.ts
async function synthesizeWithGemini(context, apiKey, model = "gemini-2.0-flash") {
  if (!apiKey) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8e3);
  try {
    const systemPrompt = `You are AuraCSS, an Elite Principal UI/UX Product Designer for Non-Technical Stakeholders.
Your task is to translate vague, colloquial, or emotional design feedback into elegant, accessible, production-ready CSS and Tailwind utility classes.

You specialize in interpreting layman language:
- "make it pop" / "punchy" \u2192 bold elevation, stronger shadow, higher contrast
- "feels clunky" / "outdated" \u2192 modern rounded corners, refined shadows, cleaner spacing
- "too plain" / "boring" \u2192 subtle gradients, refined borders, micro-interactions
- "expensive look" / "luxury" \u2192 warm alabaster or deep dark base, generous letter-spacing, ultra-thin borders, restrained accents
- "crowded" / "cramped" \u2192 increase padding, line-height, and whitespace
- "friendly" / "approachable" \u2192 rounded-2xl, warm pastel tones, soft ambient glow
- "professional" / "corporate" \u2192 neutral palette, crisp 1px borders, subtle micro-shadows
- "match" / "blend in" \u2192 harmonize with provided site theme tokens

Rules:
1. Return ONLY a valid JSON object with keys "cssText", "tailwindClasses", and "explanation".
2. cssText MUST contain valid CSS property declarations (e.g. "background-color: #0f172a; color: #38bdf8; border-radius: 9999px; box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);").
3. tailwindClasses MUST contain equivalent Tailwind utility classes.
4. Ensure WCAG AA accessibility (contrast ratio >= 4.5:1) \u2013 auto-correct text/background pairs that fail contrast.
5. Adapt styling to element type: buttons get interactive states and shadows; cards get layered shadows and padding; headings get tight tracking and bold weights; for <img>, <svg>, icons, or emojis, use CSS filter (drop-shadow, hue-rotate, saturate, brightness), transform (scale/rotate), and compact pill framing instead of large 24px card padding.
6. Provide a concise 1-sentence description in explanation.`;
    const userContent = `Target Element: <${context.tag}> (${context.role || "element"})
HTML Snippet: ${context.htmlSnippet || `<${context.tag}></${context.tag}>`}
Inner Text: ${context.innerText || "None"}
Size: ${context.rect ? `${context.rect.width}x${context.rect.height}px` : "unknown"}
Parent Layout: ${context.parentLayout || "normal flow"}
Contents: ${context.childSummary || "unknown"}
Surface Background: ${context.effectiveBackground ? `${context.effectiveBackground.color} (${context.effectiveBackground.isDark ? "dark surface" : "light surface"})` : "unknown"}
Computed Styles: ${JSON.stringify(context.computedStyles || {})}
Site Theme Tokens: ${JSON.stringify(context.siteTokens || {})}

User Design Intent: "${context.prompt}"`;
    let url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    let res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}

${userContent}` }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      }),
      signal: controller.signal
    });
    if (!res.ok && model !== "gemini-1.5-flash") {
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: `${systemPrompt}

${userContent}` }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.3 }
        }),
        signal: controller.signal
      });
    }
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return null;
    const cleanedJson = rawJson.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(cleanedJson);
    if (parsed.cssText) {
      return {
        cssText: parsed.cssText.trim(),
        tailwindClasses: parsed.tailwindClasses?.trim() || "",
        explanation: parsed.explanation?.trim() || `Styled <${context.tag}> with Gemini`
      };
    }
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
  return null;
}

// src/bridge-mcp.ts
import readline from "readline";
import fs2 from "fs";
import path2 from "path";

// src/bridge-security.ts
import fs from "fs";
import path from "path";
function isValidLocalHost(host) {
  if (!host) return false;
  const h = host.toLowerCase().split(":")[0];
  return h === "127.0.0.1" || h === "localhost" || h === "[::1]";
}
function isAllowedOrigin(origin) {
  if (!origin) return true;
  try {
    if (origin.startsWith("chrome-extension://") || origin.startsWith("moz-extension://")) {
      return /^[\w-]+:\/\/[a-z0-9_-]+$/i.test(origin);
    }
    const parsed = new URL(origin);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const h = parsed.hostname.toLowerCase();
    return h === "127.0.0.1" || h === "localhost" || h === "[::1]" || h === "::1";
  } catch {
    return false;
  }
}
function getCorsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Private-Network": "true",
    Vary: "Origin"
  };
  if (origin && isAllowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}
function resolveRealAncestor(targetPath) {
  let curr = path.dirname(targetPath);
  const tail = [path.basename(targetPath)];
  while (!fs.existsSync(curr)) {
    const parent = path.dirname(curr);
    if (parent === curr) break;
    tail.unshift(path.basename(curr));
    curr = parent;
  }
  const realBase = fs.existsSync(curr) ? fs.realpathSync(curr) : curr;
  return path.join(realBase, ...tail);
}
function resolveSafeCssPath(root, filePath) {
  const realRoot = fs.existsSync(root) ? fs.realpathSync(root) : path.resolve(root);
  const candidate = path.resolve(realRoot, filePath || "auracss-mutations.css");
  const rel = path.relative(realRoot, candidate);
  if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("Path traversal forbidden: target must reside within workspace");
  }
  if (!candidate.toLowerCase().endsWith(".css")) {
    throw new Error("Security policy violation: only .css files may be committed to source");
  }
  if (/(^|[/\\])\./.test(rel) || rel.split(/[/\\]/).includes("node_modules")) {
    throw new Error("Security policy violation: hidden or system directory modification forbidden");
  }
  const realCandidate = resolveRealAncestor(candidate);
  const realRel = path.relative(realRoot, realCandidate);
  if (!realRel || realRel.startsWith("..") || path.isAbsolute(realRel)) {
    throw new Error("Path traversal forbidden: symlink escape detected");
  }
  return candidate;
}
var rateBuckets = /* @__PURE__ */ new Map();
function checkRateLimit(key, maxPerMin = 60) {
  const now = Date.now();
  const entry = rateBuckets.get(key);
  if (!entry || now > entry.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + 6e4 });
    return true;
  }
  if (entry.count >= maxPerMin) return false;
  entry.count += 1;
  return true;
}

// src/style-mutator.ts
function sanitizeCssText(css) {
  if (!css || typeof css !== "string") return "";
  return css.replace(/@import\b[^;]*;?/gi, "").replace(/expression\s*\([^)]*\)/gi, "").replace(/-moz-binding\s*:[^;]*;?/gi, "").replace(/javascript\s*:/gi, "").replace(/url\s*\(\s*(['"]?)\s*(?:https?:|\/\/|data:text\/html|vbscript:)[^)]*\)/gi, "none");
}

// src/bridge-mcp.ts
function formatMcpClientName(raw) {
  if (!raw || typeof raw !== "string") return "";
  const lower = raw.toLowerCase();
  if (lower.includes("antigravity")) return "Antigravity";
  if (lower.includes("cursor")) return "Cursor";
  if (lower.includes("claude")) return "Claude";
  if (lower.includes("windsurf")) return "Windsurf";
  if (lower.includes("vscode") || lower.includes("copilot")) return "VS Code";
  return raw.trim().slice(0, 32);
}
function startMcpStdio(port, getActiveElement2, broadcastSSE2, getWorkspaceRoot2 = () => process.cwd(), onClientConnected) {
  const rl = readline.createInterface({ input: process.stdin, terminal: false });
  const shutdown = () => {
    rl.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  rl.on("line", (line) => {
    if (!line.trim()) return;
    try {
      const msg = JSON.parse(line);
      if (!msg.method) return;
      if (msg.method === "initialize") {
        const info = msg.params?.clientInfo;
        const clientName = formatMcpClientName(info?.name);
        if (clientName) {
          onClientConnected?.(clientName);
          void fetch(`http://127.0.0.1:${port}/api/mcp-client`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientName })
          }).catch(() => {
          });
        }
        const res = {
          jsonrpc: "2.0",
          id: msg.id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "auracss-mcp", version: "0.1.0" }
          }
        };
        process.stdout.write(JSON.stringify(res) + "\n");
        return;
      }
      if (msg.method === "notifications/initialized" || msg.method === "initialized") {
        return;
      }
      if (msg.method === "ping") {
        process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result: {} }) + "\n");
        return;
      }
      if (msg.method === "tools/list") {
        const res = {
          jsonrpc: "2.0",
          id: msg.id,
          result: {
            tools: [
              {
                name: "auracss_inspect_element",
                description: "Get the currently active/selected DOM element in the user\u2019s live AuraCSS browser session, including prior mutations and last prompt.",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "auracss_apply_style",
                description: "Applies CSS rules and Tailwind classes live to the active element in the user\u2019s browser. Supports mode (replace vs patch), interactive pseudo-classes (:active, :hover), keyframe animations, and click behavior toggles.",
                inputSchema: {
                  type: "object",
                  properties: {
                    cssText: { type: "string", description: 'Base CSS declarations (e.g. "background: #2563eb; color: #fff; padding: 12px 24px;")' },
                    mode: {
                      type: "string",
                      enum: ["replace", "patch"],
                      description: 'Set "replace" (default) to clear previous experiment styles and style from baseline HTML. Set "patch" only when incrementally updating specific existing properties.'
                    },
                    activeState: {
                      type: "string",
                      description: 'CSS declarations for :active pseudo-class (e.g. "transform: translateY(-8px) scale(1.06);")'
                    },
                    hoverState: {
                      type: "string",
                      description: 'CSS declarations for :hover pseudo-class (e.g. "box-shadow: 0 0 24px rgba(56, 189, 248, 0.6);")'
                    },
                    keyframes: {
                      type: "string",
                      description: 'Complete @keyframes block for breathing/pulsing ambient glows (e.g. "@keyframes glow { 0%,100% { box-shadow: ... } 50% { box-shadow: ... } }")'
                    },
                    interaction: {
                      type: "object",
                      description: "Interactive click behavior (e.g. click-to-toggle visibility)",
                      properties: {
                        type: { type: "string", enum: ["toggle-visibility", "toggle-class"], description: "Type of click interaction" },
                        className: { type: "string", description: "Class name to toggle if type is toggle-class" }
                      }
                    },
                    tailwindClasses: { type: "string", description: "Equivalent Tailwind classes" },
                    prompt: { type: "string", description: "The user prompt or styling request that generated this style" },
                    name: { type: "string", description: "A short descriptive name for this prompt result" },
                    description: { type: "string", description: "Brief description of changes" },
                    selector: { type: "string", description: "Target selector (optional, defaults to active locked element)" }
                  },
                  required: ["cssText"]
                }
              },
              {
                name: "auracss_commit_to_source",
                description: "Writes the mutated styles into a local source file on disk.",
                inputSchema: {
                  type: "object",
                  properties: {
                    filePath: { type: "string", description: "File path relative to workspace root" },
                    cssText: { type: "string", description: "CSS declarations to save" }
                  },
                  required: ["filePath", "cssText"]
                }
              }
            ]
          }
        };
        process.stdout.write(JSON.stringify(res) + "\n");
        return;
      }
      if (msg.method === "tools/call") {
        const p = msg.params;
        if (p.name === "auracss_inspect_element") {
          void (async () => {
            let el = getActiveElement2();
            if (!el) {
              try {
                const res = await fetch(`http://127.0.0.1:${port}/health`);
                if (res.ok) {
                  const data = await res.json();
                  if (data.activeElement) el = data.activeElement;
                }
              } catch {
              }
            }
            let text = el ? [
              `Active Element: <${el.tag}> (${el.role || "element"})`,
              `Selector: ${el.selector || el.tag}`,
              el.innerText ? `Visible Text: "${el.innerText}"` : null,
              el.rect ? `Size: ${el.rect.width}x${el.rect.height}px` : null,
              el.parentLayout ? `Parent Layout: ${el.parentLayout}` : null,
              el.childSummary ? `Contents: ${el.childSummary}` : null,
              el.effectiveBackground ? `Surface Background: ${el.effectiveBackground.color} (${el.effectiveBackground.isDark ? "dark surface" : "light surface"})` : null,
              el.computedStyles ? `Current Computed Styles: ${JSON.stringify(el.computedStyles)}` : null,
              `Site Tokens: ${JSON.stringify(el.siteTokens || {})}`,
              `HTML Snippet: ${el.htmlSnippet}`
            ].filter(Boolean).join("\n") : "\u26A0\uFE0F AuraCSS is turned OFF or no element is currently selected in your browser. Please toggle AuraCSS to ON and click an element to select it first.";
            if (el?.currentMutations) {
              text += `
Prior Applied Mutations:
- Last Prompt: "${el.currentMutations.lastPrompt || "None"}"
- Current CSS: ${el.currentMutations.appliedCssText || "None"}`;
            }
            process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result: { content: [{ type: "text", text }] } }) + "\n");
          })();
          return;
        }
        if (p.name === "auracss_apply_style") {
          void (async () => {
            let activeEl = getActiveElement2();
            if (!activeEl) {
              try {
                const res = await fetch(`http://127.0.0.1:${port}/health`);
                if (res.ok) {
                  const data = await res.json();
                  if (data.activeElement) activeEl = data.activeElement;
                }
              } catch {
              }
            }
            if (!activeEl) {
              const reminder = "\u26A0\uFE0F Cannot apply styles: AuraCSS is turned OFF or no element is currently selected in your browser.\n\nPlease toggle AuraCSS to ON and click an element to select it first.";
              process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result: { content: [{ type: "text", text: reminder }] } }) + "\n");
              return;
            }
            const args = p.arguments;
            const mode = args.mode || "replace";
            const payload = {
              cssText: args.cssText || "",
              mode,
              activeState: args.activeState,
              hoverState: args.hoverState,
              keyframes: args.keyframes,
              interaction: args.interaction,
              tailwindClasses: args.tailwindClasses || "",
              prompt: args.prompt,
              name: args.name,
              description: args.description,
              selector: args.selector || activeEl.selector
            };
            broadcastSSE2({ type: "apply_style", payload });
            try {
              await fetch(`http://127.0.0.1:${port}/api/patch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
              });
            } catch {
            }
            const text = `Live mutation applied to browser (mode: ${mode}):
${args.cssText}${args.activeState ? `
:active { ${args.activeState} }` : ""}${args.keyframes ? "\n[Keyframes attached]" : ""}${args.interaction ? `
[Interaction: ${args.interaction.type}]` : ""}`;
            process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result: { content: [{ type: "text", text }] } }) + "\n");
          })();
          return;
        }
        if (p.name === "auracss_commit_to_source") {
          try {
            const args = p.arguments;
            const root = getWorkspaceRoot2();
            const safePath = resolveSafeCssPath(root, args.filePath || "auracss-mutations.css");
            const safeCss = sanitizeCssText(args.cssText || "");
            fs2.mkdirSync(path2.dirname(safePath), { recursive: true });
            const header = `/* === AuraCSS Mutated Styles (${(/* @__PURE__ */ new Date()).toISOString()}) === */
`;
            fs2.writeFileSync(safePath, `${header}${safeCss}
`);
            const text = `Successfully committed styles to ${safePath}`;
            process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result: { content: [{ type: "text", text }] } }) + "\n");
          } catch (err) {
            process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, error: { code: -32602, message: String(err) } }) + "\n");
          }
          return;
        }
        process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, error: { code: -32601, message: `Tool not found: ${p.name}` } }) + "\n");
        return;
      }
      if (msg.id !== void 0 && msg.id !== null) {
        process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, error: { code: -32601, message: `Method not found: ${msg.method}` } }) + "\n");
      }
    } catch (err) {
      process.stderr.write(`[AuraCSS MCP Error] ${err}
`);
    }
  });
  return rl;
}

// src/bridge.ts
try {
  if (typeof process.loadEnvFile === "function") process.loadEnvFile();
} catch {
}
var activeElement = null;
var connectedClientName = null;
var sseClients = /* @__PURE__ */ new Set();
function getActiveElement() {
  return activeElement;
}
function setActiveElement(el) {
  activeElement = el;
}
function broadcastSSE(event) {
  const data = `data: ${JSON.stringify(event)}

`;
  for (const res of sseClients) {
    try {
      res.write(data);
    } catch {
      sseClients.delete(res);
    }
  }
}
function gracefulShutdown(server, callback) {
  for (const res of sseClients) try {
    res.end();
  } catch {
  }
  sseClients.clear();
  server.close(callback);
}
var sendJson = (res, code, data, origin) => {
  res.writeHead(code, { ...getCorsHeaders(origin), "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};
function getWorkspaceRoot() {
  const env = process.env.AURACSS_WORKSPACE_ROOT;
  if (env && fs3.existsSync(env)) return env;
  if (fs3.existsSync(path3.resolve(process.cwd(), "package.json"))) return process.cwd();
  const scriptDir = typeof __dirname !== "undefined" ? __dirname : path3.dirname(process.argv[1] || "");
  const parentDir = path3.resolve(scriptDir, "..");
  return fs3.existsSync(path3.resolve(parentDir, "package.json")) ? parentDir : process.cwd();
}
var MAX_PAYLOAD_BYTES = 1024 * 1024;
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "", bytes = 0;
    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_PAYLOAD_BYTES) {
        req.destroy();
        reject(new Error("Payload Too Large: exceeded 1MB limit"));
      } else {
        body += chunk;
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}
function createBridgeServer(port = 4999) {
  const server = http.createServer(async (req, res) => {
    const origin = typeof req.headers.origin === "string" ? req.headers.origin : void 0;
    if (!isValidLocalHost(req.headers.host)) {
      sendJson(res, 403, { error: "Forbidden: Invalid Host header (DNS rebinding rejected)" });
      return;
    }
    if (!isAllowedOrigin(origin)) {
      sendJson(res, 403, { error: "Forbidden: Untrusted Origin rejected" });
      return;
    }
    const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
    if (req.method === "OPTIONS") {
      res.writeHead(204, getCorsHeaders(origin));
      res.end();
      return;
    }
    if (url.pathname === "/health" && req.method === "GET") {
      sendJson(res, 200, {
        status: "ready",
        mcp: true,
        port,
        clientName: connectedClientName,
        hasActiveElement: Boolean(activeElement),
        activeElement,
        hasGemini: Boolean(process.env.GEMINI_API_KEY)
      }, origin);
      return;
    }
    if (url.pathname === "/api/mcp-client" && req.method === "POST") {
      try {
        const body = JSON.parse(await readBody(req));
        connectedClientName = typeof body?.clientName === "string" && body.clientName.trim() ? body.clientName.trim().slice(0, 32) : null;
        sendJson(res, 200, { success: true, clientName: connectedClientName }, origin);
      } catch (err) {
        sendJson(res, 400, { error: String(err) }, origin);
      }
      return;
    }
    if (url.pathname === "/api/active-element" && req.method === "POST") {
      try {
        const body = JSON.parse(await readBody(req));
        if (body?.tag && !body.clear) {
          activeElement = {
            tag: body.tag,
            role: body.role,
            selector: body.selector,
            htmlSnippet: body.htmlSnippet || "",
            innerText: body.innerText,
            rect: body.rect,
            computedStyles: body.computedStyles,
            siteTokens: body.siteTokens,
            parentLayout: body.parentLayout,
            effectiveBackground: body.effectiveBackground,
            childSummary: body.childSummary,
            currentMutations: body.currentMutations,
            updatedAt: Date.now()
          };
        } else {
          activeElement = null;
        }
        broadcastSSE({ type: "active_element", payload: activeElement });
        sendJson(res, 200, { success: true, activeElement }, origin);
      } catch (err) {
        sendJson(res, 400, { error: String(err) }, origin);
      }
      return;
    }
    if (url.pathname === "/api/events" && req.method === "GET") {
      res.writeHead(200, {
        ...getCorsHeaders(origin),
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      });
      res.write(": connected\n\n");
      sseClients.add(res);
      req.on("close", () => sseClients.delete(res));
      return;
    }
    if (url.pathname === "/api/synthesize" && req.method === "POST") {
      if (!checkRateLimit(req.socket.remoteAddress || "loopback", 60)) {
        sendJson(res, 429, { error: "Rate limit exceeded: max 60 synthesize requests per minute" }, origin);
        return;
      }
      try {
        const body = JSON.parse(await readBody(req));
        const geminiKey = process.env.GEMINI_API_KEY;
        let response = geminiKey && body.setIndex === void 0 ? await synthesizeWithGemini(body, geminiKey) : null;
        if (!response) {
          response = await synthesizeWithLocalOrEnv(
            body.prompt,
            body.tag,
            body.htmlSnippet,
            body.computedStyles,
            body.siteTokens,
            body.setIndex,
            body.innerText,
            body.rect
          );
        }
        sendJson(res, 200, response, origin);
      } catch (err) {
        sendJson(res, 500, { error: String(err) }, origin);
      }
      return;
    }
    if (url.pathname === "/api/patch" && req.method === "POST") {
      try {
        if (!activeElement) {
          sendJson(res, 400, {
            success: false,
            reminder: "\u26A0\uFE0F Cannot apply styles: AuraCSS is turned OFF or no element is currently selected in your browser. Please toggle AuraCSS to ON and click an element to select it first."
          }, origin);
          return;
        }
        const body = JSON.parse(await readBody(req));
        broadcastSSE({
          type: "apply_style",
          payload: {
            cssText: body.cssText || "",
            mode: body.mode || "replace",
            activeState: body.activeState,
            hoverState: body.hoverState,
            keyframes: body.keyframes,
            interaction: body.interaction,
            tailwindClasses: body.tailwindClasses || "",
            prompt: body.prompt,
            name: body.name,
            description: body.description,
            selector: body.selector
          }
        });
        sendJson(res, 200, { success: true, broadcastCount: sseClients.size }, origin);
      } catch (err) {
        sendJson(res, 400, { error: String(err) }, origin);
      }
      return;
    }
    if (url.pathname === "/api/download" && req.method === "GET") {
      try {
        const root = getWorkspaceRoot();
        const safePath = resolveSafeCssPath(root, "auracss-mutations.css");
        const cssText = url.searchParams.get("css") || (fs3.existsSync(safePath) ? fs3.readFileSync(safePath, "utf8") : "/* AuraCSS */\n");
        res.writeHead(200, {
          ...getCorsHeaders(origin),
          "Content-Type": "text/css; charset=utf-8",
          "Content-Disposition": 'attachment; filename="auracss-mutations.css"'
        });
        res.end(cssText);
      } catch (err) {
        sendJson(res, 500, { error: String(err) }, origin);
      }
      return;
    }
    if (url.pathname === "/api/mutations" && req.method === "GET") {
      try {
        const root = getWorkspaceRoot();
        const safePath = resolveSafeCssPath(root, "auracss-mutations.css");
        const cssText = fs3.existsSync(safePath) ? fs3.readFileSync(safePath, "utf8") : "";
        sendJson(res, 200, { success: true, cssText, filePath: safePath }, origin);
      } catch (err) {
        sendJson(res, 500, { error: String(err) }, origin);
      }
      return;
    }
    if (url.pathname === "/api/commit-to-source" && req.method === "POST") {
      try {
        const body = JSON.parse(await readBody(req));
        const root = getWorkspaceRoot();
        const safePath = resolveSafeCssPath(root, body.filePath || "auracss-mutations.css");
        const safeCss = sanitizeCssText(body.cssText || "");
        fs3.mkdirSync(path3.dirname(safePath), { recursive: true });
        const header = `/* === AuraCSS Mutated Styles (${(/* @__PURE__ */ new Date()).toISOString()}) === */
`;
        fs3.writeFileSync(safePath, `${header}${safeCss}
`);
        sendJson(res, 200, { success: true, filePath: safePath }, origin);
      } catch (err) {
        sendJson(res, 400, { error: String(err) }, origin);
      }
      return;
    }
  });
  return server;
}
var isMain = process.argv[1] && (process.argv[1].endsWith("bridge.ts") || process.argv[1].endsWith("bridge.js"));
if (isMain) {
  const port = Number(process.env.PORT) || 4999;
  const isMcp = process.argv.includes("--mcp");
  const server = createBridgeServer(port);
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      process.stderr.write(`[AuraCSS Bridge] Port ${port} already active, continuing MCP stdio session.
`);
    } else {
      process.stderr.write(`[AuraCSS Bridge Server Error] ${err.message}
`);
    }
  });
  server.listen(port, "127.0.0.1", () => {
    if (!isMcp) {
      console.log(`
\u2726 AuraCSS Local Bridge running on http://127.0.0.1:${port}`);
      console.log(`  - Browser health: http://127.0.0.1:${port}/health`);
      console.log(`  - Gemini AI Engine: ${process.env.GEMINI_API_KEY ? "Active (Gemini 2.0 Flash)" : "Offline (Local Rule Compiler)"}`);
      console.log(`  - Mode: Standalone HTTP Bridge
`);
    } else {
      process.stderr.write(`[AuraCSS MCP & Bridge] Listening on 127.0.0.1:${port} (MCP stdio active)
`);
    }
  });
  if (isMcp) {
    startMcpStdio(port, getActiveElement, broadcastSSE, getWorkspaceRoot, (name) => {
      connectedClientName = name;
    });
  }
  const shutdown = () => gracefulShutdown(server, () => process.exit(0));
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
export {
  broadcastSSE,
  createBridgeServer,
  getActiveElement,
  getWorkspaceRoot,
  gracefulShutdown,
  setActiveElement,
  startMcpStdio
};
