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
});
