# Probe Browser 🚀

A modern, Chrome-inspired web browser built with Electron, React, and TypeScript.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

---

## ✨ Features

- 🌐 **Full Web Browsing** - Chromium-powered rendering engine
- 📑 **Multi-Tab Support** - Browse multiple pages simultaneously  
- 📚 **Bookmarks & History** - Save favorites and track browsing
- 🎨 **Chrome Dark Theme** - Familiar, polished UI
- ⌨️ **Keyboard Shortcuts** - Power user features (Cmd+T, Cmd+F, etc.)
- 🔍 **Find in Page** - Quick text search
- 💾 **Download Manager** - Track file downloads
- 🛠️ **DevTools** - Built-in Chrome DevTools

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- MySQL 8+

### Installation

\`\`\`bash
# Clone repository
git clone https://github.com/mrgear111/probe.git
cd probe

# Install dependencies
npm install

# Configure MySQL (edit src/main/database.ts)
# Default password: '12345678'

# Build and run
npm run build
npm start
\`\`\`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| \`Cmd/Ctrl + T\` | New Tab |
| \`Cmd/Ctrl + W\` | Close Tab |
| \`Cmd/Ctrl + R\` | Reload |
| \`Cmd/Ctrl + F\` | Find in Page |
| \`Cmd/Ctrl + D\` | Bookmark |
| \`F12\` | DevTools |

---

## 📦 Build & Package

\`\`\`bash
# Development
npm run dev

# Production build
npm run build
npm start

# Package for distribution
npm run package:mac    # macOS
npm run package:win    # Windows
npm run package:linux  # Linux
\`\`\`

---

## 🛠️ Tech Stack

- **Electron 27** - Desktop framework
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **MySQL2** - Database
- **Webpack 5** - Bundler

---

## 📁 Project Structure

\`\`\`
src/
├── main/              # Electron main process
│   ├── main.ts       # Window & tab management
│   ├── database.ts   # MySQL operations
│   └── preload.ts    # IPC bridge
├── renderer/          # React UI
│   ├── components/   # UI components
│   ├── App.tsx       # Root component
│   └── styles.css    # Styles
└── types/            # TypeScript definitions
\`\`\`

---

## 📝 License

ISC

---

**⭐ Star this repo if you find it useful!**
