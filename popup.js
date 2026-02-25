// Popup script

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function isThisWeek(isoString) {
  return (Date.now() - new Date(isoString).getTime()) < 7 * 24 * 3600000;
}

function renderRejections(rejections) {
  const list = document.getElementById("rejection-list");
  const totalEl = document.getElementById("total-count");
  const weekEl = document.getElementById("week-count");

  totalEl.textContent = rejections.length;
  weekEl.textContent = rejections.filter(r => isThisWeek(r.timestamp)).length;

  if (rejections.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="icon">🎯</div>No rejections detected yet.<br>Keep applying — the FAAAAH awaits!</div>`;
    return;
  }

  list.innerHTML = rejections.slice(0, 15).map(r => `
    <div class="rejection-item">
      <div class="rejection-subject">${escapeHtml(r.subject || "(No subject)")}</div>
      <div class="rejection-meta">
        <span class="badge ${r.service === 'Gmail' ? 'badge-gmail' : 'badge-outlook'}">${r.service}</span>
        <span>${timeAgo(r.timestamp)}</span>
      </div>
    </div>
  `).join("");
}

function escapeHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// Load rejections
chrome.runtime.sendMessage({ action: "getStats" }, (response) => {
  if (chrome.runtime.lastError) { return; }
  if (response && response.rejections) renderRejections(response.rejections);
});

// Load enabled state
chrome.storage.local.get(["enabled"], (result) => {
  document.getElementById("enabled-toggle").checked = result.enabled !== false;
});

document.getElementById("enabled-toggle").addEventListener("change", (e) => {
  chrome.storage.local.set({ enabled: e.target.checked });
});

// Reset button — clears all stored rejections
document.getElementById("reset-btn").addEventListener("click", () => {
  const btn = document.getElementById("reset-btn");
  chrome.storage.local.set({ rejections: [] }, () => {
    btn.textContent = "✓ CLEARED!";
    btn.style.color = "rgba(100,255,150,0.6)";
    btn.style.borderColor = "rgba(100,255,150,0.2)";
    setTimeout(() => {
      btn.textContent = "🗑 CLEAR ALL REJECTIONS";
      btn.style.color = "rgba(255,255,255,0.25)";
      btn.style.borderColor = "rgba(255,255,255,0.08)";
      renderRejections([]);
    }, 1200);
  });
});

// Test button — sends to background which injects into a real tab
document.getElementById("test-btn").addEventListener("click", () => {
  const btn = document.getElementById("test-btn");
  btn.textContent = "💀 F A A A A H !";
  btn.style.color = "#ff4444";
  btn.style.borderColor = "rgba(255,50,50,0.6)";
  btn.style.background = "rgba(255,50,50,0.15)";

  // Ask background worker to inject sound into a real browser tab
  chrome.runtime.sendMessage({ action: "testSound" }, () => {
    if (chrome.runtime.lastError) { console.error(chrome.runtime.lastError); }
  });

  setTimeout(() => {
    btn.textContent = "▶ TEST THE FAAAAH SOUND";
    btn.style.color = "#ff7070";
    btn.style.borderColor = "rgba(255,50,50,0.25)";
    btn.style.background = "rgba(255,50,50,0.1)";
  }, 2500);
});
