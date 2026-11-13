# AuraCSS Repository & MCP Operational Rules

## 1. Unanchored Prompting & Tool State Guardrail
- When receiving a styling prompt while AuraCSS is turned OFF or no element is selected:
  - NEVER output raw CSS code blocks, mock implementations, or claim that live mutations were applied.
  - Output ONLY the concise reminder:
    `⚠️ AuraCSS is turned OFF or no element is currently selected in your browser. Please toggle AuraCSS to ON and click an element to select it first.`

## 2. AuraCSS MCP Tool Usage Contract
When calling `auracss_apply_style`:
- **Anti-Pollution**: Always set `mode: 'replace'` by default to prevent additive prompt contamination across turns. Use `mode: 'patch'` only when explicitly requested to modify specific existing properties.
- **Pseudo-Classes**: Never pass `:active` or `:hover` declarations inside inline `cssText`. Always route them to `activeState` and `hoverState` respectively so they are elevated with `!important` in the live rules sheet.
- **Keyframe Animations**: Always isolate `@keyframes` declarations in the `keyframes` parameter.
- **Click Behaviors**: For click-to-toggle visibility or class toggles, always pass `interaction: { type: 'toggle-visibility' | 'toggle-class' }` to execute in the browser's capture phase.

## 3. Element Selection & Lifecycle Synchronization
- Whenever an element is deselected (`unlockElement()`) or AuraCSS is deactivated (`deactivate()`), the bridge MUST be notified with `notifyActiveElement(null)` (`{ clear: true }`).
- The bridge MUST maintain `activeElement = null` when unselected, ensuring `auracss_inspect_element` never returns ghost or stale elements.

## 4. Codebase Architecture Invariants
- **Strict LOC Limit**: Every source file in `src/` must remain strictly $\le 300$ lines of code. No single file may exceed this threshold.
- **Defensive Lifecycle**: Every event listener, mutation observer, or timer must have an explicit teardown mechanism (AbortController, WeakMap, or cleanup callback).
- **Test Integrity**: All changes must preserve 100% test pass rate across `npm test` and `npm run test:e2e`.

## 5. Floating Controls, Dragging & Shortcut Lifecycle Invariants
- **Dragging Exclusively via the Dots Handle**:
  - Dragging the expanded floating toolbar is ONLY permitted via the 6-dots drag handle (`⋮⋮`, `.auracss-controls-drag-handle`).
  - Never attach drag listeners (`pointerdown`, `pointermove`, `pointerup`) or `cursor: grab` to the toolbar row (`.auracss-controls-row`) or its container. Action buttons (`btn`, `exportBtn`, `minBtn`) must remain 100% isolated from drag capture to prevent micro-jitter click drops.
  - When minimized, dragging is permitted exclusively via the circular floating badge (`✦`, `.auracss-min-badge`).
- **Dedicated Minimize Button (`–`)**:
  - The floating controls row must always include an explicit, dedicated minimize button (`–`, `.auracss-min-btn`) at the trailing end.
  - Clicking `–` collapses the toolbar into the floating badge (`✦`) docked flush against the right viewport edge (`Math.max(anchorRight - 32, winW - 32 - margin)`).
  - Clicking `✦` restores the expanded toolbar in-place with viewport clamping.
- **Synthetic Click Routing for Shortcuts**:
  - Global keyboard shortcuts that toggle UI state (specifically `Alt + A`) must dispatch a synthetic `.click()` on the canonical DOM button (`if (this.toggleBtn) this.toggleBtn.click(); else this.toggle();`). Never bypass the UI button by directly invoking internal lifecycle methods.
- **Windows Alt Menu Interception & Document Focus**:
  - In Windows Chromium/Edge, any shortcut utilizing `Alt` must capture both `keydown` and `keyup` for `Alt` using `{ capture: true }`, `e.preventDefault()`, and `e.stopPropagation()`. This prevents Windows from shifting focus to the browser window menu bar and swallowing webpage pointer events.
  - Call `window.focus()` defensively upon activation to guarantee active document receptivity.
- **Dynamic Viewport Clamping**:
  - Whenever the floating toolbar toggles state or changes width (such as revealing `Export (N)`), trigger `clampToViewport` synchronously and in `requestAnimationFrame` to ensure all controls remain 100% visible and within viewport bounds.

