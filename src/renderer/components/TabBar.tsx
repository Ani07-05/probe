import React from 'react';

interface Tab {
  id: number;
  title: string;
  url: string;
  isActive: boolean;
  isPinned?: boolean;
  groupId?: string | null;
}

interface TabBarProps {
  tabs: Tab[];
  onNewTab: () => void;
  onCloseTab: (tabId: number) => void;
  onSwitchTab: (tabId: number) => void;
  onTogglePin: (tabId: number) => void;
  onAssignGroup: (tabId: number, groupId: string | null) => void;
  groups: Array<{ id: string; name: string; color: string }>;
  isMaximized: boolean;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, onNewTab, onCloseTab, onSwitchTab, onTogglePin, onAssignGroup, groups, isMaximized }) => {
  const getTabTitle = (title: string, url: string) => {
    if (title && title !== url) return title;
    try {
      const urlObj = new URL(url);
      return urlObj.hostname || 'New Tab';
    } catch {
      return 'New Tab';
    }
  };

  const pinned = tabs.filter(t => t.isPinned);
  const unpinned = tabs.filter(t => !t.isPinned);

  return (
    <div className={`tab-bar ${isMaximized ? 'maximized' : ''}`}>
      <div className="tabs-container">
        {[...pinned, ...unpinned].map((tab) => (
          <div
            key={tab.id}
            className={`tab ${tab.isActive ? 'active' : ''} ${tab.isPinned ? 'pinned' : ''}`}
            onClick={() => onSwitchTab(tab.id)}
          >
            {tab.groupId && (
              <span
                className="tab-group-dot"
                style={{ backgroundColor: groups.find(g => g.id === tab.groupId)?.color || '#888' }}
                title={groups.find(g => g.id === tab.groupId)?.name || 'Group'}
              />
            )}
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
            <div className="tab-menu">
              <button
                className="tab-pin"
                title={tab.isPinned ? 'Unpin tab' : 'Pin tab'}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(tab.id);
                }}
              >
                {tab.isPinned ? '📌' : '📍'}
              </button>
              <select
                className="tab-group-select"
                title="Assign group"
                value={tab.groupId || ''}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onAssignGroup(tab.id, e.target.value || null)}
              >
                <option value="">No group</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
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
