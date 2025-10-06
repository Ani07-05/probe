import React from 'react';

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

interface SidebarProps {
  view: 'bookmarks' | 'history';
  bookmarks: Bookmark[];
  history: HistoryItem[];
  onNavigate: (url: string) => void;
  onDeleteBookmark: (id: number) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  view,
  bookmarks,
  history,
  onNavigate,
  onDeleteBookmark,
  onClearHistory,
  onClose,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>{view === 'bookmarks' ? 'Bookmarks' : 'History'}</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      
      {view === 'bookmarks' ? (
        <div className="sidebar-content">
          {bookmarks.length === 0 ? (
            <p className="empty-message">No bookmarks yet</p>
          ) : (
            <ul className="item-list">
              {bookmarks.map((bookmark) => (
                <li key={bookmark.id} className="item">
                  <div 
                    className="item-info"
                    onClick={() => onNavigate(bookmark.url)}
                  >
                    <div className="item-title">{bookmark.title}</div>
                    <div className="item-url">{bookmark.url}</div>
                    <div className="item-date">{formatDate(bookmark.created_at)}</div>
                  </div>
                  <button
                    onClick={() => onDeleteBookmark(bookmark.id)}
                    className="delete-button"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="sidebar-content">
          <div className="sidebar-actions">
            <button onClick={onClearHistory} className="clear-button">
              Clear History
            </button>
          </div>
          {history.length === 0 ? (
            <p className="empty-message">No history yet</p>
          ) : (
            <ul className="item-list">
              {history.map((item) => (
                <li key={item.id} className="item">
                  <div 
                    className="item-info"
                    onClick={() => onNavigate(item.url)}
                  >
                    <div className="item-title">{item.title || 'Untitled'}</div>
                    <div className="item-url">{item.url}</div>
                    <div className="item-date">{formatDate(item.visited_at)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
