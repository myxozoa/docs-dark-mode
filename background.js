const regex = new RegExp("^https*://docs.google.com/*", "g");

const docsUrl = "https://docs.google.com/*";
const docsDarkmodeStatus = "docsDarkmodeStatus";

let darkmode = true;

// On initial load of the extension/chrome itself
chrome.storage.sync.get([docsDarkmodeStatus], (result) => {
  // If we have no previous setting then default to 'on'
  if (result[docsDarkmodeStatus]) {
    chrome.storage.sync.set({ [docsDarkmodeStatus]: true }, () => {
      darkmode = true;

      chrome.action.setBadgeText({ text: "ON" });

      // Tell every open docs tab to become dark mode
      chrome.tabs.query({ url: docsUrl }, (tabs) => {
        tabs.forEach((tab) => {
          chrome.tabs.sendMessage(tab.id, { darkmode: true });
        });
      });
    });
  } else {
    darkmode = result[docsDarkmodeStatus];

    chrome.action.setBadgeText({ text: darkmode ? "ON" : "OFF" });
  }
});

// On refresh/creation of a new docs tab send the darkmode message if necessary
chrome.webNavigation.onCompleted.addListener(
  (tab) => {
    if (darkmode) {
      chrome.tabs.sendMessage(tab.tabId, { darkmode });
    }
  },
  { url: [{ urlMatches: docsUrl }] }
);

// Triggered on every click of the extension's icon
chrome.action.onClicked.addListener(() => {
  chrome.storage.sync.set({ [docsDarkmodeStatus]: !darkmode }, () => {
    darkmode = !darkmode;

    chrome.action.setBadgeText({ text: darkmode ? "ON" : "OFF" });

    // Tell every open docs tab to toggle dark mode
    chrome.tabs.query({ url: docsUrl }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { darkmode });
      });
    });
  });
});
