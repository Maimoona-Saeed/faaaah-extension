# 💀 FAAAAH! — Rejection Email Detector

Plays a dramatic "FAAAAH" sound whenever you get a rejection email on Gmail or Outlook.

---

## 🔧 Installation

### Chrome / Edge (Chromium)
1. Open **chrome://extensions** (or edge://extensions)
2. Enable **Developer Mode** (toggle top-right)
3. Click **Load unpacked**
4. Select this `rejection-detector` folder
5. Done! Open Gmail or Outlook and the extension is active.

### Firefox
1. Open **about:debugging**
2. Click **This Firefox** → **Load Temporary Add-on**
3. Select the `manifest.json` file inside this folder
4. The extension loads (note: temporary, reloads needed after restart)

> **For permanent Firefox install:** Package as `.xpi` using `web-ext build` (run `npm install -g web-ext` first, then `web-ext build` in this folder).

### Safari (macOS)
Safari requires converting to a Safari Web Extension using Xcode:
1. Install Xcode from the Mac App Store
2. Run: `xcrun safari-web-extension-converter /path/to/rejection-detector`
3. Open the generated Xcode project and build/run it
4. Enable in Safari → Settings → Extensions

---

## 🎯 How It Works

The extension monitors your email for rejection signals using a scoring system:

- **Strong phrases** (3 pts): "we regret to inform", "not moving forward", "decided to pursue other candidates", etc.
- **Moderate keywords** (1 pt): "unfortunately", "other candidates", "highly competitive", etc.
- **Contextual patterns** (2 pts): "best of luck in your job search", "we had many applicants", etc.
- **Positive signals** (immediate skip): "pleased to offer", "congratulations", "welcome to the team", etc.

A score of **3+** triggers the FAAAAH 🔊

---

## 🔊 Customizing the Sound

Replace `sounds/faaaah.mp3` with any MP3 you want — keep the same filename.

---

## 📊 Popup Features

- Total rejection count
- This week's count
- History of last 15 detected emails (subject + service + time)
- Enable/disable toggle
- Test button to hear the sound

---

## ⚠️ Notes

- The extension only reads emails you **open** — it doesn't scan your inbox in bulk
- Email content is processed locally in your browser — nothing is sent to any server
- Works on: `mail.google.com`, `outlook.live.com`, `outlook.office.com`, `outlook.office365.com`
