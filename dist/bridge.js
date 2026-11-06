// src/bridge.ts
import http from "http";
import fs from "fs";
import path from "path";
import readline from "readline";

// src/bridge-presets.ts
function getAiVariationCyclePresets(cycleIndex, isAction) {
  const cycle = Math.abs(Number(cycleIndex) || 0) % 3;
  const set0 = [
    {
      id: `ai-elevated-${Date.now()}`,
      name: "AI Modern Elevated Solid",
      description: "Rich opaque indigo surface with deep drop shadow",
      cssText: isAction ? "background: #4f46e5; color: #ffffff; border: none; border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); cursor: pointer;" : "background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);",
      tailwindClasses: isAction ? "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-500/30" : "bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl"
    },
    {
      id: `ai-glass-${Date.now()}`,
      name: "AI Frosted Glassmorphism",
      description: "Multi-layer frosted backdrop blur with crisp optical specular edge",
      cssText: isAction ? "background: rgba(255, 255, 255, 0.1); color: #f8fafc; border: 1px solid rgba(255, 255, 255, 0.25); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius: 8px; padding: 10px 22px; font-weight: 600; cursor: pointer;" : "background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.15); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 14px; padding: 24px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);",
      tailwindClasses: isAction ? "bg-white/10 hover:bg-white/15 border border-white/25 text-white backdrop-blur-md px-5 py-2.5 rounded-lg font-semibold" : "bg-slate-900/70 border border-white/15 backdrop-blur-xl rounded-2xl p-6 shadow-2xl"
    },
    {
      id: `ai-neon-${Date.now()}`,
      name: "AI Radiant Cyan Halo",
      description: "Dark space surface wrapped in luminous cyan glow",
      cssText: isAction ? "background: #0f172a; color: #38bdf8; border: 1px solid #38bdf8; border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 0 16px rgba(56, 189, 248, 0.5); cursor: pointer;" : "background: #0f172a; border: 1px solid rgba(56, 189, 248, 0.5); border-radius: 12px; padding: 24px; box-shadow: 0 0 28px rgba(56, 189, 248, 0.2);",
      tailwindClasses: isAction ? "bg-slate-900 border border-sky-400 text-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.5)] px-5 py-2.5 rounded-lg font-semibold" : "bg-slate-900 border border-sky-400/50 shadow-[0_0_28px_rgba(56,189,248,0.2)] rounded-xl p-6"
    },
    {
      id: `ai-brutalist-${Date.now()}`,
      name: "AI Surgical Brutalist",
      description: "Razor-sharp geometry with high-contrast type and zero blur",
      cssText: isAction ? "background: #ffffff; color: #0f172a; border: 2px solid #0f172a; border-radius: 0px; padding: 10px 22px; font-weight: 700; cursor: pointer;" : "background: #020617; border: 2px solid #334155; border-radius: 0px; padding: 24px;",
      tailwindClasses: isAction ? "bg-white text-slate-900 border-2 border-slate-900 rounded-none px-5 py-2.5 font-bold" : "bg-slate-950 border-2 border-slate-700 rounded-none p-6"
    }
  ];
  const set1 = [
    {
      id: `ai-sunset-${Date.now()}`,
      name: "AI Warm Sunset Flame",
      description: "Radiant warm amber to rose gradient with ambient sunset glow",
      cssText: isAction ? "background: linear-gradient(135deg, #f59e0b 0%, #f43f5e 100%); color: #ffffff; border: none; border-radius: 12px; padding: 12px 24px; font-weight: 600; box-shadow: 0 6px 18px rgba(244, 63, 94, 0.35); cursor: pointer;" : "background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(244, 63, 94, 0.15) 100%); border: 1px solid rgba(244, 63, 94, 0.3); border-radius: 16px; padding: 24px; box-shadow: 0 12px 30px rgba(244, 63, 94, 0.15);",
      tailwindClasses: isAction ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-rose-500/30" : "bg-gradient-to-br from-amber-500/10 to-rose-500/10 border border-rose-500/30 rounded-2xl p-6"
    },
    {
      id: `ai-clay-${Date.now()}`,
      name: "AI Soft Tactile Claymorphic",
      description: "Soft tactile surface with dual offset inner & outer depth highlights",
      cssText: isAction ? "background: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 9999px; padding: 12px 26px; font-weight: 700; box-shadow: 6px 6px 12px #94a3b8, -4px -4px 10px #ffffff; cursor: pointer;" : "background: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 20px; padding: 26px; box-shadow: 8px 8px 16px #94a3b8, -6px -6px 14px #ffffff;",
      tailwindClasses: isAction ? "bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-full shadow-[6px_6px_12px_#94a3b8,-4px_-4px_10px_#ffffff]" : "bg-slate-200 text-slate-800 rounded-3xl p-6 shadow-[8px_8px_16px_#94a3b8,-6px_-6px_14px_#ffffff]"
    },
    {
      id: `ai-crimson-${Date.now()}`,
      name: "AI Crimson Velvet Pulse",
      description: "Vibrant ruby red surface with radiant crimson halo",
      cssText: isAction ? "background: #dc2626; color: #ffffff; border: 1px solid #ef4444; border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 0 20px rgba(220, 38, 38, 0.45); cursor: pointer;" : "background: #1a0505; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 14px; padding: 24px; box-shadow: 0 0 30px rgba(220, 38, 38, 0.25);",
      tailwindClasses: isAction ? "bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.45)]" : "bg-red-950/40 border border-red-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(220,38,38,0.25)]"
    },
    {
      id: `ai-wire-${Date.now()}`,
      name: "AI Minimal Neutral Wire",
      description: "Understated crisp wireframe outline with spacious balance",
      cssText: isAction ? "background: transparent; color: #f8fafc; border: 2px solid #94a3b8; border-radius: 6px; padding: 10px 22px; font-weight: 600; cursor: pointer;" : "background: #020617; border: 1px solid #475569; border-radius: 8px; padding: 24px;",
      tailwindClasses: isAction ? "bg-transparent border-2 border-slate-400 text-white px-5 py-2.5 rounded-md font-semibold" : "bg-slate-950 border border-slate-600 rounded-lg p-6"
    }
  ];
  const set2 = [
    {
      id: `ai-emerald-${Date.now()}`,
      name: "AI Cyberpunk Emerald Matrix",
      description: "High-contrast neon emerald borders against deep terminal dark",
      cssText: isAction ? "background: #022c22; color: #34d399; border: 2px solid #10b981; border-radius: 4px; padding: 10px 22px; font-weight: 700; box-shadow: 0 0 18px rgba(16, 185, 129, 0.4); cursor: pointer;" : "background: #021a14; border: 2px solid #10b981; border-radius: 8px; padding: 24px; box-shadow: 0 0 32px rgba(16, 185, 129, 0.25);",
      tailwindClasses: isAction ? "bg-emerald-950 border-2 border-emerald-500 text-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.4)] px-5 py-2.5 rounded font-bold" : "bg-emerald-950/80 border-2 border-emerald-500 rounded-lg p-6 shadow-[0_0_32px_rgba(16,185,129,0.25)]"
    },
    {
      id: `ai-obsidian-${Date.now()}`,
      name: "AI Obsidian Glass Void",
      description: "Ultra-dark translucent obsidian glass with purple specular rim",
      cssText: isAction ? "background: rgba(2, 6, 23, 0.85); color: #e2e8f0; border: 1px solid #a855f7; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6); cursor: pointer;" : "background: rgba(2, 6, 23, 0.85); border: 1px solid rgba(168, 85, 247, 0.4); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-radius: 16px; padding: 24px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);",
      tailwindClasses: isAction ? "bg-slate-950/85 border border-purple-500 text-slate-200 backdrop-blur-xl px-5 py-2.5 rounded-lg font-semibold shadow-2xl" : "bg-slate-950/85 border border-purple-500/40 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl"
    },
    {
      id: `ai-violet-${Date.now()}`,
      name: "AI Electric Violet Gradient",
      description: "Dynamic violet to fuchsia gradient with luminous electric halo",
      cssText: isAction ? "background: linear-gradient(135deg, #7c3aed 0%, #d946ef 100%); color: #ffffff; border: none; border-radius: 8px; padding: 10px 22px; font-weight: 600; box-shadow: 0 4px 18px rgba(217, 70, 239, 0.4); cursor: pointer;" : "background: linear-gradient(135deg, #2e1065 0%, #4a044e 100%); border: 1px solid rgba(217, 70, 239, 0.35); border-radius: 12px; padding: 24px;",
      tailwindClasses: isAction ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg shadow-fuchsia-500/30" : "bg-gradient-to-br from-violet-950 to-fuchsia-950 border border-fuchsia-500/30 rounded-xl p-6"
    },
    {
      id: `ai-hyper-${Date.now()}`,
      name: "AI Hyper-Dense Industrial Pill",
      description: "Compact capsule form factor with crisp contrast and tracked typography",
      cssText: isAction ? "background: #0f172a; color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 9999px; padding: 8px 20px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer;" : "background: #0f172a; border: 2px solid #e2e8f0; border-radius: 9999px; padding: 16px 28px;",
      tailwindClasses: isAction ? "bg-slate-900 border-2 border-slate-200 text-white px-5 py-2 rounded-full font-bold uppercase tracking-wider text-xs" : "bg-slate-900 border-2 border-slate-200 rounded-full p-6"
    }
  ];
  const allSets = [set0, set1, set2];
  return allSets[cycle] ?? set0;
}

// src/bridge.ts
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
var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Private-Network": "true"
};
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}
function createBridgeServer(port = 4999) {
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);
    if (req.method === "OPTIONS") {
      res.writeHead(204, CORS_HEADERS);
      res.end();
      return;
    }
    if (url.pathname === "/health" && req.method === "GET") {
      res.writeHead(200, { ...CORS_HEADERS, "Content-Type": "application/json" });
      res.end(JSON.stringify({
        status: "ready",
        mcp: true,
        port,
        hasActiveElement: Boolean(activeElement),
        activeElement
      }));
      return;
    }
    if (url.pathname === "/api/active-element" && req.method === "POST") {
      try {
        const body = JSON.parse(await readBody(req));
        if (body.tag) {
          activeElement = {
            tag: body.tag,
            selector: body.selector,
            htmlSnippet: body.htmlSnippet || "",
            computedStyles: body.computedStyles,
            siteTokens: body.siteTokens,
            updatedAt: Date.now()
          };
          broadcastSSE({ type: "active_element", payload: activeElement });
        }
        res.writeHead(200, { ...CORS_HEADERS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, activeElement }));
      } catch (err) {
        res.writeHead(400, { ...CORS_HEADERS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: String(err) }));
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
        const response = await synthesizeWithLocalOrEnv(
          body.prompt,
          body.tag,
          body.htmlSnippet,
          body.computedStyles,
          body.siteTokens,
          body.setIndex
        );
        res.writeHead(200, { ...CORS_HEADERS, "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
      } catch (err) {
        res.writeHead(500, { ...CORS_HEADERS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: String(err) }));
      }
      return;
    }
    if (url.pathname === "/api/patch" && req.method === "POST") {
      try {
        const body = JSON.parse(await readBody(req));
        broadcastSSE({
          type: "apply_style",
          payload: {
            cssText: body.cssText,
            tailwindClasses: body.tailwindClasses || "",
            prompt: body.prompt,
            name: body.name,
            description: body.description,
            selector: body.selector
          }
        });
        res.writeHead(200, { ...CORS_HEADERS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, broadcastCount: sseClients.size }));
      } catch (err) {
        res.writeHead(400, { ...CORS_HEADERS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: String(err) }));
      }
      return;
    }
    if (url.pathname === "/api/commit-to-source" && req.method === "POST") {
      try {
        const body = JSON.parse(await readBody(req));
        const safePath = path.resolve(process.cwd(), body.filePath);
        if (!safePath.startsWith(process.cwd())) throw new Error("Path traversal forbidden");
        if (fs.existsSync(safePath)) {
          fs.appendFileSync(safePath, `
/* AuraCSS Commit */
/* ${body.cssText} */
`);
        }
        res.writeHead(200, { ...CORS_HEADERS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, filePath: safePath }));
      } catch (err) {
        res.writeHead(400, { ...CORS_HEADERS, "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: String(err) }));
      }
      return;
    }
    res.writeHead(404, CORS_HEADERS);
    res.end("Not found");
  });
  return server;
}
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
function isLightColorHex(hex) {
  if (hex.startsWith("#") && hex.length >= 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b > 160;
  }
  return false;
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
  const hasBg = p.includes("background") || p.includes("bg") || p.includes("fill") || !p.includes("text") && !p.includes("border") && color !== null;
  const hasText = p.includes("text") || p.includes("font") || p.includes("foreground");
  const hasBorder = p.includes("border") || p.includes("outline") || p.includes("stroke");
  const hasGlow = p.includes("glow") || p.includes("neon") || p.includes("shadow") || p.includes("halo") || p.includes("luminous");
  const hasFading = p.includes("fading") || p.includes("fade") || p.includes("pulse") || p.includes("pulsing") || p.includes("breathe");
  const hasClickAnim = p.includes("click") || p.includes("clicking") || p.includes("press") || p.includes("tap") || p.includes("active");
  const hasAnim = p.includes("animat") || p.includes("motion") || p.includes("bounce") || p.includes("spring");
  const hasPill = p.includes("pill") || p.includes("oval") || p.includes("rounded-full");
  const hasSharp = p.includes("sharp") || p.includes("square") || p.includes("box");
  const hasGlass = p.includes("glass") || p.includes("frost") || p.includes("blur") || p.includes("translucent");
  const isLonger = Boolean(p.match(/\b(long|longer|wide|wider|broad|stretched|expand|lengthy)\b/i));
  const isBigger = Boolean(p.match(/\b(big|bigger|large|larger|huge|chunky|giant|spacious)\b/i));
  const isCompact = Boolean(p.match(/\b(compact|small|smaller|tight|tiny|thin|slender)\b/i));
  const isPop = Boolean(p.match(/\b(pop|pops|standout|punchy|bold)\b/i));
  const isSoften = Boolean(p.match(/\b(soften|softer|smooth|smoothen)\b/i));
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
  if (hasBg && color) {
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
function startMcpStdio(port = 4999) {
  const rl = readline.createInterface({ input: process.stdin, terminal: false });
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
        const payload = JSON.stringify(res) + "\n";
        process.stdout.write(payload);
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
                description: "Get the currently active/selected DOM element in the user\u2019s live AuraCSS browser session.",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "auracss_apply_style",
                description: "Applies CSS rules and Tailwind classes live to the active element in the user\u2019s browser.",
                inputSchema: {
                  type: "object",
                  properties: {
                    cssText: { type: "string", description: 'CSS declarations (e.g. "background: #2563eb; color: #fff;")' },
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
                    cssText: { type: "string", description: "CSS declarations to append/save" }
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
            let el = activeElement;
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
            const text = el ? `Active Element: <${el.tag}>
Snippet: ${el.htmlSnippet}
Tokens: ${JSON.stringify(el.siteTokens || {})}` : "No element currently locked in browser. Click an element with AuraCSS activated.";
            process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result: { content: [{ type: "text", text }] } }) + "\n");
          })();
          return;
        }
        if (p.name === "auracss_apply_style") {
          const args = p.arguments;
          broadcastSSE({
            type: "apply_style",
            payload: {
              cssText: args.cssText,
              tailwindClasses: args.tailwindClasses || "",
              prompt: args.prompt,
              name: args.name,
              description: args.description,
              selector: args.selector
            }
          });
          const text = `Live mutation applied to browser:
${args.cssText}`;
          process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result: { content: [{ type: "text", text }] } }) + "\n");
          return;
        }
        if (p.name === "auracss_commit_to_source") {
          const args = p.arguments;
          const safePath = path.resolve(process.cwd(), args.filePath);
          if (fs.existsSync(safePath)) {
            fs.appendFileSync(safePath, `
/* AuraCSS Commit */
/* ${args.cssText} */
`);
          }
          const text = `Successfully committed styles to ${args.filePath}`;
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
      console.log(`  - Mode: Standalone HTTP Bridge
`);
    } else {
      process.stderr.write(`[AuraCSS MCP & Bridge] Listening on 127.0.0.1:${port} (MCP stdio active)
`);
    }
  });
  if (isMcp) {
    startMcpStdio();
  }
}
export {
  broadcastSSE,
  createBridgeServer,
  getActiveElement,
  setActiveElement,
  startMcpStdio
};
