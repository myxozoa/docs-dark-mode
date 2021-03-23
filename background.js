const regex = new RegExp("^https*://docs.google.com/*", "g");

// We can get the tab that was clicked from the onClicked listener but we would like to ensure it was the active tab
// to avoid confusion with multiple instances of docs (may not be strictly neccessary)
chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0].url.match(regex)) {
      // The { darkmode: "toggle" } message isn't read by the receiver it's just there because there needs to be a message
      chrome.tabs.sendMessage(tabs[0].id, { darkmode: "toggle" }, (response) => {
        // CHANGE LATER: Setting the badge text is easier than changing the icon for now.
        chrome.action.setBadgeText({ tabId: tabs[0].id, text: response.darkmodeStatus === true ? "ON" : "OFF" });
      });
    }
  });
});
