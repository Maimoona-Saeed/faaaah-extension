// FAAAAH! - Rejection Email Detector
// Monitors Gmail and Outlook for rejection emails

const REJECTION_KEYWORDS = {
  strong: [
    // Formal rejections
    "we regret to inform",
    "we are unable to offer",
    "not moving forward",
    "will not be moving forward",
    "decided not to move forward",
    "we won't be moving forward",
    "we have decided to pursue other candidates",
    "we will not be proceeding",
    "position has been filled",
    "after careful consideration, we have decided",
    "unfortunately, we will not",
    "we are not able to offer",
    "you have not been selected",
    "your application was not successful",
    "we've decided to go with another candidate",
    "we've chosen to move forward with other applicants",
    "not selected for",
    "we regret that",
    "we have chosen another candidate",
    "not be offered a position",
    "application has been unsuccessful",
    // Slang / informal rejections
    "straight up denied",
    "not goated",
    "wasn't goated",
    "weren't goated",
    "not selected",
    "sorry not sorry",
    "application denied",
    "denied",
    "not this time",
    "not the one",
    "not it",
    "you didn't make it",
    "didn't make the cut",
    "didn't make it through",
    "no cap but no",
    "we had to pass",
    "had to pass on you",
    "passing on your application",
    "we'll pass",
    "hard pass",
    "not what we're looking for",
    "not a match",
    "not the right vibe",
    "not the vibe",
    "wasn't the vibe"
  ],
  moderate: [
    // Formal
    "unfortunately",
    "regret to",
    "we appreciate your interest",
    "thank you for your interest",
    "keep your resume on file",
    "we will keep you in mind",
    "at this time we",
    "decided to pursue",
    "other candidates",
    "strong competition",
    "highly competitive",
    "we had many qualified",
    "difficult decision",
    "not a fit",
    "not the right fit",
    "doesn't align",
    "does not align",
    // Slang / informal
    "keep scrolling",
    "maybe next time",
    "better luck next time",
    "not fire enough",
    "wasn't fire",
    "not based enough",
    "keep grinding",
    "keep hustling",
    "not your time",
    "not meant to be",
    "not bussin",
    "mid application",
    "not giving",
    "no shot",
    "L",
    "took an l",
    "take the l",
    "sorry fam",
    "sorry bro",
    "sorry dude",
    "peace out",
    "not goated enough",
    "your takes",
    "application to"
  ]
};

// Contextual patterns — formal and slang
const REJECTION_CONTEXT_PATTERNS = [
  // Formal
  /thank you for (your time|applying|interviewing|your application)/i,
  /we (wish|hope) you (the best|success|well)/i,
  /we (will|would) encourage you to (apply|check) (again|back)/i,
  /future opportunities/i,
  /best (of luck|wishes) in your (search|job search|career)/i,
  /we've had (many|numerous|a large number of) (applicants|candidates|applications)/i,
  // Slang / informal
  /sorry.{0,10}(not sorry|but no|but nah|but nope)/i,
  /your (application|app|submission).{0,30}(denied|rejected|passed|not|nope)/i,
  /not (goated|bussin|fire|based|giving|it|the one|the vibe).{0,30}enough/i,
  /(keep|maybe).{0,10}(scrolling|next time|try again|grinding)/i,
  /straight up (denied|rejected|not|nah|no)/i,
  /took (a|the) (l|loss)/i,
  /(peace|later|bye).{0,10}(out|fam|bro|dude)/i,
  /not (what we|what you|giving us).{0,20}(looking for|need|want)/i,
  /(application|app).{0,10}(to be|for).{0,30}(denied|rejected|not selected)/i,
  /your (takes|content|work|vibe).{0,30}(not|wasn't|weren't).{0,20}(enough|it|fire|goated)/i
];

// Positive signals — if found, it's NOT a rejection
const POSITIVE_SIGNALS = [
  "pleased to offer",
  "happy to offer",
  "offer of employment",
  "we'd like to offer",
  "we would like to extend an offer",
  "congratulations",
  "you've been selected",
  "you have been selected",
  "welcome to the team",
  "excited to have you",
  "looking forward to having you",
  "moving forward with your application",
  "next steps",
  "background check",
  "start date",
  "onboarding",
  "you got the job",
  "you're hired",
  "you're in",
  "you made it",
  "you're goated",
  "welcome aboard"
];

let lastDetectedEmailId = null;
let isPlaying = false;

function isRejectionEmail(subject, body) {
  const text = `${subject} ${body}`.toLowerCase();

  // Check for positive signals first — if found, it's NOT a rejection
  for (const positive of POSITIVE_SIGNALS) {
    if (text.includes(positive.toLowerCase())) {
      return false;
    }
  }

  let score = 0;

  // Strong rejection phrases (3 points each)
  for (const phrase of REJECTION_KEYWORDS.strong) {
    if (text.includes(phrase.toLowerCase())) {
      score += 3;
    }
  }

  // Moderate keywords (1 point each)
  for (const phrase of REJECTION_KEYWORDS.moderate) {
    if (text.includes(phrase.toLowerCase())) {
      score += 1;
    }
  }

  // Contextual regex patterns (2 points each)
  for (const pattern of REJECTION_CONTEXT_PATTERNS) {
    if (pattern.test(text)) {
      score += 2;
    }
  }

  // Threshold: strong (3+) OR combination (moderate 4+)
  return score >= 3;
}

function playFaaaah() {
  // Show stamp immediately
  showRejectionToast();

  // Delay sound by 300ms so it syncs with stamp slam impact
  if (isPlaying) return;
  isPlaying = true;
  setTimeout(() => {
    chrome.runtime.sendMessage({ action: "playSound" }, () => {
      setTimeout(() => { isPlaying = false; }, 4000);
    });
  }, 300);
}

function showRejectionToast() {
  // Remove any existing toasts
  ["faaaah-stamp", "faaaah-toast", "faaaah-style"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });

  // Inject styles
  const style = document.createElement("style");
  style.id = "faaaah-style";
  style.textContent = `
    @keyframes faaaahStamp {
      0%   { transform: translate(-50%, -50%) scale(3) rotate(-15deg); opacity: 0; }
      30%  { transform: translate(-50%, -50%) scale(0.95) rotate(-8deg); opacity: 1; }
      45%  { transform: translate(-50%, -50%) scale(1.05) rotate(-8deg); }
      60%  { transform: translate(-50%, -50%) scale(1) rotate(-8deg); opacity: 1; }
      85%  { transform: translate(-50%, -50%) scale(1) rotate(-8deg); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(1) rotate(-8deg); opacity: 0; }
    }
    @keyframes faaaahCardIn {
      0%   { transform: translateY(40px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes faaaahCardOut {
      0%   { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(40px); opacity: 0; }
    }
    @keyframes faaaahPulse {
      0%, 100% { box-shadow: 0 8px 40px rgba(255,50,50,0.3); }
      50%       { box-shadow: 0 8px 60px rgba(255,50,50,0.6); }
    }
  `;
  document.head.appendChild(style);

  // ── STEP 1: Big red REJECTED stamp in center ──────────────────────────────
  const stamp = document.createElement("div");
  stamp.id = "faaaah-stamp";
  stamp.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1) rotate(-8deg);
    z-index: 9999999;
    pointer-events: none;
    animation: faaaahStamp 1.8s cubic-bezier(0.22,0.61,0.36,1) forwards;
  `;
  stamp.innerHTML = `
    <div style="
      font-family: 'Arial Black', Arial, sans-serif;
      font-size: clamp(60px, 10vw, 120px);
      font-weight: 900;
      color: #cc0000;
      border: 10px solid #cc0000;
      padding: 10px 30px;
      letter-spacing: 8px;
      text-transform: uppercase;
      opacity: 0.92;
      text-shadow: 3px 3px 0 rgba(0,0,0,0.3);
      filter: drop-shadow(0 0 20px rgba(200,0,0,0.5));
      background: rgba(255,255,255,0.05);
      border-radius: 6px;
    ">REJECTED</div>
  `;
  document.body.appendChild(stamp);

  // ── STEP 2: Stay Strong card slides up after stamp fades ──────────────────
  setTimeout(() => {
    stamp.remove();

    const card = document.createElement("div");
    card.id = "faaaah-toast";
    card.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 9999998;
      background: linear-gradient(145deg, #1a1a2e, #0f3460);
      color: white;
      padding: 20px 24px;
      border-radius: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      box-shadow: 0 8px 40px rgba(255,50,50,0.3);
      border: 1.5px solid rgba(255,80,80,0.35);
      animation: faaaahCardIn 0.5s cubic-bezier(0.22,0.61,0.36,1) forwards;
      cursor: pointer;
      width: 260px;
      text-align: center;
    `;
    card.innerHTML = `
      <div style="font-size: 42px; margin-bottom: 6px;">🤌</div>
      <div style="font-size: 20px; font-weight: 800; color: #ff6b6b; letter-spacing: 2px; margin-bottom: 6px;">STAY STRONG</div>
      <div style="font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 14px; line-height: 1.4;">Another one for the collection.<br>Your time is coming 💪</div>
      <div style="
        font-size: 10px;
        letter-spacing: 2px;
        color: rgba(255,255,255,0.25);
        text-transform: uppercase;
        border-top: 1px solid rgba(255,255,255,0.08);
        padding-top: 10px;
      ">Click to dismiss</div>
    `;
    document.body.appendChild(card);

    // Start pulse after slide-in completes
    setTimeout(() => {
      if (document.getElementById("faaaah-toast")) {
        card.style.animation = "faaaahPulse 2s ease-in-out infinite";
      }
    }, 500);

    card.addEventListener("click", () => {
      card.style.animation = "faaaahCardOut 0.4s ease-in forwards";
      setTimeout(() => card.remove(), 400);
    });

    // Auto-dismiss after 8 seconds
    setTimeout(() => {
      if (document.getElementById("faaaah-toast")) {
        card.style.animation = "faaaahCardOut 0.4s ease-in forwards";
        setTimeout(() => card.remove(), 400);
      }
    }, 8000);

  }, 1800); // show card after stamp animation completes
}

// ─── GMAIL DETECTOR ───────────────────────────────────────────────────────────

function extractGmailEmail() {
  // Subject
  const subjectEl = document.querySelector('h2[data-legacy-thread-id], .hP');
  const subject = subjectEl ? subjectEl.innerText : "";

  // Body - the currently open email
  const bodyEl = document.querySelector('.a3s.aiL, .a3s.aXjCH');
  const body = bodyEl ? bodyEl.innerText : "";

  return { subject, body };
}

function getGmailEmailId() {
  // Combine hash + subject so revisiting old emails always re-triggers
  const hash = window.location.hash;
  const subjectEl = document.querySelector('h2[data-legacy-thread-id], .hP');
  const subject = subjectEl ? subjectEl.innerText.trim() : "";
  return hash + "|" + subject;
}

function checkGmail() {
  const emailId = getGmailEmailId();
  if (!emailId || emailId === lastDetectedEmailId) return;

  // Only check when viewing an email (hash contains #inbox/ or similar)
  if (!emailId.match(/#(inbox|sent|spam|all|label|search)\/[a-zA-Z0-9]/)) return;

  const { subject, body } = extractGmailEmail();
  if (!subject && !body) return;

  if (isRejectionEmail(subject, body)) {
    lastDetectedEmailId = emailId;
    playFaaaah();
    chrome.runtime.sendMessage({
      action: "logRejection",
      subject: subject.substring(0, 100),
      service: "Gmail",
      timestamp: new Date().toISOString()
    });
  }
}

// ─── OUTLOOK DETECTOR ─────────────────────────────────────────────────────────

function extractOutlookEmail() {
  // Subject
  const subjectEl = document.querySelector('[data-app-section="ConversationContainer"] h1, .WRdEb, [role="heading"][aria-level="2"]');
  const subject = subjectEl ? subjectEl.innerText : "";

  // Body
  const bodyEl = document.querySelector('[data-app-section="ConversationContainer"] [role="document"], .ReadMsgBody, [class*="readingPane"] [role="document"]');
  const body = bodyEl ? bodyEl.innerText : "";

  return { subject, body };
}

function getOutlookEmailId() {
  return document.querySelector('[data-app-section="ConversationContainer"] h1')?.innerText || "";
}

function checkOutlook() {
  const emailId = getOutlookEmailId();
  if (!emailId || emailId === lastDetectedEmailId) return;

  const { subject, body } = extractOutlookEmail();
  if (!subject && !body) return;

  if (isRejectionEmail(subject, body)) {
    lastDetectedEmailId = emailId;
    playFaaaah();
    chrome.runtime.sendMessage({
      action: "logRejection",
      subject: subject.substring(0, 100),
      service: "Outlook",
      timestamp: new Date().toISOString()
    });
  }
}

// ─── ROUTER ───────────────────────────────────────────────────────────────────

function detectService() {
  const host = window.location.hostname;
  if (host === "mail.google.com") return "gmail";
  if (host.includes("outlook")) return "outlook";
  return null;
}

function startMonitoring() {
  const service = detectService();
  if (!service) return;

  const checkFn = service === "gmail" ? checkGmail : checkOutlook;

  // Initial check
  setTimeout(checkFn, 2000);

  // Watch for DOM changes (email navigation without page reload)
  const observer = new MutationObserver(() => {
    clearTimeout(window._faaaahTimer);
    window._faaaahTimer = setTimeout(checkFn, 800);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: false,
    attributes: false
  });

  // Also watch URL changes for Gmail
  if (service === "gmail") {
    let lastHash = window.location.hash;
    setInterval(() => {
      if (window.location.hash !== lastHash) {
        lastHash = window.location.hash;
        lastDetectedEmailId = null; // Reset on every navigation — allows old emails to retrigger
        setTimeout(checkFn, 1000);
      }
    }, 500);
  }
}

startMonitoring();

// ─── SOUND PLAYER ─────────────────────────────────────────────────────────────
// Listen for play commands from popup or background
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "triggerSound") {
    const soundUrl = chrome.runtime.getURL("sounds/fahhhhh.mp3");
    const audio = new Audio(soundUrl);
    audio.volume = 1.0;
    audio.play().catch(err => console.log("FAAAAH audio error:", err));
  }
});
