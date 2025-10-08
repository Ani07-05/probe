import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  navigate: (url: string) => ipcRenderer.invoke('navigate', url),
  goBack: () => ipcRenderer.invoke('go-back'),
  goForward: () => ipcRenderer.invoke('go-forward'),
  reload: () => ipcRenderer.invoke('reload'),
  getCurrentUrl: () => ipcRenderer.invoke('get-current-url'),
  addBookmark: (url: string, title: string) => ipcRenderer.invoke('add-bookmark', url, title),
  getBookmarks: () => ipcRenderer.invoke('get-bookmarks'),
  deleteBookmark: (id: number) => ipcRenderer.invoke('delete-bookmark', id),
  getHistory: () => ipcRenderer.invoke('get-history'),
  clearHistory: () => ipcRenderer.invoke('clear-history'),
  
  // Tab management
  newTab: (url?: string) => ipcRenderer.invoke('new-tab', url),
  closeTab: (tabId: number) => ipcRenderer.invoke('close-tab', tabId),
  switchTab: (tabId: number) => ipcRenderer.invoke('switch-tab', tabId),
  getTabs: () => ipcRenderer.invoke('get-tabs'),
  
  // Event listeners
  onUrlChanged: (callback: (url: string, tabId: number) => void) => {
    ipcRenderer.on('url-changed', (_event: any, url: string, tabId: number) => callback(url, tabId));
  },
  onTitleUpdated: (callback: (title: string, tabId: number) => void) => {
    ipcRenderer.on('title-updated', (_event: any, title: string, tabId: number) => callback(title, tabId));
  },
  onLoadingStarted: (callback: (tabId: number) => void) => {
    ipcRenderer.on('loading-started', (_event: any, tabId: number) => callback(tabId));
  },
  onLoadingStopped: (callback: (tabId: number) => void) => {
    ipcRenderer.on('loading-stopped', (_event: any, tabId: number) => callback(tabId));
  },
  onTabCreated: (callback: (tabId: number, url: string) => void) => {
    ipcRenderer.on('tab-created', (_event: any, tabId: number, url: string) => callback(tabId, url));
  },
  onTabClosed: (callback: (tabId: number) => void) => {
    ipcRenderer.on('tab-closed', (_event: any, tabId: number) => callback(tabId));
  },
  onTabSwitched: (callback: (tabId: number, url: string, title: string) => void) => {
    ipcRenderer.on('tab-switched', (_event: any, tabId: number, url: string, title: string) => callback(tabId, url, title));
  },
  onTabUpdated: (callback: (tabId: number, info: any) => void) => {
    ipcRenderer.on('tab-updated', (_event: any, tabId: number, info: any) => callback(tabId, info));
  },

  // Chrome-like features
  zoomIn: () => ipcRenderer.invoke('zoom-in'),
  zoomOut: () => ipcRenderer.invoke('zoom-out'),
  zoomReset: () => ipcRenderer.invoke('zoom-reset'),
  getZoomLevel: () => ipcRenderer.invoke('get-zoom-level'),
  findInPage: (text: string, options?: any) => ipcRenderer.invoke('find-in-page', text, options),
  stopFindInPage: (action?: 'clearSelection' | 'keepSelection' | 'activateSelection') => ipcRenderer.invoke('stop-find-in-page', action),
  toggleDevTools: () => ipcRenderer.invoke('toggle-devtools'),
  printPage: () => ipcRenderer.invoke('print-page'),
  viewSource: () => ipcRenderer.invoke('view-source'),
  openInBrowser: (url: string) => ipcRenderer.invoke('open-in-browser', url),
  muteTab: (tabId: number) => ipcRenderer.invoke('mute-tab', tabId),
  getCanGoBack: () => ipcRenderer.invoke('get-can-go-back'),
  getCanGoForward: () => ipcRenderer.invoke('get-can-go-forward'),

  // Download events
  onDownloadStarted: (callback: (info: any) => void) => {
    ipcRenderer.on('download-started', (_event: any, info: any) => callback(info));
  },
  onDownloadProgress: (callback: (info: any) => void) => {
    ipcRenderer.on('download-progress', (_event: any, info: any) => callback(info));
  },
  onDownloadCompleted: (callback: (info: any) => void) => {
    ipcRenderer.on('download-completed', (_event: any, info: any) => callback(info));
  },
  onDownloadFailed: (callback: (fileName: string) => void) => {
    ipcRenderer.on('download-failed', (_event: any, fileName: string) => callback(fileName));
  },

  // Keyboard shortcut events
  onShowFindInPage: (callback: () => void) => {
    ipcRenderer.on('show-find-in-page', () => callback());
  },
  onFocusUrlBar: (callback: () => void) => {
    ipcRenderer.on('focus-url-bar', () => callback());
  },
  onAddBookmarkRequest: (callback: (url: string, title: string) => void) => {
    ipcRenderer.on('add-bookmark-request', (_event: any, url: string, title: string) => callback(url, title));
  },
  onShowClearDataDialog: (callback: () => void) => {
    ipcRenderer.on('show-clear-data-dialog', () => callback());
  },

  // Window state events
  onWindowStateChanged: (callback: (state: { maximized: boolean }) => void) => {
    ipcRenderer.on('window-state-changed', (_event: any, state: { maximized: boolean }) => callback(state));
  },

  // Overlay management - notify main process to adjust BrowserView bounds
  setOverlayVisible: (overlayType: string, visible: boolean, bounds?: { width?: number; height?: number }) =>
    ipcRenderer.invoke('set-overlay-visible', overlayType, visible, bounds),
});
