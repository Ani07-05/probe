# Probe Browser - Visual UI Guide

## 🎨 User Interface Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← → ↻     https://google.com                           ★ 📚 🕐   │ ← Navigation Bar (80px)
│                                                                      │    Purple Gradient
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                                                                      │
│                                                                      │
│                     BROWSER VIEW AREA                                │
│                   (Chromium Rendering)                               │
│                                                                      │
│                  Websites display here                               │
│                                                                      │
│                                                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## 📋 Component Details

### Navigation Bar Components

```
┌──────────────────────────────────────────────────────────────────┐
│  [←]  [→]  [↻]   [URL Input Field]  [Loading]  [★] [📚] [🕐]  │
│   1    2    3            4              5        6   7    8     │
└──────────────────────────────────────────────────────────────────┘

1. Back Button      - Navigate to previous page
2. Forward Button   - Navigate to next page
3. Reload Button    - Refresh current page
4. URL Input        - Type and enter URLs
5. Loading Spinner  - Shows when page is loading
6. Star Button      - Add current page to bookmarks
7. Books Button     - Open bookmarks sidebar
8. Clock Button     - Open history sidebar
```

### Bookmarks Sidebar

```
┌─────────────────────────────┐
│  Bookmarks               [×]│ ← Header (purple)
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Google Search       [🗑️] │ │ ← Bookmark item
│ │ https://google.com      │ │
│ │ Oct 6, 2025 10:30 AM    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ GitHub               [🗑️]│ │
│ │ https://github.com      │ │
│ │ Oct 6, 2025 10:15 AM    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ TypeScript Docs      [🗑️]│ │
│ │ https://typescript...   │ │
│ │ Oct 6, 2025 9:45 AM     │ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘
     350px width
```

### History Sidebar

```
┌─────────────────────────────┐
│  History                 [×]│ ← Header (purple)
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │  [Clear History]        │ │ ← Action button
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ React Documentation     │ │ ← History item
│ │ https://react.dev       │ │
│ │ Oct 6, 2025 11:05 AM    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Stack Overflow          │ │
│ │ https://stackoverflow..  │ │
│ │ Oct 6, 2025 11:00 AM    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ MDN Web Docs            │ │
│ │ https://developer.moz..  │ │
│ │ Oct 6, 2025 10:55 AM    │ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘
```

## 🎨 Color Palette

### Primary Colors
```
Gradient Start:  #667eea  ██████  (Purple-Blue)
Gradient End:    #764ba2  ██████  (Deep Purple)
Background:      #f5f5f5  ██████  (Light Gray)
White:           #ffffff  ██████
```

### Accent Colors
```
Link Color:      #667eea  ██████
Text Primary:    #333333  ██████
Text Secondary:  #999999  ██████
Delete Red:      #f44336  ██████
Hover Gray:      #f0f0f0  ██████
```

## 🎭 Button States

### Normal State
```
┌─────┐
│  ←  │  Background: rgba(255,255,255,0.2)
└─────┘  Color: white
```

### Hover State
```
┌─────┐
│  ←  │  Background: rgba(255,255,255,0.3)
└─────┘  Transform: translateY(-2px)
         Shadow: Enhanced
```

### Active State
```
┌─────┐
│  ←  │  Transform: translateY(0)
└─────┘  Pressed down effect
```

## 📐 Dimensions

### Window Sizes
- Default Width: 1280px
- Default Height: 800px
- Navigation Bar: 80px height
- Sidebar Width: 350px
- Button Size: 40px × 40px
- URL Input Height: 45px

### Spacing
- Navigation Gap: 10px
- Button Gap: 5px
- Padding: 15px (main), 20px (headers)
- Border Radius: 8px (buttons), 25px (URL input)

## ✨ Animations

### Sidebar Slide-In
```
@keyframes slideIn {
  from { transform: translateX(100%) }
  to   { transform: translateX(0) }
}
Duration: 0.3s
Easing: ease-out
```

### Loading Spinner
```
@keyframes spin {
  from { transform: rotate(0deg) }
  to   { transform: rotate(360deg) }
}
Duration: 1s linear infinite
```

### Button Hover
```
Transition: all 0.2s
Transform: translateY(-2px)
```

### Item Hover
```
Transform: translateX(-4px)
Background: #f0f0f0
Shadow: 0 2px 8px rgba(0,0,0,0.1)
```

## 🖱️ Interactive Elements

### Clickable Areas
1. **URL Input** - Type and submit URLs
2. **All Buttons** - Click for actions
3. **Bookmark Items** - Click to navigate
4. **History Items** - Click to visit
5. **Delete Buttons** - Click to remove
6. **Sidebar Close** - Click X button

### Keyboard Shortcuts
- `Enter` in URL bar - Navigate to URL
- URL bar auto-focuses on type

## 📱 Responsive Behavior

### Window Resize
- BrowserView auto-resizes with window
- Sidebar stays fixed at 350px
- Navigation bar stretches full width
- URL input expands to fill space

### Content Overflow
- Sidebar content scrolls vertically
- Custom scrollbar styling (8px width)
- URL text ellipsis on overflow
- Title truncation in lists

## 🎯 User Flow Examples

### Adding a Bookmark
```
1. Browse to desired website
2. Click ★ button in navigation bar
3. Bookmark saved with current title and URL
4. Click 📚 to view in sidebar
5. Click bookmark to navigate back
```

### Viewing History
```
1. Browse several websites
2. Click 🕐 button
3. See chronological list (newest first)
4. Click any item to revisit
5. Click "Clear History" to wipe all
```

### Basic Navigation
```
1. Type URL in input field (e.g., "google.com")
2. Press Enter
3. URL auto-adds "https://"
4. Page loads in BrowserView below
5. Use ← → to go back/forward
6. Click ↻ to reload
```

## 🎨 Design Philosophy

- **Minimal** - Clean, uncluttered interface
- **Modern** - Gradients and smooth animations
- **Intuitive** - Familiar browser controls
- **Fast** - Responsive interactions
- **Beautiful** - Purple theme with polish

## 💡 Tips

- All items in sidebars are clickable for navigation
- URLs automatically get https:// if protocol missing
- Loading spinner appears during page loads
- Hover states provide visual feedback
- Timestamps show when bookmarks/history were created
- Sidebar slides smoothly from right side
- Close button rotates on hover for style points!

---

**Built with ❤️ using Electron + React + TypeScript + MySQL**
