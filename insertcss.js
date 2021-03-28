const cssURL = chrome.runtime.getURL("darkmode-direct.css");

const turnOn = () => {
  document.getElementById("docs-darkmode-extension").setAttribute("href", cssURL);
};

const turnOff = () => {
  document.getElementById("docs-darkmode-extension").removeAttribute("href");
};

const initializeLinkElement = () => {
  const id = "docs-darkmode-extension";

  if (document.getElementById(id)) return;

  console.warn("inserting css via injection script");

  const style = document.createElement("link");

  style.setAttribute("type", "text/css");
  style.setAttribute("rel", "stylesheet");
  style.setAttribute("id", id);
  // style.setAttribute("href", chrome.runtime.getURL("darkmode-direct.css"));
  document.documentElement.appendChild(style);
};

initializeLinkElement();

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.darkmodeStatus) turnOn();
  else turnOff();

  sendResponse({ dontCare: "blank" });
});
