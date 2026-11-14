export const DOCK_STYLES = `
.auracss-variation-dock {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  align-items: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 18px;
  padding: 8px 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.2);
  z-index: 2147483646;
  pointer-events: auto;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  max-width: calc(100vw - 28px);
  transition: opacity 0.18s ease;
}
.auracss-variation-dock.visible { display: flex; }
.auracss-variation-dock.flipped-top { bottom: auto; top: 56px; }
.auracss-variation-dock.ghost { opacity: 0.12 !important; pointer-events: none !important; }
.auracss-variation-dock.dragging { transition: none !important; }
.auracss-variation-dock.minimized {
  padding: 0 !important; background: transparent !important; border: none !important;
  box-shadow: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;
}
.auracss-variation-dock.minimized .auracss-dock-drag-handle,
.auracss-variation-dock.minimized .auracss-dock-content { display: none !important; }
.auracss-variation-dock.minimized .auracss-dock-min-badge { display: flex !important; }

.auracss-dock-drag-handle {
  display: inline-flex; align-items: center; justify-content: center;
  color: #64748b; font-size: 12px; cursor: grab; padding: 4px 4px;
  border-radius: 6px; touch-action: none; user-select: none; flex-shrink: 0;
}
.auracss-dock-drag-handle:hover, .auracss-dock-drag-handle.dragging { color: #38bdf8; cursor: grabbing !important; }

.auracss-dock-min-btn {
  display: flex; align-items: center; justify-content: center; width: 22px; height: 28px; border-radius: 7px;
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15);
  color: #94a3b8; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
}
.auracss-dock-min-btn:hover { background: rgba(255, 255, 255, 0.15); color: #f8fafc; transform: translateY(-1px); }

.auracss-dock-min-badge {
  position: relative; display: none; width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid rgba(56, 189, 248, 0.45); background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  color: #38bdf8; align-items: center; justify-content: center; cursor: grab;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(56, 189, 248, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  outline: none; touch-action: none; user-select: none; padding: 0;
}
.auracss-dock-min-badge:hover { transform: scale(1.1); border-color: #38bdf8; box-shadow: 0 0 18px rgba(56, 189, 248, 0.6); }
.auracss-dock-min-badge.dragging { cursor: grabbing !important; transform: scale(1.12); }
.auracss-variation-dock.flipped-top .auracss-saved-popover,
.auracss-variation-dock.flipped-top .auracss-palette-popover {
  bottom: auto; top: calc(100% + 10px);
}

.auracss-dock-stack {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: stretch;
  justify-content: center;
  flex-shrink: 0;
}
.auracss-dock-stack.left { min-width: 48px; }
.auracss-dock-stack.right { min-width: 60px; }
.auracss-dock-row { display: flex; align-items: center; gap: 4px; }

.auracss-ai-remodel-btn {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  height: 28px; padding: 0 6px; border-radius: 7px;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(56, 189, 248, 0.2) 100%);
  border: 1px solid rgba(168, 85, 247, 0.45);
  color: #d8b4fe; font-size: 12px; font-weight: 700; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; flex-shrink: 0;
}
.auracss-ai-remodel-btn:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(56, 189, 248, 0.3) 100%);
  border-color: #c084fc; color: #ffffff; transform: translateY(-1px);
}
.auracss-btn-badge {
  font-size: 9.5px; font-weight: 800; background: rgba(168, 85, 247, 0.35);
  padding: 1px 4px; border-radius: 4px; color: #f3e8ff; line-height: 1;
}

.auracss-preset-reset {
  display: flex; align-items: center; justify-content: center;
  height: 24px; padding: 0 6px; border-radius: 7px;
  background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171; font-size: 13px; font-weight: 700; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; flex-shrink: 0;
}
.auracss-preset-reset:hover { background: rgba(239, 68, 68, 0.25); border-color: #f87171; transform: translateY(-1px); }
.auracss-preset-reset.disabled { opacity: 0.35; cursor: default; pointer-events: none; }

.auracss-dock-divider { width: 1px; height: 48px; background: rgba(255, 255, 255, 0.1); flex-shrink: 0; }

.auracss-cards-track {
  display: flex; align-items: center; gap: 10px; overflow-x: auto;
  scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch;
  cursor: grab; user-select: none; max-width: min(800px, calc(100vw - 220px)); padding: 2px 2px;
}
.auracss-cards-track::-webkit-scrollbar { display: none; }
.auracss-cards-track.grabbing { cursor: grabbing; }

.auracss-preset-card {
  display: flex; flex-direction: column; gap: 3px; padding: 8px 12px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer; transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1); min-width: 145px; max-width: 175px; flex-shrink: 0;
  position: relative;
}
.auracss-preset-card:hover { background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.4); transform: translateY(-2px); }
.auracss-preset-card.active { background: rgba(168, 85, 247, 0.2); border-color: #a855f7; box-shadow: 0 0 14px rgba(168, 85, 247, 0.4); }
.auracss-preset-card.bookmarked { border-color: rgba(251, 191, 36, 0.45); background: rgba(251, 191, 36, 0.06); }
.auracss-preset-card-header { display: flex; align-items: center; justify-content: space-between; gap: 4px; width: 100%; }
.auracss-preset-name { color: #f8fafc; font-size: 11.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }
.auracss-preset-bookmark {
  display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px;
  border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.12); background: rgba(255, 255, 255, 0.05);
  color: #64748b; font-size: 11px; cursor: pointer; transition: all 0.15s ease; padding: 0; flex-shrink: 0;
}
.auracss-preset-bookmark:hover {
  background: rgba(251, 191, 36, 0.2); border-color: rgba(251, 191, 36, 0.5); color: #fbbf24; transform: scale(1.15);
}
.auracss-preset-bookmark.bookmarked {
  color: #fbbf24; background: rgba(251, 191, 36, 0.18); border-color: #fbbf24;
}
.auracss-preset-desc { color: #94a3b8; font-size: 10px; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.auracss-contrast-badge { font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px; display: inline-flex; align-items: center; width: fit-content; margin-top: 1px; }
.auracss-contrast-badge.AAA { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); }
.auracss-contrast-badge.AA { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); }
.auracss-contrast-badge.FAIL { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }

.auracss-dock-palette-btn, .auracss-dock-tune-btn {
  display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px;
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e2e8f0; font-size: 13px; cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
}
.auracss-dock-palette-btn:hover, .auracss-dock-tune-btn:hover { background: rgba(56, 189, 248, 0.15); border-color: #38bdf8; transform: translateY(-1px); }

.auracss-ai-settings-btn {
  display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px;
  background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.15);
  color: #94a3b8; font-size: 13px; cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
}
.auracss-ai-settings-btn:hover { background: rgba(255, 255, 255, 0.15); color: #f8fafc; transform: translateY(-1px); }

.auracss-saved-styles-btn {
  display: flex; align-items: center; justify-content: center; gap: 3px;
  height: 24px; padding: 0 6px; border-radius: 7px;
  background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25);
  color: #38bdf8; font-size: 11px; font-weight: 700; cursor: pointer;
  transition: all 0.15s ease; white-space: nowrap; flex-shrink: 0;
}
.auracss-saved-styles-btn:hover { background: rgba(56, 189, 248, 0.25); border-color: #38bdf8; transform: translateY(-1px); }

/* Floating Popovers */
.auracss-saved-popover, .auracss-palette-popover {
  position: absolute; bottom: calc(100% + 10px); right: 0; width: 330px; max-width: 90vw; max-height: 440px;
  overflow-y: auto; scrollbar-width: thin;
  background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 14px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7); padding: 14px; display: none; flex-direction: column; gap: 10px;
  z-index: 2147483647; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #f8fafc;
}
.auracss-saved-popover.visible, .auracss-palette-popover.visible { display: flex; }

.auracss-saved-popover-header, .auracss-palette-header {
  display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 700; color: #38bdf8;
}
.auracss-palette-revert {
  display: inline-flex; align-items: center; justify-content: center; height: 22px; padding: 0 8px;
  border-radius: 6px; border: 1px solid rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.12);
  color: #f87171; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;
}
.auracss-palette-revert:hover {
  background: rgba(239, 68, 68, 0.25); border-color: #f87171; transform: translateY(-1px);
}
.auracss-saved-popover-close, .auracss-palette-close {
  background: transparent; border: none; color: #94a3b8; font-size: 14px; cursor: pointer; padding: 2px 6px; border-radius: 4px;
}
.auracss-saved-popover-close:hover, .auracss-palette-close:hover { color: #ffffff; background: rgba(255, 255, 255, 0.1); }

.auracss-saved-list { display: flex; flex-direction: column; gap: 8px; max-height: 310px; overflow-y: auto; scrollbar-width: thin; }
.auracss-saved-card {
  display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border-radius: 8px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; transition: all 0.15s ease;
}
.auracss-saved-card:hover { background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.4); transform: translateY(-1px); }
.auracss-saved-card.active { border-color: #a855f7; background: rgba(168, 85, 247, 0.18); }
.auracss-saved-card-header { display: flex; justify-content: space-between; align-items: center; }
.auracss-saved-card-title { font-size: 11.5px; font-weight: 700; color: #f8fafc; }
.auracss-saved-card-time { font-size: 9.5px; color: #64748b; font-weight: 500; }
.auracss-saved-card-desc { font-size: 10.5px; color: #94a3b8; line-height: 1.3; }
.auracss-saved-card-tw {
  font-size: 9.5px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: #38bdf8;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: rgba(56, 189, 248, 0.1);
  padding: 2px 5px; border-radius: 4px;
}
.auracss-saved-card-remove {
  background: transparent; border: none; color: #64748b; font-size: 11px;
  cursor: pointer; padding: 0 4px; line-height: 1; border-radius: 4px;
  transition: all 0.15s ease; margin-left: 6px;
}
.auracss-saved-card-remove:hover { color: #f43f5e; background: rgba(244, 63, 94, 0.15); }
.auracss-saved-clear-all {
  background: rgba(244, 63, 94, 0.12); border: 1px solid rgba(244, 63, 94, 0.25);
  color: #f87171; font-size: 10px; font-weight: 600; border-radius: 5px;
  padding: 2px 7px; cursor: pointer; margin-left: auto; margin-right: 6px;
  transition: all 0.15s ease;
}
.auracss-saved-clear-all:hover { background: rgba(244, 63, 94, 0.25); color: #fecdd3; }
.auracss-saved-empty { text-align: center; color: #64748b; font-size: 11.5px; padding: 16px 8px; line-height: 1.4; }

/* Typography Elements */
.auracss-palette-section { display: flex; flex-direction: column; gap: 5px; }
.auracss-palette-section-title {
  font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-top: 1px;
}
.auracss-font-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px; }
.auracss-font-pill, .auracss-theme-pill {
  display: flex; align-items: center; justify-content: center; padding: 5px 8px; border-radius: 6px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e2e8f0; font-size: 11px; font-weight: 500; cursor: pointer; transition: all 0.15s ease;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.auracss-font-pill:hover, .auracss-theme-pill:hover { background: rgba(56, 189, 248, 0.12); border-color: #38bdf8; transform: translateY(-1px); }
.auracss-font-pill.active, .auracss-theme-pill.active { background: rgba(56, 189, 248, 0.2); border-color: #38bdf8; color: #38bdf8; font-weight: 700; }

.auracss-pills-row { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; }
.auracss-size-pill, .auracss-style-pill {
  display: inline-flex; align-items: center; justify-content: center; padding: 3px 7px; border-radius: 5px;
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1; font-size: 10px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;
}
.auracss-size-pill:hover, .auracss-style-pill:hover { background: rgba(56, 189, 248, 0.12); border-color: #38bdf8; color: #ffffff; transform: translateY(-1px); }
.auracss-size-pill.active, .auracss-style-pill.active { background: #38bdf8; color: #0f172a; font-weight: 700; border-color: #38bdf8; }

.auracss-swatches-grid { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; margin-top: 1px; }
.auracss-swatch-btn {
  width: 22px; height: 22px; border-radius: 5px; border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
}
.auracss-swatch-btn:hover { transform: scale(1.18); border-color: #ffffff; box-shadow: 0 0 8px rgba(255, 255, 255, 0.4); }
.auracss-swatch-btn.active { border: 2px solid #38bdf8; box-shadow: 0 0 8px #38bdf8; }
`;
