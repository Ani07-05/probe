# Building Probe Browser

## Prerequisites
- Node.js 16+ installed
- npm installed

## Development
```bash
npm install
npm start
```

## Package the App

### For macOS
```bash
npm run package:mac
```
This creates:
- `release/Probe Browser-1.0.0.dmg` - Installable DMG
- `release/Probe Browser-1.0.0-mac.zip` - ZIP archive

### For Windows
```bash
npm run package:win
```
This creates:
- `release/Probe Browser Setup 1.0.0.exe` - Installer
- `release/Probe Browser-1.0.0-win.zip` - ZIP archive

### For Linux
```bash
npm run package:linux
```
This creates:
- `release/Probe Browser-1.0.0.AppImage` - AppImage
- `release/probe-browser_1.0.0_amd64.deb` - Debian package

### All Platforms
```bash
npm run package
```

## Output
All packaged files will be in the `release/` directory.

## App Features
- Chrome-like dark theme UI
- Multiple tabs
- Bookmarks & History (MySQL)
- Download manager
- Find in page
- Zoom controls
- DevTools integration
- Keyboard shortcuts

## Troubleshooting

### Missing Icon
If you see icon warnings, place your icon files in `assets/`:
- `assets/icon.icns` for macOS
- `assets/icon.ico` for Windows
- `assets/icon.png` (512x512) for Linux

### MySQL Connection
Make sure MySQL is running on localhost:3306 with:
- User: root
- Password: 12345678
- Or update connection in `src/main/main.ts`
