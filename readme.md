# Probe Browser

A modern Electron-based web browser built with React, TypeScript, and MySQL.

## Features

- 🌐 Full web browsing capabilities powered by Chromium
- ⚡ Built with Electron + React + TypeScript
- 🗄️ MySQL database for bookmarks and history
- 📚 Bookmark management
- 🕐 Browsing history tracking
- 🎨 Modern, gradient UI design
- ⌨️ Keyboard navigation support

## Prerequisites

Before running the application, make sure you have:

1. **Node.js** (v16 or higher) ✅
2. **MySQL** installed and running locally
   - Default connection: `localhost:3306`
   - Username: `root`
   - Password: `` (empty) - Update in `src/main/database.ts` if different

## Installation

Dependencies are already installed! ✅

Make sure MySQL is running on your system. The application will automatically create the `probe_browser` database and required tables on first run.

## Database Configuration

Update MySQL credentials in `src/main/database.ts` if needed:

```typescript
this.connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Change this to your MySQL password
  database: 'probe_browser',
});
```

## Running the Application

### Development Mode

1. Start the development build (in one terminal):
```bash
npm run dev
```

2. Start Electron (in another terminal):
```bash
npm start
```

### Production Build

Build and run:
```bash
npm run build
npm start
```

Package as a distributable app:
```bash
npm run package
```

## Project Structure

```
probe/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.ts     # Main process entry point
│   │   ├── database.ts # MySQL database manager
│   │   └── preload.ts  # Preload script for IPC
│   ├── renderer/       # React renderer process
│   │   ├── components/ # React components
│   │   ├── App.tsx     # Main React component
│   │   ├── index.tsx   # Renderer entry point
│   │   ├── index.html  # HTML template
│   │   └── styles.css  # Application styles
│   └── types/          # TypeScript type definitions
├── dist/               # Compiled output
├── webpack.*.config.js # Webpack configurations
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

## Technologies Used

- **Electron** - Desktop application framework
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **MySQL2** - MySQL database driver
- **Webpack** - Module bundler
- **Chromium** - Web rendering engine (bundled with Electron)
- **Node.js** - JavaScript runtime

## Features Overview

### Navigation
- ← → Back/Forward buttons
- URL bar with auto-protocol detection (automatically adds https://)
- ↻ Reload functionality
- Loading indicator with animation

### Bookmarks
- ★ Add current page to bookmarks
- 📚 View all bookmarks in sidebar
- 🗑️ Delete bookmarks
- Click to navigate to bookmarked pages
- Timestamps for when bookmarks were created

### History
- 🕐 Automatic history tracking
- View recent browsing history (last 100 visits)
- Clear all history option
- Click to revisit pages
- Timestamps for each visit

## UI Features

- Beautiful gradient purple theme
- Smooth animations and transitions
- Sidebar with bookmarks and history
- Responsive button states with hover effects
- Loading indicators
- Clean, modern design

## Notes

- The browser view is positioned below the navigation bar (80px from top)
- All navigation events are automatically tracked in the history
- URLs without protocols automatically get `https://` prepended
- The database connection errors are logged to the console for debugging

## License

ISC
