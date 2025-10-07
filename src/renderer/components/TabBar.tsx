import React from 'react';

interface Tab {
  id: number;
  title: string;
  url: string;
  isActive: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  onNewTab: () => void;
  onCloseTab: (tabId: number) => void;
  onSwitchTab: (tabId: number) => void;
  isMaximized: boolean;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, onNewTab, onCloseTab, onSwitchTab, isMaximized }) => {
  const getTabTitle = (title: string, url: string) => {
    if (title && title !== url) return title;
    try {
      const urlObj = new URL(url);
      return urlObj.hostname || 'New Tab';
    } catch {
      return 'New Tab';
    }
  };

  return (
    <div className={`tab-bar ${isMaximized ? 'maximized' : ''}`}>
      <div className="tabs-container">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${tab.isActive ? 'active' : ''}`}
            onClick={() => onSwitchTab(tab.id)}
          >
            <span className="tab-title">{getTabTitle(tab.title, tab.url)}</span>
            <button
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button className="new-tab-button" onClick={onNewTab} title="New Tab">
          +
        </button>
      </div>
    </div>
  );
};

export default TabBar;
