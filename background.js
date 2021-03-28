const docsUrl = "https://docs.google.com/document/*";
const docsDarkmodeStatus = "docsDarkmodeStatus";
const id = "docs-darkmode-extension";

let darkmodeStatus = true;

const triggerDarkmode = (id) => {
  console.warn("called triggerdarkmode");
  chrome.tabs.sendMessage(id, { darkmodeStatus });
};

const toggleExtensionIcon = (mode) => {
  const onOrOff = mode ? "on" : "off";
  chrome.action.setIcon({ path: { 16: `icons/dark-${onOrOff}-16x16.png`, 32: `icons/dark-${onOrOff}-32x32.png`, 64: `icons/dark-${onOrOff}-64x64.png` } });
};

// On initial load of the extension/chrome itself
chrome.runtime.onStartup.addListener(() => {
  console.warn("only on startup");
  chrome.storage.sync.get([docsDarkmodeStatus], (result) => {
    // If we have no previous setting then default to 'on'
    if (result[docsDarkmodeStatus] === undefined) {
      chrome.storage.sync.set({ [docsDarkmodeStatus]: true }, () => {
        darkmodeStatus = true;

        toggleExtensionIcon(true);

        // Tell every open docs tab to become dark mode
        chrome.tabs.query({ url: docsUrl }, (tabs) => {
          tabs.forEach((tab) => {
            triggerDarkmode(tab.id);
          });
        });
      });
    } else {
      darkmodeStatus = result[docsDarkmodeStatus];

      toggleExtensionIcon(darkmodeStatus);
    }
  });
});

// When a navigation action is undertaken
chrome.webNavigation.onCommitted.addListener(
  (navigationEvent) => {
    console.warn("dom loaded", navigationEvent);
    triggerDarkmode(navigationEvent.tabId);
  },
  { url: [{ urlMatches: docsUrl }] }
);

// Triggered on every click of the extension's icon
chrome.action.onClicked.addListener(() => {
  console.warn("clicked");
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
