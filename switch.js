let darkmode = false;
const body = document.getElementsByTagName("body")[0];

if (darkmode) body.classList.add("darkmode");

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  // Currently prefer this over a `classList.toggle` because its explicitly driven by the value

  if (request.darkmode === true) {
    body.classList.add("darkmode");
  } else {
    body.classList.remove("darkmode");
  }

  darkmode = request.darkmode;
  // Not currently used by the extension
  sendResponse({ darkmodechange: "success" });
});
