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
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
