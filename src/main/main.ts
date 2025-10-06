import { app, BrowserWindow, ipcMain, BrowserView, Menu, MenuItem, dialog, shell } from 'electron';
import * as path from 'path';
import { DatabaseManager } from './database';

let mainWindow: BrowserWindow | null = null;
let browserViews: Map<number, BrowserView> = new Map();
let activeTabId: number = 0;
let nextTabId: number = 1;
let dbManager: DatabaseManager;
let resizeTimeout: NodeJS.Timeout | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the React app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Register keyboard shortcuts
  mainWindow.webContents.on('before-input-event', (event, input) => {
    const isMac = process.platform === 'darwin';
    const ctrl = isMac ? input.meta : input.control;

    if (ctrl && !input.shift && !input.alt) {
      switch (input.key.toLowerCase()) {
        case 't':
          event.preventDefault();
          createNewTab();
          break;
        case 'w':
          event.preventDefault();
          closeTab(activeTabId);
          break;
        case 'r':
          if (!input.shift) {
            event.preventDefault();
            const browserView = browserViews.get(activeTabId);
            browserView?.webContents.reload();
          }
          break;
        case 'f':
          event.preventDefault();
          mainWindow?.webContents.send('show-find-in-page');
          break;
        case 'l':
          event.preventDefault();
          mainWindow?.webContents.send('focus-url-bar');
          break;
        case 'd':
          event.preventDefault();
          const browserView = browserViews.get(activeTabId);
          if (browserView) {
            const url = browserView.webContents.getURL();
            const title = browserView.webContents.getTitle();
            mainWindow?.webContents.send('add-bookmark-request', url, title);
          }
          break;
        case '+':
        case '=':
          event.preventDefault();
          const bv = browserViews.get(activeTabId);
          if (bv) {
            const currentZoom = bv.webContents.getZoomLevel();
            bv.webContents.setZoomLevel(currentZoom + 0.5);
          }
          break;
        case '-':
        case '_':
          event.preventDefault();
          const bv2 = browserViews.get(activeTabId);
          if (bv2) {
            const currentZoom = bv2.webContents.getZoomLevel();
            bv2.webContents.setZoomLevel(currentZoom - 0.5);
          }
          break;
        case '0':
          event.preventDefault();
          const bv3 = browserViews.get(activeTabId);
          if (bv3) {
            bv3.webContents.setZoomLevel(0);
          }
          break;
        case 'p':
          event.preventDefault();
          const bv4 = browserViews.get(activeTabId);
          if (bv4) {
            bv4.webContents.print();
          }
          break;
        case 'u':
          event.preventDefault();
          const bv5 = browserViews.get(activeTabId);
          if (bv5) {
            const sourceURL = 'view-source:' + bv5.webContents.getURL();
            createNewTab(sourceURL);
          }
          break;
      }
    }

    // Tab switching with Ctrl+1-9
    if (ctrl && !input.shift && !input.alt && /^[1-9]$/.test(input.key)) {
      event.preventDefault();
      const tabIndex = parseInt(input.key) - 1;
      const tabIds = Array.from(browserViews.keys());
      if (tabIds[tabIndex]) {
        switchToTab(tabIds[tabIndex]);
      }
    }

    // F12 for DevTools
    if (input.key === 'F12') {
      event.preventDefault();
      const browserView = browserViews.get(activeTabId);
      if (browserView) {
        if (browserView.webContents.isDevToolsOpened()) {
          browserView.webContents.closeDevTools();
        } else {
          browserView.webContents.openDevTools();
        }
      }
    }

    // Ctrl+Shift+R for hard reload
    if (ctrl && input.shift && input.key.toLowerCase() === 'r') {
      event.preventDefault();
      const browserView = browserViews.get(activeTabId);
      browserView?.webContents.reloadIgnoringCache();
    }

    // Ctrl+Shift+Delete for clear browsing data
    if (ctrl && input.shift && input.key === 'Delete') {
      event.preventDefault();
      mainWindow?.webContents.send('show-clear-data-dialog');
    }
  });

  // Create initial tab
  createNewTab('https://www.google.com');

  mainWindow.on('closed', () => {
    // Clean up all browser views before clearing the map
    browserViews.forEach((view) => {
      try {
        if (!view.webContents.isDestroyed()) {
          view.webContents.close();
        }
      } catch (e) {
        console.error('Error cleaning up browser view:', e);
      }
    });
    
    mainWindow = null;
    browserViews.clear();
  });

  mainWindow.on('resize', () => {
    // Debounce resize events to prevent crashes
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      updateBrowserViewBounds();
      resizeTimeout = null;
    }, 100);
  });
}

function createNewTab(url: string = 'https://www.google.com'): number {
  if (!mainWindow) return -1;

  const tabId = nextTabId++;
  const browserView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  browserViews.set(tabId, browserView);
  
  // Add crash handlers
  browserView.webContents.on('render-process-gone', (event, details) => {
    console.error(`Tab ${tabId} crashed:`, details);
    if (details.reason !== 'clean-exit') {
      // Reload the tab after a crash
      setTimeout(() => {
        if (browserViews.has(tabId)) {
          browserView.webContents.reload();
        }
      }, 1000);
    }
  });

  browserView.webContents.on('unresponsive', () => {
    console.warn(`Tab ${tabId} became unresponsive`);
  });

  browserView.webContents.on('responsive', () => {
    console.log(`Tab ${tabId} became responsive again`);
  });
  
  // Listen for navigation events
  browserView.webContents.on('did-start-loading', () => {
    if (activeTabId === tabId && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('loading-started', tabId);
    }
  });

  browserView.webContents.on('did-stop-loading', () => {
    if (activeTabId === tabId && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('loading-stopped', tabId);
    }
  });

  browserView.webContents.on('did-navigate', (_event: any, newUrl: string) => {
    if (activeTabId === tabId && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('url-changed', newUrl, tabId);
      saveHistory(newUrl);
    }
  });

  browserView.webContents.on('did-navigate-in-page', (_event: any, newUrl: string) => {
    if (activeTabId === tabId && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('url-changed', newUrl, tabId);
    }
  });

  browserView.webContents.on('page-title-updated', (_event: any, title: string) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('title-updated', title, tabId);
      mainWindow.webContents.send('tab-updated', tabId, {
        title,
        url: browserView.webContents.getURL()
      });
    }
  });

  // Handle downloads
  browserView.webContents.session.on('will-download', (_event, item, webContents) => {
    const fileName = item.getFilename();
    const totalBytes = item.getTotalBytes();
    
    // Let user choose save location
    dialog.showSaveDialog(mainWindow!, {
      defaultPath: path.join(app.getPath('downloads'), fileName)
    }).then(result => {
      if (!result.canceled && result.filePath) {
        item.setSavePath(result.filePath);
        
        // Send download started event
        mainWindow?.webContents.send('download-started', {
          fileName,
          totalBytes,
          savePath: result.filePath
        });

        item.on('updated', (_event, state) => {
          if (state === 'interrupted') {
            mainWindow?.webContents.send('download-failed', fileName);
          } else if (state === 'progressing') {
            const percent = (item.getReceivedBytes() / totalBytes) * 100;
            mainWindow?.webContents.send('download-progress', {
              fileName,
              percent: percent.toFixed(1),
              receivedBytes: item.getReceivedBytes(),
              totalBytes
            });
          }
        });

        item.once('done', (_event, state) => {
          if (state === 'completed') {
            mainWindow?.webContents.send('download-completed', {
              fileName,
              savePath: item.getSavePath()
            });
          } else {
            mainWindow?.webContents.send('download-failed', fileName);
          }
        });
      } else {
        item.cancel();
      }
    });
  });

  // Handle context menu
  browserView.webContents.on('context-menu', (_event, params) => {
    const menu = new Menu();

    // Add link-specific options
    if (params.linkURL) {
      menu.append(new MenuItem({
        label: 'Open Link in New Tab',
        click: () => createNewTab(params.linkURL)
      }));
      menu.append(new MenuItem({
        label: 'Copy Link Address',
        click: () => require('electron').clipboard.writeText(params.linkURL)
      }));
      menu.append(new MenuItem({ type: 'separator' }));
    }

    // Add image-specific options
    if (params.mediaType === 'image') {
      menu.append(new MenuItem({
        label: 'Open Image in New Tab',
        click: () => createNewTab(params.srcURL)
      }));
      menu.append(new MenuItem({
        label: 'Save Image As...',
        click: () => browserView.webContents.downloadURL(params.srcURL)
      }));
      menu.append(new MenuItem({
        label: 'Copy Image Address',
        click: () => require('electron').clipboard.writeText(params.srcURL)
      }));
      menu.append(new MenuItem({ type: 'separator' }));
    }

    // Add text editing options
    if (params.isEditable) {
      menu.append(new MenuItem({ label: 'Cut', role: 'cut' }));
      menu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
      menu.append(new MenuItem({ label: 'Paste', role: 'paste' }));
      menu.append(new MenuItem({ type: 'separator' }));
    } else if (params.selectionText) {
      menu.append(new MenuItem({ label: 'Copy', role: 'copy' }));
      menu.append(new MenuItem({
        label: 'Search Google for "' + params.selectionText.substring(0, 20) + '"',
        click: () => createNewTab('https://www.google.com/search?q=' + encodeURIComponent(params.selectionText))
      }));
      menu.append(new MenuItem({ type: 'separator' }));
    }

    // Add navigation options
    menu.append(new MenuItem({
      label: 'Back',
      enabled: browserView.webContents.canGoBack(),
      click: () => browserView.webContents.goBack()
    }));
    menu.append(new MenuItem({
      label: 'Forward',
      enabled: browserView.webContents.canGoForward(),
      click: () => browserView.webContents.goForward()
    }));
    menu.append(new MenuItem({
      label: 'Reload',
      click: () => browserView.webContents.reload()
    }));
    menu.append(new MenuItem({ type: 'separator' }));

    // Add page options
    menu.append(new MenuItem({
      label: 'Save Page As...',
      click: () => {
        dialog.showSaveDialog(mainWindow!, {
          defaultPath: path.join(app.getPath('downloads'), 'page.html')
        }).then(result => {
          if (!result.canceled && result.filePath) {
            browserView.webContents.savePage(result.filePath, 'HTMLComplete');
          }
        });
      }
    }));
    menu.append(new MenuItem({
      label: 'Print...',
      click: () => browserView.webContents.print()
    }));
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({
      label: 'View Page Source',
      click: () => {
        const sourceURL = 'view-source:' + browserView.webContents.getURL();
        createNewTab(sourceURL);
      }
    }));
    menu.append(new MenuItem({
      label: 'Inspect Element',
      click: () => {
        browserView.webContents.inspectElement(params.x, params.y);
        if (!browserView.webContents.isDevToolsOpened()) {
          browserView.webContents.openDevTools();
        }
      }
    }));

    menu.popup();
  });

  browserView.webContents.loadURL(url);
  
  // Switch to the new tab
  switchToTab(tabId);
  
  // Notify renderer about new tab
  mainWindow?.webContents.send('tab-created', tabId, url);
  
  return tabId;
}

function switchToTab(tabId: number) {
  if (!mainWindow) return;
  
  const browserView = browserViews.get(tabId);
  if (!browserView) return;

  // Remove current BrowserView first to avoid conflicts
  try {
    mainWindow.removeBrowserView(mainWindow.getBrowserView() as any);
  } catch (e) {
    // Ignore if no view is attached
  }

  activeTabId = tabId;
  mainWindow.setBrowserView(browserView);
  updateBrowserViewBounds();
  
  // Send current tab info to renderer
  const url = browserView.webContents.getURL();
  const title = browserView.webContents.getTitle();
  mainWindow.webContents.send('tab-switched', tabId, url, title);
}

function updateBrowserViewBounds() {
  if (!mainWindow) return;
  
  const browserView = browserViews.get(activeTabId);
  if (!browserView) return;

  try {
    const bounds = mainWindow.getBounds();
    // Navigation bar (48px) + Tab bar (36px) = 84px
    const topOffset = 84;
    browserView.setBounds({ 
      x: 0, 
      y: topOffset,
      width: bounds.width, 
      height: bounds.height - topOffset 
    });
  } catch (error) {
    console.error('Error updating browser view bounds:', error);
  }
}

function closeTab(tabId: number) {
  const browserView = browserViews.get(tabId);
  if (!browserView) return;

  // If closing active tab, switch to another first
  if (activeTabId === tabId) {
    const tabIds = Array.from(browserViews.keys()).filter(id => id !== tabId);
    if (tabIds.length > 0) {
      // Switch to another tab before closing
      switchToTab(tabIds[0]);
    }
  }

  // Remove the BrowserView from the window
  try {
    if (mainWindow && mainWindow.getBrowserView() === browserView) {
      mainWindow.removeBrowserView(browserView);
    }
  } catch (e) {
    console.error('Error removing browser view:', e);
  }

  // Close the webContents and remove from map
  try {
    if (!browserView.webContents.isDestroyed()) {
      browserView.webContents.close();
    }
  } catch (e) {
    console.error('Error closing webContents:', e);
  }

  browserViews.delete(tabId);

  // If no tabs left, create a new one
  if (browserViews.size === 0) {
    createNewTab();
  }

  mainWindow?.webContents.send('tab-closed', tabId);
}

async function saveHistory(url: string) {
  try {
    if (!dbManager || !dbManager['connection']) return; // Skip if no database connection
    const browserView = browserViews.get(activeTabId);
    const title = browserView?.webContents.getTitle() || '';
    await dbManager.addHistory(url, title);
  } catch (error) {
    // Silently fail if database is not available
  }
}

// IPC Handlers
ipcMain.handle('navigate', async (_event: any, url: string) => {
  const browserView = browserViews.get(activeTabId);
  if (!browserView) return;
  
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  browserView.webContents.loadURL(url);
  return url;
});

ipcMain.handle('go-back', () => {
  const browserView = browserViews.get(activeTabId);
  if (browserView?.webContents.canGoBack()) {
    browserView.webContents.goBack();
  }
});

ipcMain.handle('go-forward', () => {
  const browserView = browserViews.get(activeTabId);
  if (browserView?.webContents.canGoForward()) {
    browserView.webContents.goForward();
  }
});

ipcMain.handle('reload', () => {
  const browserView = browserViews.get(activeTabId);
  browserView?.webContents.reload();
});

ipcMain.handle('get-current-url', () => {
  const browserView = browserViews.get(activeTabId);
  return browserView?.webContents.getURL() || '';
});

ipcMain.handle('new-tab', (_event: any, url?: string) => {
  return createNewTab(url);
});

ipcMain.handle('close-tab', (_event: any, tabId: number) => {
  closeTab(tabId);
});

ipcMain.handle('switch-tab', (_event: any, tabId: number) => {
  switchToTab(tabId);
});

ipcMain.handle('get-tabs', () => {
  const tabs = Array.from(browserViews.entries()).map(([id, view]) => ({
    id,
    url: view.webContents.getURL(),
    title: view.webContents.getTitle(),
    isActive: id === activeTabId
  }));
  return tabs;
});

// New Chrome-like features
ipcMain.handle('zoom-in', () => {
  const browserView = browserViews.get(activeTabId);
  if (browserView) {
    const currentZoom = browserView.webContents.getZoomLevel();
    browserView.webContents.setZoomLevel(currentZoom + 0.5);
  }
});

ipcMain.handle('zoom-out', () => {
  const browserView = browserViews.get(activeTabId);
  if (browserView) {
    const currentZoom = browserView.webContents.getZoomLevel();
    browserView.webContents.setZoomLevel(currentZoom - 0.5);
  }
});

ipcMain.handle('zoom-reset', () => {
  const browserView = browserViews.get(activeTabId);
  if (browserView) {
    browserView.webContents.setZoomLevel(0);
  }
});

ipcMain.handle('get-zoom-level', () => {
  const browserView = browserViews.get(activeTabId);
  return browserView?.webContents.getZoomLevel() || 0;
});

ipcMain.handle('find-in-page', (_event: any, text: string, options?: any) => {
  const browserView = browserViews.get(activeTabId);
  if (browserView && text) {
    browserView.webContents.findInPage(text, options);
  }
});

ipcMain.handle('stop-find-in-page', (_event: any, action: 'clearSelection' | 'keepSelection' | 'activateSelection' = 'clearSelection') => {
  const browserView = browserViews.get(activeTabId);
  if (browserView) {
    browserView.webContents.stopFindInPage(action);
  }
});

ipcMain.handle('toggle-devtools', () => {
  const browserView = browserViews.get(activeTabId);
  if (browserView) {
    if (browserView.webContents.isDevToolsOpened()) {
      browserView.webContents.closeDevTools();
    } else {
      browserView.webContents.openDevTools();
    }
  }
});

ipcMain.handle('print-page', () => {
  const browserView = browserViews.get(activeTabId);
  if (browserView) {
    browserView.webContents.print();
  }
});

ipcMain.handle('view-source', () => {
  const browserView = browserViews.get(activeTabId);
  if (browserView) {
    const sourceURL = 'view-source:' + browserView.webContents.getURL();
    createNewTab(sourceURL);
  }
});

ipcMain.handle('open-in-browser', (_event: any, url: string) => {
  shell.openExternal(url);
});

ipcMain.handle('mute-tab', (_event: any, tabId: number) => {
  const browserView = browserViews.get(tabId);
  if (browserView) {
    browserView.webContents.setAudioMuted(!browserView.webContents.isAudioMuted());
    return browserView.webContents.isAudioMuted();
  }
  return false;
});

ipcMain.handle('get-can-go-back', () => {
  const browserView = browserViews.get(activeTabId);
  return browserView?.webContents.canGoBack() || false;
});

ipcMain.handle('get-can-go-forward', () => {
  const browserView = browserViews.get(activeTabId);
  return browserView?.webContents.canGoForward() || false;
});

ipcMain.handle('add-bookmark', async (_event: any, url: string, title: string) => {
  try {
    if (!dbManager || !dbManager['connection']) {
      return { success: false, error: 'Database not connected' };
    }
    await dbManager.addBookmark(url, title);
    return { success: true };
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('get-bookmarks', async () => {
  try {
    if (!dbManager || !dbManager['connection']) return [];
    return await dbManager.getBookmarks();
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
});

ipcMain.handle('delete-bookmark', async (_event: any, id: number) => {
  try {
    if (!dbManager || !dbManager['connection']) {
      return { success: false, error: 'Database not connected' };
    }
    await dbManager.deleteBookmark(id);
    return { success: true };
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle('get-history', async () => {
  try {
    if (!dbManager || !dbManager['connection']) return [];
    return await dbManager.getHistory();
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
});

ipcMain.handle('clear-history', async () => {
  try {
    if (!dbManager || !dbManager['connection']) {
      return { success: false, error: 'Database not connected' };
    }
    await dbManager.clearHistory();
    return { success: true };
  } catch (error) {
    console.error('Error clearing history:', error);
    return { success: false, error: (error as Error).message };
  }
});

app.on('ready', async () => {
  // Initialize database
  dbManager = new DatabaseManager();
  await dbManager.initialize();
  
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
