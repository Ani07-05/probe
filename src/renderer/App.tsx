import React, { useState, useEffect } from 'react';
import NavigationBar from './components/NavigationBar';
import Sidebar from './components/Sidebar';
import TabBar from './components/TabBar';
import FindInPage from './components/FindInPage';
import DownloadManager from './components/DownloadManager';

interface Bookmark {
  id: number;
  url: string;
  title: string;
  created_at: Date;
}

interface HistoryItem {
  id: number;
  url: string;
  title: string;
  visited_at: Date;
}

interface Tab {
  id: number;
  title: string;
  url: string;
  isActive: boolean;
}

const App: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string>('https://www.google.com');
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [sidebarView, setSidebarView] = useState<'bookmarks' | 'history'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [showFindInPage, setShowFindInPage] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  useEffect(() => {
    // Set up event listeners
    window.electronAPI.onUrlChanged((url: string, tabId: number) => {
      setCurrentUrl(url);
    });

    window.electronAPI.onTitleUpdated((title: string, tabId: number) => {
      setCurrentTitle(title);
    });

    window.electronAPI.onLoadingStarted((tabId: number) => {
      setIsLoading(true);
    });

    window.electronAPI.onLoadingStopped((tabId: number) => {
      setIsLoading(false);
    });

    window.electronAPI.onTabCreated((tabId: number, url: string) => {
      loadTabs();
    });

    window.electronAPI.onTabClosed((tabId: number) => {
      loadTabs();
    });

    window.electronAPI.onTabSwitched((tabId: number, url: string, title: string) => {
      setCurrentUrl(url);
      setCurrentTitle(title);
      loadTabs();
    });

    window.electronAPI.onTabUpdated((tabId: number, info: any) => {
      loadTabs();
    });

    // Listen for window state changes
    window.electronAPI.onWindowStateChanged((state: { maximized: boolean }) => {
      setIsMaximized(state.maximized);
    });

    // Listen for keyboard shortcuts
    window.electronAPI.onShowFindInPage(() => {
      setShowFindInPage(true);
    });

    window.electronAPI.onAddBookmarkRequest((url: string, title: string) => {
      handleAddBookmark(url, title);
    });

    // Load initial data
    loadBookmarks();
    loadHistory();
    loadTabs();
  }, []);

  const loadTabs = async () => {
    const tabsData = await window.electronAPI.getTabs();
    setTabs(tabsData);
  };

  const loadBookmarks = async () => {
    const data = await window.electronAPI.getBookmarks();
    setBookmarks(data);
  };

  const loadHistory = async () => {
    const data = await window.electronAPI.getHistory();
    setHistory(data);
  };

  const handleNavigate = (url: string) => {
    window.electronAPI.navigate(url);
  };

  const handleBack = () => {
    window.electronAPI.goBack();
  };

  const handleForward = () => {
    window.electronAPI.goForward();
  };

  const handleReload = () => {
    window.electronAPI.reload();
  };

  const handleAddBookmark = async (url?: string, title?: string) => {
    const bookmarkUrl = url || currentUrl;
    const bookmarkTitle = title || currentTitle;
    if (bookmarkUrl && bookmarkTitle) {
      await window.electronAPI.addBookmark(bookmarkUrl, bookmarkTitle);
      loadBookmarks();
    }
  };

  const handleDeleteBookmark = async (id: number) => {
    await window.electronAPI.deleteBookmark(id);
    loadBookmarks();
  };

  const handleClearHistory = async () => {
    await window.electronAPI.clearHistory();
    loadHistory();
  };

  const toggleSidebar = (view: 'bookmarks' | 'history') => {
    if (showSidebar && sidebarView === view) {
      setShowSidebar(false);
    } else {
      setSidebarView(view);
      setShowSidebar(true);
      if (view === 'bookmarks') {
        loadBookmarks();
      } else {
        loadHistory();
      }
    }
  };

  const handleNewTab = async () => {
    await window.electronAPI.newTab();
  };

  const handleCloseTab = async (tabId: number) => {
    await window.electronAPI.closeTab(tabId);
  };

  const handleSwitchTab = async (tabId: number) => {
    await window.electronAPI.switchTab(tabId);
  };

  return (
    <div className="app">
      <TabBar
        tabs={tabs}
        onNewTab={handleNewTab}
        onCloseTab={handleCloseTab}
        onSwitchTab={handleSwitchTab}
        isMaximized={isMaximized}
      />
      <NavigationBar
        currentUrl={currentUrl}
        isLoading={isLoading}
        onNavigate={handleNavigate}
        onBack={handleBack}
        onForward={handleForward}
        onReload={handleReload}
        onAddBookmark={handleAddBookmark}
        onToggleBookmarks={() => toggleSidebar('bookmarks')}
        onToggleHistory={() => toggleSidebar('history')}
      />
      <FindInPage 
        isVisible={showFindInPage} 
        onClose={() => setShowFindInPage(false)} 
      />
      <DownloadManager />
      {showSidebar && (
        <Sidebar
          view={sidebarView}
          bookmarks={bookmarks}
          history={history}
          onNavigate={handleNavigate}
          onDeleteBookmark={handleDeleteBookmark}
          onClearHistory={handleClearHistory}
          onClose={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default App;
