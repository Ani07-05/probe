export interface ElectronAPI {
  navigate: (url: string) => Promise<string>;
  goBack: () => Promise<void>;
  goForward: () => Promise<void>;
  reload: () => Promise<void>;
  getCurrentUrl: () => Promise<string>;
  addBookmark: (url: string, title: string) => Promise<{ success: boolean }>;
  getBookmarks: () => Promise<Array<{
    id: number;
    url: string;
    title: string;
    created_at: Date;
  }>>;
  deleteBookmark: (id: number) => Promise<{ success: boolean }>;
  getHistory: () => Promise<Array<{
    id: number;
    url: string;
    title: string;
    visited_at: Date;
  }>>;
  clearHistory: () => Promise<{ success: boolean }>;
  
  // Tab management
  newTab: (url?: string) => Promise<number>;
  closeTab: (tabId: number) => Promise<void>;
  switchTab: (tabId: number) => Promise<void>;
  getTabs: () => Promise<Array<{
    id: number;
    url: string;
    title: string;
    isActive: boolean;
  }>>;
  
  // Event listeners
  onUrlChanged: (callback: (url: string, tabId: number) => void) => void;
  onTitleUpdated: (callback: (title: string, tabId: number) => void) => void;
  onLoadingStarted: (callback: (tabId: number) => void) => void;
  onLoadingStopped: (callback: (tabId: number) => void) => void;
  onTabCreated: (callback: (tabId: number, url: string) => void) => void;
  onTabClosed: (callback: (tabId: number) => void) => void;
  onTabSwitched: (callback: (tabId: number, url: string, title: string) => void) => void;
  onTabUpdated: (callback: (tabId: number, info: any) => void) => void;
  
  // Chrome-like features
  zoomIn: () => Promise<void>;
  zoomOut: () => Promise<void>;
  zoomReset: () => Promise<void>;
  getZoomLevel: () => Promise<number>;
  findInPage: (text: string, options?: any) => Promise<void>;
  stopFindInPage: (action?: 'clearSelection' | 'keepSelection' | 'activateSelection') => Promise<void>;
  toggleDevTools: () => Promise<void>;
  printPage: () => Promise<void>;
  viewSource: () => Promise<void>;
  openInBrowser: (url: string) => Promise<void>;
  muteTab: (tabId: number) => Promise<boolean>;
  getCanGoBack: () => Promise<boolean>;
  getCanGoForward: () => Promise<boolean>;
  
  // Download events
  onDownloadStarted: (callback: (info: any) => void) => void;
  onDownloadProgress: (callback: (info: any) => void) => void;
  onDownloadCompleted: (callback: (info: any) => void) => void;
  onDownloadFailed: (callback: (fileName: string) => void) => void;
  
  // Keyboard shortcut events
  onShowFindInPage: (callback: () => void) => void;
  onFocusUrlBar: (callback: () => void) => void;
  onAddBookmarkRequest: (callback: (url: string, title: string) => void) => void;
  onShowClearDataDialog: (callback: () => void) => void;

  // Window state events
  onWindowStateChanged: (callback: (state: { maximized: boolean }) => void) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
