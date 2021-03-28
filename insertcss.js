const id = "docs-darkmode-extension";
const cssURL = chrome.runtime.getURL("darkmode-direct.css");

const turnOn = () => document.getElementById(id).setAttribute("href", cssURL);

const turnOff = () => document.getElementById(id).removeAttribute("href");

// initialize link element at root
(function () {
  if (document.getElementById(id)) return;

  const styleElement = document.createElement("link");

  styleElement.setAttribute("type", "text/css");
  styleElement.setAttribute("rel", "stylesheet");
  styleElement.setAttribute("id", id);
  document.documentElement.appendChild(styleElement);
})();

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.darkmodeStatus) turnOn();
  else turnOff();

  sendResponse({ dontCare: "blank" });
});
