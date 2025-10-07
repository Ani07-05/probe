# Maximized Window State Fix

## Issue
When the browser window is maximized on macOS, the tab bar maintains 80px of left padding (intended for traffic lights), creating unnecessary empty space. In maximized mode, traffic lights move to their standard position and don't require this padding.

## Solution
Implemented dynamic tab bar padding adjustment based on window maximize state:

### Changes Made

#### 1. Main Process (src/main/main.ts)
- Added event listeners for `maximize` and `unmaximize` window events
- Broadcasts window state changes to renderer process via IPC
- Sends initial window state on application load

```typescript
// Handle maximize/unmaximize events
mainWindow.on('maximize', () => {
  mainWindow?.webContents.send('window-state-changed', { maximized: true });
});
mainWindow.on('unmaximize', () => {
  mainWindow?.webContents.send('window-state-changed', { maximized: false });
});
// Send initial state on load
mainWindow.webContents.once('did-finish-load', () => {
  const isMaximized = mainWindow?.isMaximized() || false;
  mainWindow?.webContents.send('window-state-changed', { maximized: isMaximized });
});
```

#### 2. Preload Script (src/main/preload.ts)
- Exposed `onWindowStateChanged` event listener to renderer process
- Bridges IPC communication between main and renderer

```typescript
onWindowStateChanged: (callback: (state: { maximized: boolean }) => void) => {
  ipcRenderer.on('window-state-changed', (_event: any, state: { maximized: boolean }) => callback(state));
},
```

#### 3. TypeScript Definitions (src/types/electron.d.ts)
- Added type definition for window state event listener

```typescript
onWindowStateChanged: (callback: (state: { maximized: boolean }) => void) => void;
```

#### 4. App Component (src/renderer/App.tsx)
- Added `isMaximized` state using React hooks
- Registered event listener for window state changes
- Passes `isMaximized` prop to TabBar component

```typescript
const [isMaximized, setIsMaximized] = useState<boolean>(false);

useEffect(() => {
  // Listen for window state changes
  window.electronAPI.onWindowStateChanged((state: { maximized: boolean }) => {
    setIsMaximized(state.maximized);
  });
  // ... other event listeners
}, []);
```

#### 5. TabBar Component (src/renderer/components/TabBar.tsx)
- Updated props interface to accept `isMaximized` boolean
- Applied conditional CSS class based on maximized state

```typescript
interface TabBarProps {
  tabs: Tab[];
  onNewTab: () => void;
  onCloseTab: (tabId: number) => void;
  onSwitchTab: (tabId: number) => void;
  isMaximized: boolean;
}

<div className={`tab-bar ${isMaximized ? 'maximized' : ''}`}>
```

#### 6. Styles (src/renderer/styles.css)
- Added CSS rule for maximized state that removes traffic light padding

```css
.tab-bar.maximized {
  padding-left: 4px; /* Remove traffic light padding when maximized */
}
```

## Behavior

### Normal Window
- Tab bar: `padding-left: 80px`
- Traffic lights positioned with tab bar
- Adequate space for traffic light buttons

### Maximized Window
- Tab bar: `padding-left: 4px`
- No extra space for traffic lights
- Consistent padding with right side

## Testing
1. Start the application: `npm start`
2. Test normal window state - tabs should have 80px left padding
3. Click maximize button (green traffic light)
4. Verify tabs shift left and padding is reduced to 4px
5. Click unmaximize button
6. Verify tabs shift back right with 80px padding restored

## Technical Details
- **IPC Event**: `window-state-changed`
- **State Flow**: Main process → IPC → Preload → Renderer → React State → CSS Class
- **CSS Specificity**: `.tab-bar.maximized` overrides `.tab-bar` padding
- **Performance**: State changes are instant, no visible lag

## Files Modified
1. `src/main/main.ts` - Window event handlers
2. `src/main/preload.ts` - IPC bridge
3. `src/types/electron.d.ts` - Type definitions
4. `src/renderer/App.tsx` - State management
5. `src/renderer/components/TabBar.tsx` - Props and conditional rendering
6. `src/renderer/styles.css` - Conditional styling

## Build Information
- Main bundle: 788 KB
- Preload bundle: 2.81 KB
- Renderer bundle: 172 KB
- All builds successful with no errors
