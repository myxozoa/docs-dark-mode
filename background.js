const docsUrl = "https://docs.google.com/document/*";
const docsDarkmodeStatus = "docsDarkmodeStatus";
const id = "docs-darkmode-extension";

let darkmodeStatus = true;

const triggerDarkmode = (id) => {
  // Using a messaging system now because `executeScript` always runs at `document_end` causing a few frames of white to be displayed on every navigation
  chrome.tabs.sendMessage(id, { darkmodeStatus });
};

const toggleExtensionIcon = (mode) => {
  const onOrOff = mode ? "on" : "off";
  chrome.action.setIcon({ path: { 16: `icons/dark-${onOrOff}-16x16.png`, 32: `icons/dark-${onOrOff}-32x32.png`, 64: `icons/dark-${onOrOff}-64x64.png` } });
};

const toggleEveryOpenDocsTab = () => {
  // Tell every open docs tab to become dark mode
  chrome.tabs.query({ url: docsUrl }, (tabs) => {
    tabs.forEach((tab) => {
      triggerDarkmode(tab.id);
    });
  });
};

// On initial load of the extension/chrome itself
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get([docsDarkmodeStatus], (result) => {
    // If we have no previous setting then default to 'on'
    if (result[docsDarkmodeStatus] === undefined) {
      chrome.storage.sync.set({ [docsDarkmodeStatus]: true });
    }

    darkmodeStatus = result[docsDarkmodeStatus] || true;

    toggleExtensionIcon(darkmodeStatus);
    if (darkmodeStatus) toggleEveryOpenDocsTab();
  });
});

// When a navigation action is undertaken
chrome.webNavigation.onCommitted.addListener(
  (navigationEvent) => {
    triggerDarkmode(navigationEvent.tabId);
  },
  { url: [{ urlMatches: docsUrl }] }
);

// Triggered on every click of the extension's icon
chrome.action.onClicked.addListener(() => {
  chrome.storage.sync.set({ [docsDarkmodeStatus]: !darkmodeStatus }, () => {
    darkmodeStatus = !darkmodeStatus;

    toggleExtensionIcon(darkmodeStatus);

    // Tell every open docs tab to toggle dark mode
    chrome.tabs.query({ url: docsUrl }, (tabs) => {
      tabs.forEach((tab) => {
        triggerDarkmode(tab.id);
      });
    });
  });
});
