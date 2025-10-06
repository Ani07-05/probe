import React, { useState, useEffect } from 'react';

interface NavigationBarProps {
  currentUrl: string;
  isLoading: boolean;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onAddBookmark: () => void;
  onToggleBookmarks: () => void;
  onToggleHistory: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  currentUrl,
  isLoading,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onAddBookmark,
  onToggleBookmarks,
  onToggleHistory,
}) => {
  const [urlInput, setUrlInput] = useState<string>(currentUrl);

  useEffect(() => {
    setUrlInput(currentUrl);
  }, [currentUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate(urlInput);
  };

  return (
    <div className="navigation-bar">
      <div className="nav-controls">
        <button onClick={onBack} className="nav-button" title="Go Back">
          ←
        </button>
        <button onClick={onForward} className="nav-button" title="Go Forward">
          →
        </button>
        <button onClick={onReload} className="nav-button" title="Reload">
          ↻
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="url-form">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="url-input"
          placeholder="Enter URL..."
        />
        {isLoading && <div className="loading-indicator">⟳</div>}
      </form>

      <div className="nav-actions">
        <button onClick={onAddBookmark} className="nav-button" title="Add Bookmark">
          ★
        </button>
        <button onClick={onToggleBookmarks} className="nav-button" title="Bookmarks">
          📚
        </button>
        <button onClick={onToggleHistory} className="nav-button" title="History">
          🕐
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
