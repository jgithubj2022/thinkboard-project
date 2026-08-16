const API_URL = "http://localhost:5001/api/notes";


chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  const currentUrl = tab.url || "";
  const isProtectedPage = currentUrl.startsWith("chrome://") ||
    currentUrl.startsWith("edge://") ||
    currentUrl.startsWith("opera://") ||
    currentUrl.startsWith("brave://") ||
    currentUrl.startsWith("chrome-extension://") ||
    currentUrl.startsWith("https://chromewebstore.google.com/") ||
    currentUrl.startsWith("https://chrome.google.com/webstore/");

  if (isProtectedPage) return;

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
            method: "DELETE"
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
