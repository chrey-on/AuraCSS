// AuraCSS Background Service Worker (Manifest V3)
// Proxies localhost Bridge HTTP & SSE traffic from the privileged extension origin
// to eliminate browser Private Network Access (PNA) permission popups and CSP blocks.

const BRIDGE_BASE = 'http://127.0.0.1:4999';
const subscribedTabs = new Set();
let eventSource = null;

function ensureBridgeSSE() {
  if (eventSource || subscribedTabs.size === 0 || typeof EventSource === 'undefined') return;
  try {
    const es = new EventSource(`${BRIDGE_BASE}/api/events`);
    eventSource = es;
    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        if (parsed?.type === 'apply_style' && parsed.payload?.cssText) {
          for (const tabId of subscribedTabs) {
            chrome.tabs.sendMessage(tabId, { type: 'AURACSS_BRIDGE_EVENT', payload: parsed.payload }).catch(() => {
              subscribedTabs.delete(tabId);
            });
          }
        }
      } catch {}
    };
    es.onerror = () => {
      try { es.close(); } catch {}
      if (eventSource === es) eventSource = null;
    };
  } catch {}
}

function closeBridgeSSEIfIdle() {
  if (subscribedTabs.size === 0 && eventSource) {
    try { eventSource.close(); } catch {}
    eventSource = null;
  }
}

chrome.tabs?.onRemoved?.addListener((tabId) => {
  subscribedTabs.delete(tabId);
  closeBridgeSSEIfIdle();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || typeof msg !== 'object') return false;

  if (msg.type === 'AURACSS_BRIDGE_FETCH') {
    const { path = '/health', method = 'GET', body } = msg;
    const url = path.startsWith('http') ? path : `${BRIDGE_BASE}${path}`;
    fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: typeof body === 'string' ? body : (body ? JSON.stringify(body) : undefined),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        sendResponse({ ok: res.ok, status: res.status, data });
      })
      .catch((err) => {
        sendResponse({ ok: false, status: 0, error: String(err) });
      });
    return true;
  }

  if (msg.type === 'AURACSS_BRIDGE_SUBSCRIBE') {
    if (sender?.tab?.id) {
      subscribedTabs.add(sender.tab.id);
      ensureBridgeSSE();
    }
    sendResponse({ ok: true });
    return false;
  }

  if (msg.type === 'AURACSS_BRIDGE_UNSUBSCRIBE') {
    if (sender?.tab?.id) {
      subscribedTabs.delete(sender.tab.id);
      closeBridgeSSEIfIdle();
    }
    sendResponse({ ok: true });
    return false;
  }

  return false;
});

async function sendToggleToTab(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: 'AURACSS_TOGGLE' });
  } catch {
    // If content script was not yet active on the tab, inject bundle and dispatch toggle
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ['dist/auracss.bundle.js'],
      });
      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, { type: 'AURACSS_TOGGLE' }).catch(() => {});
      }, 120);
    } catch {}
  }
}

chrome.action.onClicked.addListener((tab) => {
  if (tab?.id) void sendToggleToTab(tab.id);
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-auracss') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) void sendToggleToTab(activeTab.id);
    });
  }
});
