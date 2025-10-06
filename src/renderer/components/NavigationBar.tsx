import React, { useState, useEffect, useRef } from 'react';

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
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlInput(currentUrl);
    updateNavigationState();
  }, [currentUrl]);

  useEffect(() => {
    // Listen for focus URL bar shortcut
    window.electronAPI.onFocusUrlBar(() => {
      urlInputRef.current?.focus();
      urlInputRef.current?.select();
    });
  }, []);

  const updateNavigationState = async () => {
    const back = await window.electronAPI.getCanGoBack();
    const forward = await window.electronAPI.getCanGoForward();
    setCanGoBack(back);
    setCanGoForward(forward);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate(urlInput);
  };

  const handleZoomIn = async () => {
    await window.electronAPI.zoomIn();
    updateZoomLevel();
  };

  const handleZoomOut = async () => {
    await window.electronAPI.zoomOut();
    updateZoomLevel();
  };

  const handleZoomReset = async () => {
    await window.electronAPI.zoomReset();
    updateZoomLevel();
  };

  const updateZoomLevel = async () => {
    const level = await window.electronAPI.getZoomLevel();
    setZoomLevel(Math.round((1 + level * 0.2) * 100));
  };

  const toggleDevTools = () => {
    window.electronAPI.toggleDevTools();
  };

  return (
    <div className="navigation-bar">
      <div className="nav-controls">
        <button 
          onClick={onBack} 
          className="nav-button" 
          title="Go Back (Ctrl+[)" 
          disabled={!canGoBack}
        >
          ←
        </button>
        <button 
          onClick={onForward} 
          className="nav-button" 
          title="Go Forward (Ctrl+])" 
          disabled={!canGoForward}
        >
          →
        </button>
        <button onClick={onReload} className="nav-button" title="Reload (Ctrl+R)">
          ↻
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="url-form">
        <input
          ref={urlInputRef}
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="url-input"
          placeholder="Enter URL or search..."
        />
        {isLoading && <div className="loading-indicator">⟳</div>}
      </form>

      <div className="nav-actions">
        <button onClick={onAddBookmark} className="nav-button" title="Add Bookmark (Ctrl+D)">
          ★
        </button>
        <div className="zoom-controls">
          <button 
            onClick={() => setShowZoom(!showZoom)} 
            className="nav-button" 
            title="Zoom"
          >
            🔍
          </button>
          {showZoom && (
            <div className="zoom-popup">
              <button onClick={handleZoomOut} title="Zoom Out (Ctrl+-)">−</button>
              <span onClick={handleZoomReset} title="Reset Zoom (Ctrl+0)">{zoomLevel}%</span>
              <button onClick={handleZoomIn} title="Zoom In (Ctrl++)">+</button>
            </div>
          )}
        </div>
        <button onClick={toggleDevTools} className="nav-button" title="Developer Tools (F12)">
          ⚙️
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
