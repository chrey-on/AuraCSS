<p align="center">
  <img src="icons/icon-128.png" alt="AuraCSS Logo" width="96" height="96" />
</p>

<h1 align="center">AuraCSS</h1>

> Zero-dependency, in-browser visual design assistant, non-destructive DOM mutation engine, and universal Model Context Protocol (MCP) server.

🌐 **Official Website & Live Demo:** [https://chrey-on.github.io/AuraCSS/](https://chrey-on.github.io/AuraCSS/)

[![Website](https://img.shields.io/badge/Website-Live%20Demo%20%26%20Install-brightgreen.svg)](https://chrey-on.github.io/AuraCSS/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E%20Tested-green.svg)](https://playwright.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit%20Tested-purple.svg)](https://vitest.dev/)
[![MCP](https://img.shields.io/badge/MCP-Standard%20Ready-black.svg)](https://modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

AuraCSS is an ambient visual styling co-pilot designed to inspect web elements, harvest site design tokens, synthesize aesthetic CSS/Tailwind design variations, and execute real-time, non-destructive DOM mutations directly in your browser.

It operates seamlessly as a **Chromium Extension (Manifest V3)**, a standalone **IIFE bundle**, or a **Model Context Protocol (MCP) Server** connecting your browser session to AI coding assistants like Google Antigravity, Cursor, and Claude.

---

## ✨ Features

- 🛡️ **W3C Open Shadow DOM Isolation (`#auracss-root`)**
  - Fully sandboxed UI overlays and docks. Zero stylesheet leakage into or out of the host document.
- ⚡ **FastDOM Architecture**
  - Geometry reads and visual writes are batch-scheduled across `requestAnimationFrame` boundaries to completely prevent layout thrashing and maintain 60fps responsiveness.
- 🎯 **Targeting & Hierarchy Traversal**
  - Inspect any element on hover. Click to lock.
  - Interactive breadcrumb bar displays the exact DOM ancestor chain.
  - Keyboard navigation (<kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd>) allows effortless parent/child node traversal without breaking selection.
- 🎨 **Ambient Design Token Harvesting & Typography Popover**
  - Automatically parses the host page to extract primary colors, typography families, border radius scales, spacing units, and dark mode state.
  - Includes a live Typography & Font Styles popover (font families, sizes, weights, tracking, leading, alignment, and swatches) plus live hover-peek and preset bookmarking.
- 👻 **Anti-Occlusion & Draggable Floating HUD**
  - **Ghost Mode (<kbd>H</kbd>)**: Instantly turns the Variation Dock and Breadcrumb Bar 88% transparent and click-through so you can interact with elements behind them.
  - **Smart Dodge**: Automatically flips the Dock and Breadcrumb Bar away from bottom-viewport elements.
  - **Right-Rail Minimize & Dragging**: Drag any bar via its `⋮⋮` handle or click `–` to collapse it into a non-overlapping circular icon badge docked cleanly along the right edge.
- 🔐 **Zero-Popup Extension Architecture & Hardened Local Bridge**
  - Auto-mounts on `localhost` / `127.0.0.1` and injects on-demand via <kbd>Alt+A</kbd> or the toolbar icon on external websites.
  - Routes Bridge HTTP & SSE traffic through the Manifest V3 background service worker (`background.js`) to eliminate browser *"Access other apps and services on this device"* (PNA) popups and third-party CSP blocks.
  - Local Bridge enforces `127.0.0.1` loopback binding, DNS-rebinding `Host` & `Origin` allowlist validation, symlink-safe `.css` workspace confinement, live CSS sanitization, and `/api/synthesize` rate limiting.
- ↺ **GoF Command History & Hold to Compare**
  - Full Undo/Redo history (<kbd>Ctrl+Z</kbd> / <kbd>Ctrl+Y</kbd>).
  - Press and hold <kbd>Spacebar</kbd> to momentarily compare the mutated element against its original unmodified styles.
  - 1-Click `↺ Revert` button (<kbd>Alt+R</kbd>) to instantly reset any element back to its clean baseline.
- 📋 **CSS Diff & Tailwind Ledger**
  - Visual modal tracking all mutated elements on the page.
  - Formats mutations as ready-to-copy CSS declaration blocks or equivalent Tailwind CSS utility classes.
- 🤖 **Universal Model Context Protocol (MCP) & Local Bridge**
  - Built-in dual-mode daemon listening on `http://127.0.0.1:4999`.
  - Connects your browser session directly to **Antigravity**, **Cursor**, **Claude**, **Windsurf**, or any MCP-compatible AI client via standard MCP JSON-RPC 2.0, automatically detecting and displaying the connected client in the diagnostics modal.
  - Captures rich visual & spatial element context (`role`, `innerText`, `rect`, `computedStyles`, `parentLayout`, `effectiveBackground`, and `childSummary`) so non-technical natural-language prompts translate accurately into live CSS.

---

## 🚀 Quick Start

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/chrey-on/AuraCSS.git
cd AuraCSS
npm install
```

### 2. Development & Production Build
```bash
# Start local Vite development server
npm run dev

# Run TypeScript check, compile browser bundle & MCP bridge
npm run build
```
The build produces:
- `dist/auracss.bundle.js` — Single, zero-dependency browser IIFE bundle (137.6 kB).
- `dist/bridge.js` — Dual-mode HTTP Bridge & MCP Server daemon (49.9 kB).

### 3. Load as a Chromium Extension (Chrome / Edge / Brave)
1. Open `chrome://extensions/` in your browser.
2. Enable **Developer mode** (toggle in top-right corner).
3. Click **Load unpacked** and select the root directory of this repository (`d:\AuraCSS`).
4. How it works:
   - **On `localhost` / `127.0.0.1`**: The `✦ AuraCSS: OFF` pill appears automatically in the top-right corner.
   - **On any external website**: AuraCSS stays completely unloaded (0 popups, 0 overhead) until you press <kbd>Alt+A</kbd> or click the AuraCSS toolbar icon to activate it on-demand.
   - Customize your hotkey anytime in `chrome://extensions/shortcuts`.

### 4. Zero-Install Bookmarklet & CDN Injector (No Node.js Required)
For designers, product managers, or clients who want to test AuraCSS on any live website without cloning or installing dependencies:

**Option A: Browser Bookmarklet**  
Create a new browser bookmark and set the URL to:
```javascript
javascript:(function(){if(window.__AURACSS_INSTANCE__){window.__AURACSS_INSTANCE__.toggle();return;}const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/chrey-on/AuraCSS@main/dist/auracss.bundle.js';document.head.appendChild(s);})();
```
Clicking the bookmark on any webpage instantly activates AuraCSS!

**Option B: HTML Script Tag**  
Add this script tag right before your closing `</body>` tag:
```html
<script src="https://cdn.jsdelivr.net/gh/chrey-on/AuraCSS@main/dist/auracss.bundle.js"></script>
```

---

## 🤖 Model Context Protocol (MCP) Integration

AuraCSS exposes a universal MCP server over `stdio` so that AI assistants can directly inspect and style your live browser application.

### Connecting to Antigravity / Cursor / Claude Desktop
Add this entry to your assistant's MCP configuration (e.g. `claude_desktop_config.json` or Antigravity's MCP settings):

```json
{
  "mcpServers": {
    "auracss": {
      "command": "node",
      "args": ["<PATH_TO_AURACSS>/dist/bridge.js", "--mcp"]
    }
  }
}
```

### Native Tools Exposed to the AI:
| Tool Name | Description |
| :--- | :--- |
| `auracss_inspect_element` | Returns the active element's role, visible text, dimensions, parent layout, surface contrast, computed styles, site tokens, and cleaned HTML snippet. |
| `auracss_apply_style` | Injects sanitized live CSS declarations, `:hover`/`:active` states, `@keyframes`, click toggles, and Tailwind classes into the browser in real-time. |
| `auracss_commit_to_source` | Safely writes sanitized CSS mutations to a workspace-confined `.css` file on disk. |

### Running the Standalone Zero-Key Local Bridge
If you want to use AuraCSS in your browser with zero API keys entered into the UI, simply run:
```bash
npm run bridge
```
The browser UI will automatically detect `http://127.0.0.1:4999` and display `🟢 Connected (Bridge)`.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Alt+A</kbd> | Toggle AuraCSS ON / OFF (or click extension icon) |
| <kbd>H</kbd> | Toggle HUD Ghost Mode (transparent & click-through Dock/Breadcrumbs) |
| <kbd>?</kbd> / <kbd>Shift+/</kbd> / <kbd>F1</kbd> | Open Shortcut Cheat Sheet dialog |
| <kbd>Click</kbd> | Lock / Unlock hovered DOM element |
| <kbd>Ctrl+Click</kbd> | Deselect locked DOM element |
| <kbd>ArrowUp</kbd> | Traverse to parent DOM node |
| <kbd>ArrowDown</kbd> | Traverse to child DOM node |
| <kbd>Hold Spacebar</kbd> | Hold to compare with original styles (release to restore) |
| <kbd>Ctrl+Z</kbd> | Undo last style mutation |
| <kbd>Ctrl+Y</kbd> / <kbd>Ctrl+Shift+Z</kbd> | Redo undone mutation |
| <kbd>Alt+R</kbd> | Revert locked element to original state |
| <kbd>Esc</kbd> | Close active modal / dialog / drawer |

---

## 📁 Architecture & Source Organization

Every file in `src/` strictly follows the Single Responsibility Principle and adheres to a strict `< 300 LOC Invariant`:

```
src/
├── a11y.ts             # WCAG 2.2 APCA / Relative luminance contrast calculator
├── ai-modal.ts         # Settings modal for Bridge, Gemini, and OpenAI
├── ai.ts               # Multi-provider LLM service, gateway checks, auto-fallback
├── bridge-compiler.ts  # Deterministic local keyword intent compiler
├── bridge-gemini.ts    # Direct Gemini Flash LLM synthesis client
├── bridge-mcp.ts       # Model Context Protocol (MCP) JSON-RPC 2.0 stdio server
├── bridge-presets.ts   # Curated multi-concept design variation catalogues
├── bridge-security.ts  # Host/Origin allowlisting, symlink-safe .css guard & rate limiter
├── bridge-types.ts     # Shared Bridge and MCP interface definitions
├── bridge.ts           # Dual-mode HTTP Bridge daemon & route dispatcher
├── command.ts          # GoF Command Pattern history with atomic undo/redo
├── customizer.ts       # Micro-tuning drawer (sliders, radius, elevation)
├── dock-cards.ts       # Swipeable preset cards track & drag physics
├── dock-saved.ts       # Saved prompted styles popover & time-ago formatters
├── dock-styles.ts      # CSS declarations for floating dock, prompt bar & popovers
├── dock-typography.ts  # Typography catalogues, font scales & palette popover
├── dock.ts             # Floating glassmorphism variation dock & ambient prompt bar
├── draggable.ts        # Pointer drag controller & viewport clamping
├── element-context.ts  # Natural-language visual, layout & surface context collector
├── harvester.ts        # Ambient DOM design token harvester
├── help-modal.ts       # Shortcuts cheat sheet dialog & activation toast HUD
├── hierarchy.ts        # Breadcrumb DOM hierarchy navigator
├── ledger.ts           # Change ledger modal, focus trap & 1-click source committer
├── main.ts             # Master orchestrator & lifecycle manager (< 300 lines)
├── overlay-styles.ts   # Shadow DOM overlay, controls & responsive touch styles
├── overlay.ts          # FastDOM highlight boxes, aria-live region & HUD capsule
├── prompt.ts           # Design prompt synthesizers & AI bridge orchestrator
├── suggester.ts        # Deterministic local design preset generator
└── types.ts            # Core TypeScript interfaces & contracts
```

---

## 🧪 Testing & Verification

AuraCSS is validated with comprehensive unit and end-to-end test suites:

```bash
# Run unit tests across all 18 test suites (112 tests)
npm test

# Run Playwright end-to-end tests across 4 heterogeneous DOM topologies (12 tests)
npm run test:e2e
```

- **Unit Suite:** 112 / 112 Vitest tests passing (`tests/unit/`).
- **E2E Suite:** 12 / 12 Playwright tests passing (`tests/e2e/`).

---

## 📄 License

MIT © [Christian Rey Kasilag](https://github.com/chrey-on)
