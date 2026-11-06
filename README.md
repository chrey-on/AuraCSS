# AuraCSS ✦

> Zero-dependency, in-browser visual design assistant, non-destructive DOM mutation engine, and universal Model Context Protocol (MCP) server.

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
- 🎨 **Ambient Design Token Harvesting**
  - Automatically parses the host page to extract primary colors, typography families, border radius scales, spacing units, and dark mode state.
- 🪄 **Natural Language Prompt Synthesis**
  - Type design intents directly into the dock (e.g. *"frosted glass cyan pill with ambient glow"*).
  - Uses an intelligent multi-provider engine (Local Bridge, Google Gemini, OpenAI, or local rule fallback) to formulate production-grade CSS.
- 🎛️ **Micro-Tuning Drawer**
  - Fine-tune border radius, padding, and elevation/glow with live interactive sliders and preset chips.
- ↺ **GoF Command History & Hold to Compare**
  - Full Undo/Redo history (<kbd>Ctrl+Z</kbd> / <kbd>Ctrl+Y</kbd>).
  - Press and hold <kbd>Spacebar</kbd> to momentarily compare the mutated element against its original unmodified styles.
  - 1-Click `↺ Revert` button (<kbd>Alt+R</kbd>) to instantly reset any element back to its clean baseline.
- 📋 **CSS Diff & Tailwind Ledger**
  - Visual modal tracking all mutated elements on the page.
  - Formats mutations as ready-to-copy CSS declaration blocks or equivalent Tailwind CSS utility classes.
- 🤖 **Universal Model Context Protocol (MCP) & Local Bridge**
  - Built-in dual-mode daemon listening on `http://127.0.0.1:4999`.
  - Connects your browser session directly to **Antigravity**, **Cursor**, or **Claude Desktop** via standard MCP JSON-RPC 2.0.

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
- `dist/auracss.bundle.js` — Single, zero-dependency browser IIFE bundle (68 kB).
- `dist/bridge.js` — Dual-mode HTTP Bridge & MCP Server daemon (9.9 kB).

### 3. Load as a Chromium Extension (Chrome / Edge / Brave)
1. Open `chrome://extensions/` in your browser.
2. Enable **Developer mode** (toggle in top-right corner).
3. Click **Load unpacked** and select the root directory of this repository (`d:\AuraCSS`).
4. AuraCSS is now available on every webpage you visit!

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
| `auracss_inspect_element` | Returns the HTML snippet, tag, and computed CSS tokens of the active browser element. |
| `auracss_apply_style` | Injects live CSS declarations and Tailwind classes directly into the user's browser in real-time. |
| `auracss_commit_to_source` | Writes accepted style mutations directly into the target source code file on disk. |

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
| <kbd>Click</kbd> | Lock / Unlock hovered DOM element |
| <kbd>ArrowUp</kbd> | Traverse to parent DOM node |
| <kbd>ArrowDown</kbd> | Traverse to child DOM node |
| <kbd>Hold Spacebar</kbd> | Hold to compare with original styles (release to restore) |
| <kbd>Ctrl+Z</kbd> | Undo last style mutation |
| <kbd>Ctrl+Y</kbd> / <kbd>Ctrl+Shift+Z</kbd> | Redo undone mutation |
| <kbd>Alt+R</kbd> | Revert locked element to original state |
| <kbd>Esc</kbd> | Close active modal / drawer |

---

## 📁 Architecture & Source Organization

Every file in `src/` strictly follows the Single Responsibility Principle and adheres to a strict `< 300 LOC Invariant`:

```
src/
├── a11y.ts             # WCAG 2.2 APCA / Relative luminance contrast calculator (52 lines)
├── ai-modal.ts         # Settings modal for Bridge, Gemini, and OpenAI (280 lines)
├── ai.ts               # Multi-provider LLM service, gateway checks, auto-fallback (277 lines)
├── bridge-presets.ts   # Curated multi-concept design variation catalogues (152 lines)
├── bridge.ts           # Dual-mode HTTP Bridge daemon & MCP JSON-RPC 2.0 server (294 lines)
├── command.ts          # GoF Command Pattern history with atomic undo/redo (72 lines)
├── customizer.ts       # Micro-tuning drawer (sliders, radius, elevation) (161 lines)
├── dock.ts             # Floating glassmorphism variation dock & prompt bar (246 lines)
├── harvester.ts        # Ambient DOM design token harvester (200 lines)
├── hierarchy.ts        # Breadcrumb DOM hierarchy navigator (202 lines)
├── ledger.ts           # CSS diff, Tailwind utility generator, and export modal (235 lines)
├── main.ts             # Master orchestrator & lifecycle manager (296 lines)
├── overlay.ts          # FastDOM highlight boxes & floating HUD capsule (284 lines)
├── prompt.ts           # Natural language prompt parser & intent synthesizers (246 lines)
├── suggester.ts        # Deterministic local design preset generator (201 lines)
└── types.ts            # Core TypeScript interfaces & contracts (58 lines)
```

---

## 🧪 Testing & Verification

AuraCSS is validated with comprehensive unit and end-to-end test suites:

```bash
# Run unit tests across all 12 test suites (65 tests)
npm test

# Run Playwright end-to-end tests across 4 heterogeneous DOM topologies
npm run test:e2e
```

- **Unit Suite:** 65 / 65 Vitest tests passing (`tests/unit/`).
- **E2E Suite:** 6 / 6 Playwright tests passing (`tests/e2e/`).

---

## 📄 License

MIT © [Christian Rey Kasilag](https://github.com/chrey-on)
