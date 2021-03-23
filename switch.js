let darkmode = false;

chrome.runtime.onMessage.addListener((_, _, sendResponse) => {
  darkmode = !darkmode;

  if (darkmode === true) {
    document.getElementsByTagName("body")[0].classList.add("darkmode");
  } else {
    document.getElementsByTagName("body")[0].classList.remove("darkmode");
  }

  sendResponse({ darkmodeStatus: darkmode });
});
