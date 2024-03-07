let activeTabId = null;
let startTime = Date.now();
let totalTimeSpent = 0;

chrome.storage.local.get(["totalTimeSpent"], (result) => {
  totalTimeSpent = result.totalTimeSpent || 0;
});

function updateTotalTimeSpent() {
  if (startTime === null) {
    startTime = Date.now();
    return;
  }
  const endTime = Date.now();
  const timeSpent = (endTime - startTime) / 1000;

  if (activeTabId !== null) {
    chrome.tabs.get(activeTabId, (tab) => {
      if (tab.url && tab.url.includes("medium.com")) {
        totalTimeSpent += timeSpent;
        chrome.storage.local.set({ totalTimeSpent: totalTimeSpent });
      }
    });
  }
  startTime = endTime;
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  updateTotalTimeSpent();
  activeTabId = activeInfo.tabId;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === activeTabId && changeInfo.url) {
    updateTotalTimeSpent();
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    updateTotalTimeSpent();
    activeTabId = null;
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      updateTotalTimeSpent();
      if (tabs.length > 0) {
        activeTabId = tabs[0].id;
      }
    });
  }
});

setInterval(updateTotalTimeSpent, 1000);
