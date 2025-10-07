# Probe Browser 🚀

A modern, Chrome-inspired web browser built with **Electron**, **React**, and **TypeScript**.

![Probe Browser](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Electron](https://img.shields.io/badge/Electron-27.3.11-47848F.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)

---

## ✨ Features

### 🌐 Core Browsing
- **Full Chromium Engine** - Fast, reliable web rendering
- **Multi-Tab Support** - Browse multiple pages simultaneously
- **Chrome-like UI** - Dark theme with familiar navigation
- **Smart URL Bar** - Auto-detects and adds protocols

### � Data Management
- **Bookmarks System** - Save and organize favorite sites
- **Browsing History** - Track visited pages with timestamps
- **MySQL Database** - Persistent local storage
- **Search & Filter** - Quick access to saved data

### 🎨 User Experience
- **Dark Theme** - Chrome-exact color scheme (#202124)
- **Traffic Light Controls** - Native macOS window controls
- **Smooth Animations** - Polished UI transitions
- **Keyboard Shortcuts** - Power user features
- **Find in Page** - Quick text search (Cmd+F)
- **Download Manager** - Track file downloads

### 🛠️ Developer Features
- **DevTools Integration** - Built-in Chrome DevTools
- **Context Menus** - Right-click functionality
- **View Source** - Inspect page HTML
- **Zoom Controls** - Adjust page magnification

---

## 🔧 Prerequisites

| Requirement | Version | Notes |
|------------|---------|-------|
| **Node.js** | 18+ | JavaScript runtime |
| **npm** | 9+ | Package manager |
| **MySQL** | 8+ | Database server |

---

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/mrgear111/probe.git
cd probe
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Database
Update MySQL credentials in `src/main/database.ts`:
```typescript
this.connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345678', // Change to your MySQL password
  database: 'probe_browser',
});
```

The database and tables will be created automatically on first run.

### 4. Build the Application
```bash
npm run build
```

### 5. Launch
```bash
npm start
```

---

## 🚀 Usage

### Development Mode
```bash
# Terminal 1: Start webpack dev server
npm run dev

# Terminal 2: Launch Electron
npm start
```

### Production Build
```bash
# Build all bundles
npm run build

# Run the app
npm start
```

### Package for Distribution
```bash
# macOS
npm run package:mac

# Windows
npm run package:win

# Linux
npm run package:linux
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + T` | New Tab |
| `Cmd/Ctrl + W` | Close Tab |
| `Cmd/Ctrl + R` | Reload Page |
| `Cmd/Ctrl + F` | Find in Page |
| `Cmd/Ctrl + L` | Focus URL Bar |
| `Cmd/Ctrl + D` | Add Bookmark |
| `Cmd/Ctrl + H` | View History |
| `Cmd/Ctrl + Shift + B` | View Bookmarks |
| `Cmd/Ctrl + Shift + R` | Hard Reload |
| `Cmd/Ctrl + 1-9` | Switch to Tab |
| `F12` | Toggle DevTools |

---

## 📁 Project Structure

```
probe/
├── src/
│   ├── main/                      # Electron Main Process
│   │   ├── main.ts               # Window & IPC management
│   │   ├── database.ts           # MySQL operations
│   │   └── preload.ts            # IPC bridge
│   │
│   ├── renderer/                  # React UI
│   │   ├── components/           # React components
│   │   │   ├── TabBar.tsx       # Tab management
│   │   │   ├── NavigationBar.tsx # URL bar & controls
│   │   │   ├── Sidebar.tsx       # Bookmarks/History
│   │   │   ├── FindInPage.tsx    # Search overlay
│   │   │   └── DownloadManager.tsx
│   │   ├── App.tsx               # Root component
│   │   ├── index.tsx             # Entry point
│   │   └── styles.css            # Global styles
│   │
│   └── types/                     # TypeScript definitions
│       └── electron.d.ts
│
├── dist/                          # Compiled output
├── webpack.*.config.js            # Build configs
└── package.json                   # Dependencies
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Electron 27** | Desktop framework |
| **React 18** | UI library |
| **TypeScript 5** | Type safety |
| **Webpack 5** | Module bundler |
| **MySQL2** | Database driver |
| **Chromium** | Web engine |

---

## 🎨 Design

### Color Palette (Chrome Dark Theme)
- **Background**: `#202124`
- **Surface**: `#292a2d`
- **Input**: `#303134`
- **Border**: `#3c4043`
- **Accent**: `#8ab4f8`
- **Text**: `#e8eaed`

### Layout
- **Tab Bar**: 36px height, 80px left padding (for traffic lights)
- **Navigation Bar**: 48px height
- **Total UI Height**: 84px
- **BrowserView Offset**: Positioned below UI at Y=84px

---

## 📊 Database Schema

### Tables

**bookmarks**
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Auto-increment primary key |
| url | TEXT | Bookmarked URL |
| title | VARCHAR(255) | Page title |
| created_at | TIMESTAMP | Creation timestamp |

**history**
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Auto-increment primary key |
| url | TEXT | Visited URL |
| title | VARCHAR(255) | Page title |
| visited_at | TIMESTAMP | Visit timestamp |

---

## 🐛 Known Issues

- **macOS Only**: Traffic lights optimized for macOS (Windows/Linux support in progress)
- **MySQL Required**: Database must be running for bookmarks/history

---

## 🗺️ Roadmap

- [ ] Light theme support
- [ ] Tab drag-and-drop reordering
- [ ] Session restore
- [ ] Extensions support
- [ ] Multi-platform testing
- [ ] Password manager
- [ ] Reading mode
- [ ] Screenshot tool

---

## 📝 License

ISC License - see LICENSE file for details

---

## 👨‍💻 Author

**mrgear111**
- GitHub: [@mrgear111](https://github.com/mrgear111)

---

## 🙏 Acknowledgments

- Built with Electron's powerful framework
- Inspired by Google Chrome's design
- Chromium engine for web rendering

---

**⭐ Star this repo if you find it useful!**
