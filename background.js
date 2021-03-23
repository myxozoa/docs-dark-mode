const regex = new RegExp("^https*://docs.google.com/*", "g");

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0].url.match(regex)) {
      chrome.tabs.sendMessage(tabs[0].id, { darkmode: "toggle" }, function (response) {
        chrome.action.setBadgeText({ tabId: tabs[0].id, text: response.darkmodeStatus === true ? "ON" : "OFF" });
        console.log("darkmode on!", response);
      });
    }
  });
});
