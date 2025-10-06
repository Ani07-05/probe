import { app, BrowserWindow, ipcMain, BrowserView } from 'electron';
import * as path from 'path';
import { DatabaseManager } from './database';

let mainWindow: BrowserWindow | null = null;
let browserViews: Map<number, BrowserView> = new Map();
let activeTabId: number = 0;
let nextTabId: number = 1;
let dbManager: DatabaseManager;

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

  // Create initial tab
  createNewTab('https://www.google.com');

  mainWindow.on('closed', () => {
    mainWindow = null;
    browserViews.clear();
  });

  mainWindow.on('resize', () => {
    updateBrowserViewBounds();
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
  
  // Listen for navigation events
  browserView.webContents.on('did-start-loading', () => {
    if (activeTabId === tabId) {
      mainWindow?.webContents.send('loading-started', tabId);
    }
  });

  browserView.webContents.on('did-stop-loading', () => {
    if (activeTabId === tabId) {
      mainWindow?.webContents.send('loading-stopped', tabId);
    }
  });

  browserView.webContents.on('did-navigate', (_event: any, newUrl: string) => {
    if (activeTabId === tabId) {
      mainWindow?.webContents.send('url-changed', newUrl, tabId);
      saveHistory(newUrl);
    }
  });

  browserView.webContents.on('did-navigate-in-page', (_event: any, newUrl: string) => {
    if (activeTabId === tabId) {
      mainWindow?.webContents.send('url-changed', newUrl, tabId);
    }
  });

  browserView.webContents.on('page-title-updated', (_event: any, title: string) => {
    mainWindow?.webContents.send('title-updated', title, tabId);
    mainWindow?.webContents.send('tab-updated', tabId, {
      title,
      url: browserView.webContents.getURL()
    });
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

  const bounds = mainWindow.getBounds();
  browserView.setBounds({ 
    x: 0, 
    y: 120, // Increased from 80 to make room for tabs
    width: bounds.width, 
    height: bounds.height - 120 
  });
}

function closeTab(tabId: number) {
  const browserView = browserViews.get(tabId);
  if (!browserView) return;

  browserView.webContents.close();
  browserViews.delete(tabId);

  // If closing active tab, switch to another
  if (activeTabId === tabId) {
    const tabIds = Array.from(browserViews.keys());
    if (tabIds.length > 0) {
      switchToTab(tabIds[0]);
    } else {
      // No tabs left, create a new one
      createNewTab();
    }
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
