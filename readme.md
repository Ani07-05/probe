# Probe Browser

A Chrome-like browser built with Electron, React, and TypeScript.

---

## Features

- Multi-tab browsing with Chromium engine
- Bookmarks and history (stored in MySQL)
- Chrome dark theme
- Keyboard shortcuts
- Download manager
- Built-in DevTools

---

## Setup

**Requirements:**
- Node.js 18+
- MySQL 8+

**Install:**
```bash
git clone https://github.com/mrgear111/probe.git
cd probe
npm install
```

**Configure MySQL** in `src/main/database.ts` (default password: `12345678`)

**Run:**
```bash
npm run build
npm start
```

---

## Keyboard Shortcuts

- `Cmd/Ctrl + T` - New tab
- `Cmd/Ctrl + W` - Close tab
- `Cmd/Ctrl + R` - Reload
- `Cmd/Ctrl + F` - Find in page
- `Cmd/Ctrl + D` - Bookmark
- `F12` - DevTools

---

## Package

```bash
npm run package:mac    # macOS
npm run package:win    # Windows
npm run package:linux  # Linux
```

---

## Tech Stack

Electron 27, React 18, TypeScript 5, MySQL2, Webpack 5

---

## License

ISC
