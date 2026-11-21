/**
 * AuraCSS Website Client Logic
 * Handles interactive tabs, dynamic MCP configurations, copy snippets,
 * and loads the AuraCSS bundle dynamically for the in-page live demo.
 */

// 1. MCP Client Configurations
const MCP_CONFIGS = {
  antigravity: {
    filename: 'mcp_config.json (or ~/.gemini/antigravity/mcp_config.json)',
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

// 2. Tab Switcher
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Deactivate all
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => p.classList.remove('active'));

      // Activate clicked
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

// 3. MCP Client Dropdown
function setupMcpDropdown() {
  const select = document.getElementById('mcp-client-select');
  const codeBlock = document.getElementById('mcp-code-block');
  const filename = document.getElementById('config-filename');

  function updateMcpView() {
    const selectedKey = select.value;
    const item = MCP_CONFIGS[selectedKey] || MCP_CONFIGS.antigravity;
    codeBlock.textContent = item.code;
    filename.textContent = item.filename;
  }

  select.addEventListener('change', updateMcpView);
  updateMcpView();
}

// 4. Clipboard Copy Utilities
let toastTimeout = null;
function showToast(message = '✓ Copied to clipboard!') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function setupCopyButtons() {
  // Copy MCP Config
  document.getElementById('copy-mcp-btn').addEventListener('click', async () => {
    const code = document.getElementById('mcp-code-block').textContent;
    await navigator.clipboard.writeText(code);
    showToast('✓ MCP Configuration copied!');
  });

  // Copy Bookmarklet JS
  document.getElementById('copy-bm-btn').addEventListener('click', async () => {
    const code = document.getElementById('bm-code-block').textContent;
    await navigator.clipboard.writeText(code);
    showToast('✓ Bookmarklet JavaScript copied!');
  });

  // Copy CDN Tag
  document.getElementById('copy-cdn-btn').addEventListener('click', async () => {
    const code = document.getElementById('cdn-code-block').textContent;
    await navigator.clipboard.writeText(code);
    showToast('✓ Script tag copied!');
  });

  // Bookmarklet Drag UX safety
  const bmLink = document.getElementById('bookmarklet-link');
  bmLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('👉 Drag and drop this button onto your browser Bookmarks Bar!\n\nOnce dropped, click it on any webpage to run AuraCSS.');
  });
}

// 5. In-Page AuraCSS Live Demo Integration
function setupLiveDemo() {
  const launchBtn = document.getElementById('launch-demo-btn');
  const liveIndicator = document.getElementById('live-indicator');

  async function activateAuraCSS() {
    if (window.__AURACSS_INSTANCE__) {
      window.__AURACSS_INSTANCE__.toggle();
      updateStatus();
      return;
    }

    try {
      launchBtn.disabled = true;
      launchBtn.textContent = 'Loading AuraCSS...';

      // Load local bundle or fallback to CDN bundle
      const script = document.createElement('script');
      // In local dev, use relative dist/auracss.bundle.js
      script.src = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
        ? '/dist/auracss.bundle.js'
        : 'https://cdn.jsdelivr.net/gh/chrey-on/AuraCSS@main/dist/auracss.bundle.js';
      
      script.onload = () => {
        launchBtn.disabled = false;
        launchBtn.innerHTML = '<span class="sparkle">✦</span> Toggle AuraCSS Overlay';
        updateStatus();
        showToast('✦ AuraCSS Co-Pilot Activated! Click any card to inspect.');
      };

      script.onerror = () => {
        // Fallback to direct cdn if local dist was missing
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://cdn.jsdelivr.net/gh/chrey-on/AuraCSS@main/dist/auracss.bundle.js';
        fallbackScript.onload = () => {
          launchBtn.disabled = false;
          launchBtn.innerHTML = '<span class="sparkle">✦</span> Toggle AuraCSS Overlay';
          updateStatus();
        };
        document.body.appendChild(fallbackScript);
      };

      document.body.appendChild(script);
    } catch (err) {
      console.error('Failed to load AuraCSS bundle:', err);
      launchBtn.disabled = false;
      launchBtn.innerHTML = '<span class="sparkle">✦</span> Activate In-Page Demo';
    }
  }

  function updateStatus() {
    if (window.__AURACSS_INSTANCE__) {
      liveIndicator.textContent = '● AuraCSS Active';
      liveIndicator.style.background = 'rgba(56, 189, 248, 0.2)';
      liveIndicator.style.color = '#38bdf8';
    } else {
      liveIndicator.textContent = '● Standby (Alt+A)';
      liveIndicator.style.background = 'rgba(16, 185, 129, 0.15)';
      liveIndicator.style.color = '#10b981';
    }
  }

  launchBtn.addEventListener('click', activateAuraCSS);

  // Global Alt+A indicator monitor
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.code === 'KeyA') {
      setTimeout(updateStatus, 150);
    }
  });
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupMcpDropdown();
  setupCopyButtons();
  setupLiveDemo();
});
