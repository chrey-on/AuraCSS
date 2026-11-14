export const OVERLAY_STYLES = `
:host { all: initial; position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2147483645; }
*, *::before, *::after { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.auracss-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; overflow: visible; z-index: 2147483645; }
.auracss-ring {
  position: absolute; pointer-events: none; border-radius: 4px; border: 2px solid #38bdf8;
  background: rgba(56, 189, 248, 0.08); box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 0 16px rgba(56, 189, 248, 0.35);
  transition: border-color 0.15s ease;
  will-change: transform, width, height; display: none;
}
.auracss-ring.locked {
  border-color: #a855f7; background: rgba(168, 85, 247, 0.1); box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2), 0 0 20px rgba(168, 85, 247, 0.45);
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease !important;
}
.auracss-pill {
  position: absolute; top: -26px; left: -2px; background: #0f172a; color: #f8fafc;
  font-size: 11px; font-weight: 600; line-height: 1; padding: 4px 8px; border-radius: 4px;
  letter-spacing: 0.02em; white-space: nowrap; max-width: calc(100vw - 16px); overflow: hidden; text-overflow: ellipsis;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 4px; pointer-events: none;
}
.auracss-pill.flipped { top: auto; bottom: -26px; }
.auracss-controls-stack {
  position: fixed; top: 16px; right: 20px; display: inline-flex; align-items: center;
  z-index: 2147483647; pointer-events: auto; user-select: none; max-width: calc(100vw - 16px);
}
.auracss-controls-stack.dragging { transition: none !important; user-select: none !important; }
.auracss-controls-row {
  display: inline-flex; align-items: center; height: 32px; max-width: calc(100vw - 16px);
  background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 9999px; padding: 2px 6px 2px 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.2);
  gap: 2px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.auracss-controls-drag-handle {
  display: inline-flex; align-items: center; justify-content: center;
  color: #64748b; font-size: 11px; cursor: grab; padding: 0 4px 0 2px;
  min-width: 16px; height: 26px; border-radius: 4px;
  touch-action: none; user-select: none; transition: color 0.15s ease, background 0.15s ease;
}
.auracss-controls-drag-handle:hover, .auracss-controls-drag-handle.dragging { color: #38bdf8; cursor: grabbing !important; }
.auracss-controls-drag-handle:focus-visible { outline: 2px solid #38bdf8; outline-offset: 1px; }
.auracss-controls-divider { width: 1px; height: 14px; background: rgba(255, 255, 255, 0.15); flex-shrink: 0; }
.auracss-toggle-btn {
  position: relative; height: 26px; padding: 0 10px; border-radius: 9999px; border: none; background: transparent; color: #f8fafc;
  font-size: 11.5px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; outline: none; box-shadow: none;
}
.auracss-toggle-btn::after {
  content: ''; position: absolute; inset: -4px 0; border-radius: 9999px; pointer-events: auto;
}
.auracss-toggle-btn:hover { background: rgba(255, 255, 255, 0.1); color: #ffffff; }
.auracss-toggle-btn:focus-visible { outline: 2px solid #38bdf8; outline-offset: 1px; }
.auracss-toggle-btn.active { color: #38bdf8; }
.auracss-export-btn { color: #38bdf8; font-weight: 700; }
.auracss-export-btn:hover { background: rgba(56, 189, 248, 0.15); color: #7dd3fc; }
.auracss-toggle-dot { width: 7px; height: 7px; border-radius: 50%; background: #64748b; transition: all 0.2s ease; }
.auracss-toggle-btn.active .auracss-toggle-dot { background: #38bdf8; box-shadow: 0 0 8px #38bdf8; }
.auracss-min-btn {
  position: relative; width: 24px; height: 24px; border-radius: 50%; border: none; background: transparent; color: #94a3b8;
  font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s ease; outline: none; margin-right: 2px;
}
.auracss-min-btn::after {
  content: ''; position: absolute; inset: -6px; border-radius: 50%; pointer-events: auto;
}
.auracss-min-btn:hover { background: rgba(255, 255, 255, 0.12); color: #f8fafc; }
.auracss-min-btn:focus-visible { outline: 2px solid #38bdf8; outline-offset: 1px; }
.auracss-min-badge {
  position: relative; display: none; width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(56, 189, 248, 0.4);
  background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  color: #38bdf8; font-size: 13px; font-weight: 700; align-items: center; justify-content: center; cursor: grab;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(56, 189, 248, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  outline: none; touch-action: none; user-select: none;
}
.auracss-min-badge::after {
  content: ''; position: absolute; inset: -6px; border-radius: 50%; pointer-events: auto;
}
.auracss-min-badge:hover { transform: scale(1.1); box-shadow: 0 0 18px rgba(56, 189, 248, 0.6); }
.auracss-min-badge:focus-visible { outline: 2px solid #38bdf8; outline-offset: 2px; }
.auracss-min-badge.active { color: #38bdf8; border-color: #38bdf8; box-shadow: 0 0 12px rgba(56, 189, 248, 0.45); }
.auracss-min-badge.dragging { cursor: grabbing !important; transform: scale(1.12); box-shadow: 0 0 22px rgba(56, 189, 248, 0.8); }
.auracss-controls-stack.minimized .auracss-controls-row { display: none !important; }
.auracss-controls-stack.minimized .auracss-min-badge { display: flex !important; }
.auracss-sr-live {
  position: absolute !important; width: 1px !important; height: 1px !important;
  padding: 0 !important; margin: -1px !important; overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important;
}
@media (pointer: coarse) {
  .auracss-controls-row { height: 36px; padding: 2px 8px; gap: 4px; }
  .auracss-toggle-btn { height: 28px; font-size: 12px; padding: 0 12px; }
  .auracss-min-btn { width: 28px; height: 28px; font-size: 15px; }
  .auracss-min-btn::after { inset: -8px; }
  .auracss-min-badge { width: 38px; height: 38px; font-size: 15px; }
  .auracss-min-badge::after { inset: -8px; }
  .auracss-controls-drag-handle { min-width: 20px; height: 28px; font-size: 13px; }
}
@media (max-width: 420px) {
  .auracss-controls-stack { top: 10px; right: 10px; }
  .auracss-controls-row { overflow-x: auto; scrollbar-width: none; padding: 2px 4px; }
  .auracss-controls-row::-webkit-scrollbar { display: none; }
  .auracss-toggle-btn { padding: 0 7px; font-size: 11px; gap: 4px; }
}
`;
