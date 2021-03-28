const id = "docs-darkmode-extension";
const cssURL = chrome.runtime.getURL("darkmode-direct.css");

const turnOn = () => document.getElementById(id).setAttribute("href", cssURL);

const turnOff = () => document.getElementById(id).removeAttribute("href");

const initializeLinkElement = () => {
  if (document.getElementById(id)) return;

  const style = document.createElement("link");

  style.setAttribute("type", "text/css");
  style.setAttribute("rel", "stylesheet");
  style.setAttribute("id", id);
  document.documentElement.appendChild(style);
};

initializeLinkElement();

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.darkmodeStatus) turnOn();
  else turnOff();

  sendResponse({ dontCare: "blank" });
});
