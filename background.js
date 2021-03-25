const regex = new RegExp("^https*://docs.google.com/*", "g");

const docsUrl = "https://docs.google.com/*";
const docsDarkmodeStatus = "docsDarkmodeStatus";

let darkmodeStatus = true;

const removeCSS = () => {
  const cssNode = document.getElementById("docs-darkmode-extension");
  cssNode && cssNode.parentNode.removeChild(cssNode);
};

const insertCSS = () => {
  const id = "docs-darkmode-extension";

  if (document.getElementById(id)) return;

  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.type = "text/css";
  style.href = chrome.runtime.getURL("darkmode-direct.css");
  style.id = id;
  document.getElementsByTagName("head")[0].appendChild(style);
};

const triggerDarkmode = (id) => {
  if (darkmodeStatus) {
    chrome.scripting.executeScript({
      target: { tabId: id, allFrames: true },
      function: insertCSS,
    });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: id, allFrames: true },
      function: removeCSS,
    });
  }
};

// On initial load of the extension/chrome itself
chrome.storage.sync.get([docsDarkmodeStatus], (result) => {
  // If we have no previous setting then default to 'on'
  if (result[docsDarkmodeStatus]) {
    chrome.storage.sync.set({ [docsDarkmodeStatus]: true }, () => {
      darkmodeStatus = true;

      chrome.action.setIcon({ path: { 16: "icons/dark-on-16x16", 32: "icons/dark-on-32x32", 64: "icons/dark-on-64x64" } });

      // Tell every open docs tab to become dark mode
      chrome.tabs.query({ url: docsUrl }, (tabs) => {
        tabs.forEach((tab) => {
          triggerDarkmode(tab.id);
        });
      });
    });
  } else {
    darkmodeStatus = result[docsDarkmodeStatus];

    const onOrOff = darkmodeStatus ? "on" : "off";
    chrome.action.setIcon({ path: { 16: `icons/dark-${onOrOff}-16x16`, 32: `icons/dark-${onOrOff}-32x32`, 64: `icons/dark-${onOrOff}-64x64` } });
  }
});

// On refresh or the creation of a new docs tab send the darkmode message if necessary
chrome.webNavigation.onCommitted.addListener(
  (tab) => {
    triggerDarkmode(tab.tabId);
  },
  { url: [{ urlMatches: docsUrl }] }
);

chrome.webNavigation.onHistoryStateUpdated.addListener(
  (tab) => {
    triggerDarkmode(tab.tabId);
  },
  { url: [{ urlMatches: docsUrl }] }
);

// Triggered on every click of the extension's icon
chrome.action.onClicked.addListener(() => {
  chrome.storage.sync.set({ [docsDarkmodeStatus]: !darkmodeStatus }, () => {
    darkmodeStatus = !darkmodeStatus;

    const onOrOff = darkmodeStatus ? "on" : "off";
    chrome.action.setIcon({ path: { 16: `icons/dark-${onOrOff}-16x16.png`, 32: `icons/dark-${onOrOff}-32x32.png`, 64: `icons/dark-${onOrOff}-64x64.png` } });

    // Tell every open docs tab to toggle dark mode
    chrome.tabs.query({ url: docsUrl }, (tabs) => {
      tabs.forEach((tab) => {
        triggerDarkmode(tab.id);
      });
    });
  });
});
