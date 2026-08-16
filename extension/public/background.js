const API_URL = "http://localhost:5001/api/notes";

const isProtectedUrl = (url = "") =>
  [
    "chrome://",
    "edge://",
    "opera://",
    "brave://",
    "chrome-extension://",
    "https://chromewebstore.google.com/",
    "https://chrome.google.com/webstore/"
  ].some((prefix) => url.startsWith(prefix));

chrome.commands.onCommand.addListener(async (command) => {
  try {
    if (command !== "start-voice-note") return;

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab?.id || isProtectedUrl(tab.url)) return;

    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: "START_VOICE_NOTE"
      });
    } catch {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["overlay.js"]
      });

      setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, {
          type: "START_VOICE_NOTE"
        }).catch((error) => {
          console.warn("Could not start voice input:", error.message);
        });
      }, 150);
    }
  } catch (error) {
    console.warn("Thinkboard shortcut could not run on this page:", error.message);
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  if (isProtectedUrl(tab.url)) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["overlay.js"]
    });
  } catch (error) {
    console.warn("Thinkboard could not open on this page:", error.message);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handleRequest = async () => {
    try {
      let response;

      switch (message.type) {
        case "GET_NOTES":
          response = await fetch(API_URL);
          break;
        case "CREATE_NOTE":
          response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message.note)
          });
          break;
        case "UPDATE_NOTE":
          response = await fetch(`${API_URL}/${message.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(message.note)
          });
          break;
        case "DELETE_NOTE":
          response = await fetch(`${API_URL}/${message.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
          });
          break;
        default:
          return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Request failed: ${response.status}`);
      }

      sendResponse({ ok: true, data });
    } catch (error) {
      sendResponse({ ok: false, error: error.message });
    }
  };

  handleRequest();
  return true;
});
