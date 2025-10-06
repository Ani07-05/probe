# Chrome-Style Dark Theme 🌙

Your browser now features a beautiful Chrome-inspired dark theme that's easy on the eyes!

## 🎨 Color Palette

### Main Colors
- **Background**: `#202124` (Dark charcoal)
- **Surface**: `#292a2d` (Slightly lighter)
- **Elevated**: `#3c4043` (Input fields, cards)
- **Borders**: `#5f6368` (Subtle borders)

### Text Colors
- **Primary Text**: `#e8eaed` (Near white)
- **Secondary Text**: `#9aa0a6` (Gray)
- **Links/Accents**: `#8ab4f8` (Chrome blue)

### Status Colors
- **Success**: `#81c995` (Green)
- **Error**: `#f28b82` (Red)
- **Warning**: `#fdd663` (Yellow)

## 🖼️ Chrome-Like Features

### Navigation Bar (48px height)
- **Dark background** with subtle bottom border
- **Rounded buttons** (32px) with hover effects
- **Frosted glass** URL bar with lock icon
- **Smooth transitions** on all interactions

### Tabs
- **Rounded top corners** like Chrome
- **Active tab indicator** (blue underline)
- **Fade-in close buttons** on hover
- **Compact 36px height** for more screen space

### Chrome-Inspired Elements
- ✅ **Circular buttons** with hover states
- ✅ **Subtle shadows** for depth
- ✅ **Blue accent color** (#8ab4f8)
- ✅ **Dark scrollbars** matching theme
- ✅ **Smooth animations** (0.15s transitions)
- ✅ **Lock icon** in URL bar (🔒)

## 🎯 Component Styling

### URL Bar
```css
Background: #303134 (inactive)
Background: #3c4043 (focused)
Text: #e8eaed
Placeholder: #9aa0a6
Border-radius: 24px
Height: 34px
```

### Buttons
```css
Background: transparent (default)
Background: #3c4043 (hover)
Background: #5f6368 (active)
Color: #9aa0a6 (default)
Color: #e8eaed (hover)
Border-radius: 50% (circular)
Size: 32x32px
```

### Tabs
```css
Background: #292a2d (inactive)
Background: #3c4043 (hover)
Background: #303134 (active)
Border-radius: 12px 12px 0 0
Active indicator: #8ab4f8 (2px bottom border)
Height: 32px
```

### Popups
```css
Background: #292a2d
Border: 1px solid #5f6368
Box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5)
Border-radius: 8px
```

## 🔍 Special Features

### Find in Page
- Dark popup with rounded corners
- Blue accent on focused input
- Transparent buttons with hover effects
- Positioned at top-right (48px from top)

### Download Manager
- Bottom-right floating panel
- Progress bars with blue gradient
- Shimmer animation for active downloads
- Green accent for completed items

### Zoom Controls
- Floating popup below button
- Circular +/- buttons
- Clickable percentage to reset
- Smooth fade-in animation

### Sidebar (Bookmarks/History)
- Full-height dark panel
- Smooth slide-in from right
- Dark scrollbar matching theme
- Card-style items with hover effects

## 🎭 Hover Effects

All interactive elements feature:
- **Smooth transitions** (0.15s ease)
- **Background color changes** on hover
- **No jumping** (no transform: scale)
- **Color shifts** from gray to white
- **Circular highlights** on buttons

## 📱 Responsive Design

The theme adapts beautifully to smaller screens:
- Sidebar width: 350px → 300px
- Download manager: 380px → 350px
- Find input: 220px → 200px
- Maintains dark theme across all sizes

## 🔧 Customization Tips

### Change Accent Color
Replace all instances of `#8ab4f8` with your color:
- Active tabs
- Links
- Progress bars
- Focused inputs

### Adjust Darkness
Modify these base colors in `styles.css`:
- `#202124` - Main background
- `#292a2d` - Panels/surfaces
- `#3c4043` - Inputs/cards

### Button Style
Change `border-radius: 50%` to:
- `6px` for rounded squares
- `4px` for slight rounding
- `0` for sharp edges

## 🌟 Chrome Comparison

| Feature | Chrome | Your Browser |
|---------|--------|--------------|
| Dark background | ✅ #202124 | ✅ #202124 |
| Blue accent | ✅ #8ab4f8 | ✅ #8ab4f8 |
| Circular buttons | ✅ | ✅ |
| Tab height | 36px | 36px |
| Navbar height | 48px | 48px |
| Smooth animations | ✅ | ✅ |
| Lock icon in URL | ✅ | ✅ |

## 💡 Pro Tips

1. **Consistency**: All hover states use `#3c4043` background
2. **Spacing**: 6-8px gaps between elements
3. **Icons**: Use emoji or system fonts for icons
4. **Accessibility**: High contrast text (#e8eaed on #202124)
5. **Performance**: CSS-only animations, no JavaScript

## 🎨 Before & After

### Before (Light Theme)
- Purple gradient navbar
- White tabs with borders
- Bright backgrounds
- Heavy shadows

### After (Dark Theme)
- Dark charcoal navbar
- Sleek rounded tabs
- Dark surfaces
- Subtle highlights

---

**Enjoy your Chrome-like dark theme!** 🚀

Perfect for:
- 🌙 Late-night browsing
- 👀 Reduced eye strain
- 🎮 Modern look & feel
- ⚡ Professional appearance
