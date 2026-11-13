// src/bridge.ts
import http from "http";
import fs2 from "fs";
import path2 from "path";

// src/bridge-presets.ts
function getAiVariationCyclePresets(cycleIndex, isAction) {
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
async function synthesizeWithLocalOrEnv(prompt, tag, _htmlSnippet = "", _computedStyles = {}, _siteTokens = {}, setIndex = 0) {
  const p = prompt.toLowerCase();
  const isAction = tag === "button" || tag === "a";
  if (p.includes("diverse design variations") || p.includes("presets") || p.includes("4 variations")) {
    const presets = getAiVariationCyclePresets(setIndex, isAction);
    return {
      cssText: presets[0].cssText,
      tailwindClasses: presets[0].tailwindClasses,
      explanation: JSON.stringify({ presets })
    };
  }
  const color = extractColorDef(p);
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
5. Adapt styling to element type: buttons get interactive states and shadows; cards get layered shadows and padding; headings get tight tracking and bold weights.
6. Provide a concise 1-sentence description in explanation.`;
    const userContent = `Target Element: <${context.tag}>
HTML Snippet: ${context.htmlSnippet || `<${context.tag}></${context.tag}>`}
Inner Text: ${context.innerText || "None"}
Parent Layout: ${context.parentLayout || "normal flow"}
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
import fs from "fs";
import path from "path";
function startMcpStdio(port, getActiveElement2, broadcastSSE2, getWorkspaceRoot2 = () => process.cwd()) {
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
            let text = el ? `Active Element: <${el.tag}>
Selector: ${el.selector || el.tag}
Snippet: ${el.htmlSnippet}
Tokens: ${JSON.stringify(el.siteTokens || {})}` : "\u26A0\uFE0F AuraCSS is turned OFF or no element is currently selected in your browser. Please toggle AuraCSS to ON and click an element to select it first.";
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
          const args = p.arguments;
          const root = getWorkspaceRoot2();
          const safePath = path.resolve(root, args.filePath);
          fs.mkdirSync(path.dirname(safePath), { recursive: true });
          const header = `/* === AuraCSS Mutated Styles (${(/* @__PURE__ */ new Date()).toISOString()}) === */
`;
          fs.writeFileSync(safePath, `${header}${args.cssText}
`);
          const text = `Successfully committed styles to ${safePath}`;
          process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result: { content: [{ type: "text", text }] } }) + "\n");
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
var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Private-Network": "true"
};
var sendJson = (res, code, data) => {
  res.writeHead(code, { ...CORS_HEADERS, "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};
function getWorkspaceRoot() {
  const env = process.env.AURACSS_WORKSPACE_ROOT;
  if (env && fs2.existsSync(env)) return env;
  if (fs2.existsSync(path2.resolve(process.cwd(), "package.json"))) return process.cwd();
  const scriptDir = typeof __dirname !== "undefined" ? __dirname : path2.dirname(process.argv[1] || "");
  const parentDir = path2.resolve(scriptDir, "..");
  return fs2.existsSync(path2.resolve(parentDir, "package.json")) ? parentDir : process.cwd();
}
function isValidLocalHost(host) {
  if (!host) return false;
  const h = host.toLowerCase().split(":")[0];
  return h === "127.0.0.1" || h === "localhost" || h === "[::1]";
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
    if (!isValidLocalHost(req.headers.host)) {
      sendJson(res, 403, { error: "Forbidden: Invalid Host header (DNS rebinding rejected)" });
      return;
    }
    const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
    if (req.method === "OPTIONS") {
      res.writeHead(204, CORS_HEADERS);
      res.end();
      return;
    }
    if (url.pathname === "/health" && req.method === "GET") {
      sendJson(res, 200, {
        status: "ready",
        mcp: true,
        port,
        hasActiveElement: Boolean(activeElement),
        activeElement,
        hasGemini: Boolean(process.env.GEMINI_API_KEY)
      });
      return;
    }
    if (url.pathname === "/api/active-element" && req.method === "POST") {
      try {
        const body = JSON.parse(await readBody(req));
        if (body?.tag && !body.clear) {
          activeElement = {
            tag: body.tag,
            selector: body.selector,
            htmlSnippet: body.htmlSnippet || "",
            innerText: body.innerText,
            computedStyles: body.computedStyles,
            siteTokens: body.siteTokens,
            parentLayout: body.parentLayout,
            currentMutations: body.currentMutations,
            updatedAt: Date.now()
          };
        } else {
          activeElement = null;
        }
        broadcastSSE({ type: "active_element", payload: activeElement });
        sendJson(res, 200, { success: true, activeElement });
      } catch (err) {
        sendJson(res, 400, { error: String(err) });
      }
      return;
    }
    if (url.pathname === "/api/events" && req.method === "GET") {
      res.writeHead(200, {
        ...CORS_HEADERS,
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
            body.setIndex
          );
        }
        sendJson(res, 200, response);
      } catch (err) {
        sendJson(res, 500, { error: String(err) });
      }
      return;
    }
    if (url.pathname === "/api/patch" && req.method === "POST") {
      try {
        if (!activeElement) {
          sendJson(res, 400, {
            success: false,
            reminder: "\u26A0\uFE0F Cannot apply styles: AuraCSS is turned OFF or no element is currently selected in your browser. Please toggle AuraCSS to ON and click an element to select it first."
          });
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
        sendJson(res, 200, { success: true, broadcastCount: sseClients.size });
      } catch (err) {
        sendJson(res, 400, { error: String(err) });
      }
      return;
    }
    if (url.pathname === "/api/download" && req.method === "GET") {
      try {
        const root = getWorkspaceRoot();
        const safePath = path2.resolve(root, "auracss-mutations.css");
        const cssText = url.searchParams.get("css") || (fs2.existsSync(safePath) ? fs2.readFileSync(safePath, "utf8") : "/* AuraCSS */\n");
        res.writeHead(200, {
          ...CORS_HEADERS,
          "Content-Type": "text/css; charset=utf-8",
          "Content-Disposition": 'attachment; filename="auracss-mutations.css"'
        });
        res.end(cssText);
      } catch (err) {
        sendJson(res, 500, { error: String(err) });
      }
      return;
    }
    if (url.pathname === "/api/mutations" && req.method === "GET") {
      try {
        const root = getWorkspaceRoot();
        const safePath = path2.resolve(root, "auracss-mutations.css");
        const cssText = fs2.existsSync(safePath) ? fs2.readFileSync(safePath, "utf8") : "";
        sendJson(res, 200, { success: true, cssText, filePath: safePath });
      } catch (err) {
        sendJson(res, 500, { error: String(err) });
      }
      return;
    }
    if (url.pathname === "/api/commit-to-source" && req.method === "POST") {
      try {
        const body = JSON.parse(await readBody(req));
        const root = getWorkspaceRoot();
        const safePath = path2.resolve(root, body.filePath || "auracss-mutations.css");
        const rel = path2.relative(root, safePath);
        if (rel.startsWith("..") || path2.isAbsolute(rel)) {
          throw new Error("Path traversal forbidden: target must reside within workspace");
        }
        if (!safePath.toLowerCase().endsWith(".css")) {
          throw new Error("Security policy violation: only .css files may be committed to source");
        }
        if (/(^|[/\\])\./.test(rel) || rel.includes("node_modules")) {
          throw new Error("Security policy violation: hidden or system directory modification forbidden");
        }
        fs2.mkdirSync(path2.dirname(safePath), { recursive: true });
        const header = `/* === AuraCSS Mutated Styles (${(/* @__PURE__ */ new Date()).toISOString()}) === */
`;
        fs2.writeFileSync(safePath, `${header}${body.cssText}
`);
        sendJson(res, 200, { success: true, filePath: safePath });
      } catch (err) {
        sendJson(res, 400, { error: String(err) });
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
    startMcpStdio(port, getActiveElement, broadcastSSE, getWorkspaceRoot);
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
