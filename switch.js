chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  // Currently prefer this over a `classList.toggle` because its explicitly driven by the value
  if (request.darkmode === true) {
    document.getElementsByTagName("body")[0].classList.add("darkmode");
  } else {
    document.getElementsByTagName("body")[0].classList.remove("darkmode");
  }

  // Not currently used by the extension
  sendResponse({ darkmodechange: "success" });
});
