// Offscreen document — plays audio sequences
// Chrome MV3 cannot play audio in service workers or popups,
// but offscreen documents can. This is the official Google solution.

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "playFaaaah") {
    // Play FAHHH first, then chill guy after it ends
    const faaaah = document.getElementById("audio");
    faaaah.src = chrome.runtime.getURL("sounds/fahhhhh.mp3");
    faaaah.volume = 1.0;
    faaaah.currentTime = 0;
    faaaah.play().catch(err => console.error("Offscreen audio error:", err));

    // After FAHHH ends, play chill guy at lower volume
    faaaah.onended = () => {
      const chill = document.getElementById("audio2");
      chill.src = chrome.runtime.getURL("sounds/chill-guy.mp3");
      chill.volume = 0.5;
      chill.currentTime = 0;
      chill.play().catch(err => console.error("Chill guy audio error:", err));
    };
  }
});
