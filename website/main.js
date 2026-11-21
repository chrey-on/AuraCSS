/**
 * AuraCSS High-Precision Client Engineering Logic
 * 1. Interactive Before/After Split Comparison Slider
 * 2. Live MCP Wire Protocol Inspector
 * 3. 4-Way Distribution Tab Switcher & Dynamic MCP Config Generator
 * 4. Clipboard API with Feedback Toasts
 * 5. In-Page Dynamic Bundle Injector
 */

// 1. MCP Configuration Definitions
const MCP_CONFIGS = {
  antigravity: {
    filename: '~/.gemini/antigravity/mcp_config.json',
    code: JSON.stringify({
      mcpServers: {
        auracss: {
          command: "node",
          args: ["d:/AuraCSS/dist/bridge.js", "--mcp"]
        }
      }
    }, null, 2)
  },
  cursor: {
    filename: '.cursor/mcp.json',
    code: JSON.stringify({
      mcpServers: {
        auracss: {
          command: "npx",
          args: ["-y", "auracss@latest", "--mcp"]
        }
      }
    }, null, 2)
  },
  claude: {
    filename: 'claude_desktop_config.json',
    code: JSON.stringify({
      mcpServers: {
        auracss: {
          command: "node",
          args: ["/absolute/path/to/AuraCSS/dist/bridge.js", "--mcp"]
        }
      }
    }, null, 2)
  },
  windsurf: {
    filename: '~/.codeium/windsurf/mcp_config.json',
    code: JSON.stringify({
      mcpServers: {
        auracss: {
          command: "npx",
          args: ["auracss", "--mcp"]
        }
      }
    }, null, 2)
  }
};

// 2. Live MCP Wire Inspector Payloads
const MCP_WIRE_DATA = {
  inspect: {
    req: JSON.stringify({
      jsonrpc: "2.0",
      id: "call-901",
      method: "tools/call",
      params: {
        name: "auracss_inspect_element",
        arguments: {}
      }
    }, null, 2),
    res: JSON.stringify({
      jsonrpc: "2.0",
      id: "call-901",
      result: {
        tag: "BUTTON",
        id: "demo-btn-action",
        classes: ["sample-btn-primary"],
        rect: { x: 382.5, y: 714.0, width: 142.0, height: 38.0 },
        computedStyles: {
          color: "#ffffff",
          backgroundColor: "rgb(99, 102, 241)",
          borderRadius: "4px",
          display: "inline-flex"
        },
        parentLayout: "flex",
        ancestors: ["div.sample-btn-row", "div#demo-card", "div.playground-canvas"]
      }
    }, null, 2)
  },
  apply: {
    req: JSON.stringify({
      jsonrpc: "2.0",
      id: "call-902",
      method: "tools/call",
      params: {
        name: "auracss_apply_style",
        arguments: {
          mode: "replace",
          cssText: "background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(16px); border: 1px solid rgba(56, 189, 248, 0.35); box-shadow: 0 0 18px rgba(56, 189, 248, 0.15);",
          hoverState: "border-color: #38bdf8; transform: translateY(-1px);",
          activeState: "transform: scale(0.97);"
        }
      }
    }, null, 2),
    res: JSON.stringify({
      jsonrpc: "2.0",
      id: "call-902",
      result: {
        success: true,
        mutatedNode: "button#demo-btn-action",
        declarationsApplied: 6,
        keyframesInjected: 0,
        undoStackDepth: 3
      }
    }, null, 2)
  },
  commit: {
    req: JSON.stringify({
      jsonrpc: "2.0",
      id: "call-903",
      method: "tools/call",
      params: {
        name: "auracss_commit_to_source",
        arguments: {
          filePath: "src/styles.css",
          selector: ".sample-btn-primary",
          format: "css"
        }
      }
    }, null, 2),
    res: JSON.stringify({
      jsonrpc: "2.0",
      id: "call-903",
      result: {
        committed: true,
        file: "d:/AuraCSS/src/styles.css",
        linesWritten: 7,
        hash: "e4a899c7"
      }
    }, null, 2)
  }
};

// 3. Interactive Split Comparison Slider Engine
function setupDiffSlider() {
  const container = document.getElementById('diff-slider-container');
  const afterLayer = document.getElementById('diff-after-layer');
  const handle = document.getElementById('diff-divider-handle');
  if (!container || !afterLayer || !handle) return;

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = container.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;
    
    // Clamp to 5% - 95%
    if (percentage < 5) percentage = 5;
    if (percentage > 95) percentage = 95;

    afterLayer.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  handle.addEventListener('pointerdown', (e) => {
    isDragging = true;
    handle.setPointerCapture(e.pointerId);
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
  });

  // Also support clicking anywhere on the container to move divider
  container.addEventListener('click', (e) => {
    updateSlider(e.clientX);
  });
}

// 4. Live MCP Wire Inspector Tab Switcher
function setupWireInspector() {
  const tabs = document.querySelectorAll('.term-tab');
  const reqBlock = document.getElementById('inspector-req-code');
  const resBlock = document.getElementById('inspector-res-code');
  if (!reqBlock || !resBlock) return;

  function setInspectorPayload(key) {
    const payload = MCP_WIRE_DATA[key] || MCP_WIRE_DATA.inspect;
    reqBlock.textContent = payload.req;
    resBlock.textContent = payload.res;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const payloadKey = tab.getAttribute('data-payload');
      setInspectorPayload(payloadKey);
    });
  });

  // Default to inspect
  setInspectorPayload('inspect');
}

// 5. Distribution Tabs
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const targetPanelId = tab.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// 6. MCP Client Dropdown
function setupMcpDropdown() {
  const select = document.getElementById('mcp-client-select');
  const codeBlock = document.getElementById('mcp-code-block');
  const filename = document.getElementById('config-filename');
  if (!select || !codeBlock || !filename) return;

  function updateMcpView() {
    const selectedKey = select.value;
    const item = MCP_CONFIGS[selectedKey] || MCP_CONFIGS.antigravity;
    codeBlock.textContent = item.code;
    filename.textContent = item.filename;
  }

  select.addEventListener('change', updateMcpView);
  updateMcpView();
}

// 7. Clipboard Utilities
let toastTimeout = null;
function showToast(message = '✓ Copied to clipboard!') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function setupCopyButtons() {
  const mcpBtn = document.getElementById('copy-mcp-btn');
  if (mcpBtn) {
    mcpBtn.addEventListener('click', async () => {
      const code = document.getElementById('mcp-code-block').textContent;
      await navigator.clipboard.writeText(code);
      showToast('✓ MCP Configuration copied!');
    });
  }

  const bmBtn = document.getElementById('copy-bm-btn');
  if (bmBtn) {
    bmBtn.addEventListener('click', async () => {
      const code = document.getElementById('bm-code-block').textContent;
      await navigator.clipboard.writeText(code);
      showToast('✓ Bookmarklet JavaScript copied!');
    });
  }

  const cdnBtn = document.getElementById('copy-cdn-btn');
  if (cdnBtn) {
    cdnBtn.addEventListener('click', async () => {
      const code = document.getElementById('cdn-code-block').textContent;
      await navigator.clipboard.writeText(code);
      showToast('✓ Script tag copied!');
    });
  }

  const bmLink = document.getElementById('bookmarklet-link');
  if (bmLink) {
    bmLink.addEventListener('click', (e) => {
      e.preventDefault();
      alert('👉 Drag and drop this button onto your browser Bookmarks Bar!\n\nOnce dropped, click it on any webpage to run AuraCSS.');
    });
  }
}

// 8. In-Page Live Demo Bundle Loader
function setupLiveDemo() {
  const launchBtn = document.getElementById('launch-demo-btn');
  const liveIndicator = document.getElementById('live-indicator');
  if (!launchBtn || !liveIndicator) return;

  async function activateAuraCSS() {
    if (window.__AURACSS_INSTANCE__) {
      window.__AURACSS_INSTANCE__.toggle();
      updateStatus();
      return;
    }

    try {
      launchBtn.disabled = true;
      launchBtn.textContent = 'Loading Engine...';

      const script = document.createElement('script');
      script.src = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? './auracss.bundle.js'
        : 'https://cdn.jsdelivr.net/gh/chrey-on/AuraCSS@main/dist/auracss.bundle.js';

      script.onload = () => {
        launchBtn.disabled = false;
        launchBtn.innerHTML = '<span class="terminal-symbol">&gt;_</span> Toggle In-Page HUD';
        updateStatus();
        showToast('✦ AuraCSS Engine Mounted (#auracss-root)');
      };

      script.onerror = () => {
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://cdn.jsdelivr.net/gh/chrey-on/AuraCSS@main/dist/auracss.bundle.js';
        fallbackScript.onload = () => {
          launchBtn.disabled = false;
          launchBtn.innerHTML = '<span class="terminal-symbol">&gt;_</span> Toggle In-Page HUD';
          updateStatus();
        };
        document.body.appendChild(fallbackScript);
      };

      document.body.appendChild(script);
    } catch (err) {
      console.error('Failed to load AuraCSS bundle:', err);
      launchBtn.disabled = false;
      launchBtn.innerHTML = '<span class="terminal-symbol">&gt;_</span> Activate In-Page Engine';
    }
  }

  function updateStatus() {
    if (window.__AURACSS_INSTANCE__) {
      liveIndicator.textContent = '● Engine Active (#auracss-root)';
      liveIndicator.style.background = 'rgba(56, 189, 248, 0.15)';
      liveIndicator.style.color = '#38bdf8';
    } else {
      liveIndicator.textContent = '● Standby (Press Alt+A)';
      liveIndicator.style.background = 'rgba(16, 185, 129, 0.12)';
      liveIndicator.style.color = '#10b981';
    }
  }

  launchBtn.addEventListener('click', activateAuraCSS);

  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.code === 'KeyA') {
      setTimeout(updateStatus, 150);
    }
  });
}

// 9. Master Initialization
document.addEventListener('DOMContentLoaded', () => {
  setupDiffSlider();
  setupWireInspector();
  setupTabs();
  setupMcpDropdown();
  setupCopyButtons();
  setupLiveDemo();
});
