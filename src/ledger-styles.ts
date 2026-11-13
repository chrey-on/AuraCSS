export const MODAL_STYLES = `
.auracss-ledger-modal {
  position: fixed; inset: 0; display: none; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  z-index: 2147483647; pointer-events: auto; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.auracss-ledger-modal.visible { display: flex; }
.auracss-ledger-card {
  width: 90%; max-width: 680px; background: #0f172a; border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 16px; padding: 22px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  display: flex; flex-direction: column; gap: 12px; color: #f8fafc;
}
.auracss-ledger-header { display: flex; justify-content: space-between; align-items: flex-start; }
.auracss-ledger-title-group { display: flex; flex-direction: column; gap: 2px; }
.auracss-ledger-title { color: #f8fafc; font-size: 15px; font-weight: 700; display: flex; align-items: center; gap: 6px; }
.auracss-ledger-subtitle { color: #94a3b8; font-size: 11.5px; font-weight: 500; }
.auracss-ledger-close { background: none; border: none; color: #94a3b8; font-size: 18px; cursor: pointer; padding: 4px; border-radius: 4px; }
.auracss-ledger-close:hover { color: #f8fafc; background: rgba(255, 255, 255, 0.1); }
.auracss-ledger-chips { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
.auracss-ledger-chips::-webkit-scrollbar { display: none; }
.auracss-ledger-chip {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 10.5px;
  background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.25);
  padding: 3px 8px; border-radius: 6px; white-space: nowrap; flex-shrink: 0;
}
.auracss-ledger-tabs { display: flex; gap: 8px; }
.auracss-ledger-tab {
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.15s ease;
}
.auracss-ledger-tab:hover { background: rgba(255, 255, 255, 0.1); color: #f8fafc; }
.auracss-ledger-tab.active { background: #38bdf8; color: #0f172a; font-weight: 700; border-color: #38bdf8; }
.auracss-ledger-textarea {
  width: 100%; height: 200px; box-sizing: border-box; background: #020617;
  border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 10px; color: #38bdf8;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px;
  line-height: 1.5; padding: 14px; resize: vertical; outline: none;
}
.auracss-ledger-actions { display: flex; justify-content: flex-end; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap; }
.auracss-ledger-commit {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(56, 189, 248, 0.2) 100%);
  color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 8px; padding: 8px 14px;
  font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 5px;
}
.auracss-ledger-commit:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(56, 189, 248, 0.3) 100%);
  border-color: #34d399; color: #ffffff; transform: translateY(-1px);
}
.auracss-ledger-commit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.auracss-ledger-copy {
  background: #4f46e5; color: #ffffff; border: none; border-radius: 8px;
  padding: 8px 16px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s ease;
}
.auracss-ledger-copy:hover { background: #6366f1; transform: translateY(-1px); }
`;
