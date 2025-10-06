# Electron Browser Crash Fixes

## Issue Summary
The application was experiencing segmentation faults (SIGSEGV) during mouse interactions, particularly when handling BrowserView operations like tab switching, closing, and window resizing.

## Root Causes Identified

1. **Improper BrowserView Cleanup**: BrowserViews were not being properly removed from the window before being destroyed
2. **Race Conditions**: Rapid resize events and tab switches caused concurrent access to BrowserView objects
3. **Missing Null Checks**: Event handlers didn't verify that objects still existed before accessing them
4. **Memory Access Violations**: Attempting to access destroyed BrowserView objects during cursor hit tests

## Fixes Applied

### 1. **Safe Tab Switching** (`switchToTab`)
- Added proper removal of current BrowserView before attaching a new one
- Wrapped in try-catch to handle edge cases gracefully
- Prevents multiple views from being attached simultaneously

### 2. **Improved Tab Closing** (`closeTab`)
- Switch to another tab BEFORE closing the current one (prevents accessing destroyed views)
- Properly remove BrowserView from window before closing webContents
- Added comprehensive error handling
- Ensures at least one tab always exists

### 3. **Debounced Resize Handler**
- Added 100ms debounce to window resize events
- Prevents rapid successive bounds updates that could cause crashes
- Clears pending timeout before setting a new one

### 4. **Enhanced Cleanup on Window Close**
- Iterate through all BrowserViews and close their webContents properly
- Check if webContents is destroyed before attempting to close
- Comprehensive error handling during cleanup

### 5. **Safer Event Handlers**
- Added checks for `mainWindow.isDestroyed()` before sending IPC messages
- Prevents sending messages to destroyed windows
- All navigation events now verify window and tab validity

### 6. **Crash Recovery System**
- Added `render-process-gone` handler to detect tab crashes
- Automatic reload of crashed tabs (after 1 second delay)
- Added `unresponsive` and `responsive` handlers for monitoring

### 7. **Bounds Update Protection**
- Wrapped `setBounds` call in try-catch
- Prevents crashes if BrowserView is destroyed during resize

## Technical Details

### Before:
```typescript
function switchToTab(tabId: number) {
  mainWindow.setBrowserView(browserView);  // Could attach while another is active
  updateBrowserViewBounds();
}
```

### After:
```typescript
function switchToTab(tabId: number) {
  try {
    mainWindow.removeBrowserView(mainWindow.getBrowserView());  // Remove current first
  } catch (e) {
    // Ignore if no view attached
  }
  mainWindow.setBrowserView(browserView);  // Now safe to attach
  updateBrowserViewBounds();
}
```

## Testing Recommendations

1. **Tab Operations**:
   - Open multiple tabs
   - Rapidly switch between tabs
   - Close tabs in different orders
   - Close the active tab

2. **Window Operations**:
   - Resize window rapidly
   - Minimize/maximize window
   - Move window between displays

3. **Navigation**:
   - Navigate to multiple URLs in quick succession
   - Use back/forward buttons rapidly
   - Reload while loading

4. **Stress Testing**:
   - Open 10+ tabs
   - Navigate all tabs simultaneously
   - Close all tabs except one
   - Resize while switching tabs

## Known Limitations

1. **macOS Specific**: The original crash was on macOS 15.6.1 with Apple M3 chip
2. **Chromium Engine**: Some crashes may still occur due to underlying Chromium issues
3. **Memory Usage**: Multiple BrowserViews consume significant memory

## Prevention Measures

- Always remove BrowserView before destroying
- Debounce rapid UI events
- Check object validity before access
- Use try-catch for Electron API calls
- Implement crash recovery mechanisms

## Build & Run

```bash
npm run build
npm start
```

## Monitoring

Watch the console for:
- "Tab X crashed" - indicates render process crash
- "Tab X became unresponsive" - indicates hanging tab
- "Error removing browser view" - indicates cleanup issues
- "Error updating browser view bounds" - indicates resize issues

## Additional Notes

- The crash occurred at memory address `0x0000000000000478`, indicating null pointer dereference
- The crash was in Chromium's hit test code (`-[NSView hitTest:]`)
- This suggests the BrowserView or its underlying NSView was deallocated while still being referenced
- All fixes focus on ensuring proper lifecycle management of BrowserView objects
