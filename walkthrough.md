# Sign Language Translator — Completed Walkthrough

## What Was Built

A full-stack Sign Language Translator using:
- **Flask** (Python backend) with a `/predict` REST API
- **MediaPipe Tasks** for real-time hand landmark detection (21 keypoints)
- **Heuristic finger-state mapping** to recognize signs (no training required)
- **Vanilla JS** with Webcam API for live frame capture
- **Web Speech API** for text-to-speech output
- **Glassmorphism UI** with dark mode and animated blobs

---

## Project Structure

```
Sign Langauge Translator/
├── app.py               ← Flask server (/ and /predict endpoints)
├── gesture_model.py     ← MediaPipe hand landmarker + gesture mapping logic
├── requirements.txt     ← Python dependencies
├── hand_landmarker.task ← Downloaded MediaPipe model (auto-downloaded on first run)
├── templates/
│   └── index.html       ← Main UI page
└── static/
    ├── style.css        ← Glassmorphism dark theme
    └── js/
        └── script.js    ← Webcam capture + fetch + Web Speech API
```

---

## Live Screenshot

![Sign Language Translator — "V / Peace" detected in real time](file:///C:/Users/omkar/.gemini/antigravity/brain/8aa874fa-29a2-4165-97c1-4ba9f0c42da7/ui_screenshot.png)

**The browser subagent verified this while testing, and it correctly detected the "V / Peace" sign shown.**

---

## How to Run

```bash
# From the project directory (venv already set up):
python app.py
```

Then open **http://127.0.0.1:5000** in your browser.

> On first run, [gesture_model.py](file:///c:/Users/omkar/Downloads/Sign%20Langauge%20Translator/gesture_model.py) downloads `hand_landmarker.task` (~5 MB) from Google's CDN automatically.

---

## Supported Gestures

| Gesture | Sign |
|---|---|
| All fingers open | Hello / Open Hand |
| Fist (all closed) | S |
| Thumb only up | Good / Thumbs Up |
| Index + Thumb up | L |
| Index only up | 1 / D |
| Index + Middle up | V / Peace |
| Index + Middle + Ring up | W |
| Thumb + Pinky up | Y (Hang Loose) |
| Pinky only up | I |

---

## Recording

![App demo recording](file:///C:/Users/omkar/.gemini/antigravity/brain/8aa874fa-29a2-4165-97c1-4ba9f0c42da7/verify_sign_language_ui_1774099403258.webp)
