// Background service worker
// Uses Offscreen API to play audio (only reliable MV3 method)

async function playSound() {
  // Create offscreen document if it doesn't exist yet
  const existing = await chrome.offscreen.hasDocument();
  if (!existing) {
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play FAAAAH rejection sound"
    });
  }
  // Send play command to the offscreen document
  chrome.runtime.sendMessage({ action: "playFaaaah" });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  // Called by content.js when rejection detected in email tab
  if (message.action === "playSound") {
    playSound();
    sendResponse({ ok: true });
  }

  // Called by popup test button
  if (message.action === "testSound") {
    playSound();
    sendResponse({ ok: true });
  }

  if (message.action === "logRejection") {
    chrome.storage.local.get(["rejections"], (result) => {
      const rejections = result.rejections || [];
      // Always log — let rejections pile up every time email is opened
      rejections.unshift({
        subject: message.subject,
        service: message.service,
        timestamp: message.timestamp
      });
      chrome.storage.local.set({ rejections: rejections.slice(0, 50) });
    });
    sendResponse({ ok: true });
  }

  if (message.action === "getStats") {
    chrome.storage.local.get(["rejections"], (result) => {
      sendResponse({ rejections: result.rejections || [] });
    });
    return true; // async
  }

  return true;
});
