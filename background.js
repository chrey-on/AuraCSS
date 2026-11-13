// AuraCSS Background Service Worker (Manifest V3)
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
