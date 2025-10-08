import React, { useState, useEffect, useRef } from 'react';

interface NavigationBarProps {
  currentUrl: string;
  isLoading: boolean;
  downloadProgress: number | null;
  hasActiveDownloads: boolean;
  recentDownloadName: string | null;
  onNavigate: (url: string) => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onAddBookmark: () => void;
  onToggleBookmarks: () => void;
  onToggleHistory: () => void;
  onToggleDownloads: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  currentUrl,
  isLoading,
  downloadProgress,
  hasActiveDownloads,
  recentDownloadName,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onAddBookmark,
  onToggleBookmarks,
  onToggleHistory,
  onToggleDownloads,
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

  // Notify main process about zoom popup visibility changes
  useEffect(() => {
    window.electronAPI.setOverlayVisible('zoom-popup', showZoom);
  }, [showZoom]);

  const toggleDevTools = () => {
    window.electronAPI.toggleDevTools();
  };

  return (
    <div className="navigation-bar">
      {/* Chrome-style Download Progress Bar */}
      {downloadProgress !== null && downloadProgress < 100 && (
        <div className="nav-download-progress">
          <div 
            className="nav-download-progress-bar" 
            style={{ width: `${downloadProgress}%` }}
          />
        </div>
      )}
      <div className="nav-controls">
        <button 
          onClick={onBack} 
          className="nav-button back-button" 
          title="Back" 
          disabled={!canGoBack}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10 13L5 8l5-5v10z"/>
          </svg>
        </button>
        <button 
          onClick={onForward} 
          className="nav-button forward-button" 
          title="Forward" 
          disabled={!canGoForward}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 3l5 5-5 5V3z"/>
          </svg>
        </button>
        <button onClick={onReload} className="nav-button reload-button" title="Reload">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.65 2.35C12.2 0.9 10.21 0 8 0 3.58 0 0 3.58 0 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L9 7h7V0l-2.35 2.35z"/>
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="url-form">
        <div className="url-input-container">
          <div className="lock-icon">🔒</div>
          <input
            ref={urlInputRef}
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="url-input"
            placeholder="Search or enter website name"
          />
          {isLoading ? (
            <div className="loading-indicator">⟳</div>
          ) : (
            <button type="button" className="star-button" onClick={onAddBookmark} title="Bookmark this tab">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 2l1.5 4.5H14l-3.5 2.5 1.5 4.5L8 11l-4 2.5 1.5-4.5L2 6.5h4.5L8 2z"/>
              </svg>
            </button>
          )}
        </div>
      </form>

      <div className="nav-actions">
        {/* Chrome-style Download Button */}
        <button 
          onClick={onToggleDownloads}
          className={`nav-button download-button ${hasActiveDownloads ? 'has-downloads' : ''}`}
          title={recentDownloadName ? `Recent: ${recentDownloadName}` : 'Downloads'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 12L3 7h3V1h4v6h3l-5 5z"/>
            <path d="M1 14h14v2H1z"/>
          </svg>
          {hasActiveDownloads && (
            <div className="download-indicator">
              {downloadProgress !== null && downloadProgress < 100 ? (
                <div className="download-progress-circle">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <circle 
                      cx="10" 
                      cy="10" 
                      r="8" 
                      fill="none" 
                      stroke="#3c4043" 
                      strokeWidth="2"
                    />
                    <circle 
                      cx="10" 
                      cy="10" 
                      r="8" 
                      fill="none" 
                      stroke="#1a73e8" 
                      strokeWidth="2"
                      strokeDasharray={`${(downloadProgress / 100) * 50.24} 50.24`}
                      strokeLinecap="round"
                      transform="rotate(-90 10 10)"
                    />
                  </svg>
                </div>
              ) : (
                <div className="download-complete-dot" />
              )}
            </div>
          )}
        </button>
        
        <div className="zoom-controls">
          <button 
            onClick={() => setShowZoom(!showZoom)} 
            className="nav-button menu-button" 
            title="Zoom"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.5 1C3.46 1 1 3.46 1 6.5S3.46 12 6.5 12c1.41 0 2.7-.53 3.68-1.4l3.61 3.61 1.41-1.41-3.61-3.61C12.47 8.2 13 6.91 13 5.5 13 2.46 10.54 0 7.5 0S2 2.46 2 5.5 4.46 11 7.5 11c1.16 0 2.23-.37 3.1-.99l.4.4c-.87.87-2.07 1.41-3.4 1.41zM6.5 2c2.48 0 4.5 2.02 4.5 4.5S8.98 11 6.5 11 2 8.98 2 6.5 4.02 2 6.5 2z"/>
              <path d="M6 5h1v3H6V5zm2 0h1v3H8V5z"/>
            </svg>
          </button>
          {showZoom && (
            <div className="zoom-popup">
              <button onClick={handleZoomOut} title="Zoom Out">−</button>
              <span onClick={handleZoomReset} title="Reset Zoom">{zoomLevel}%</span>
              <button onClick={handleZoomIn} title="Zoom In">+</button>
            </div>
          )}
        </div>
        <button className="nav-button menu-button" title="Customize and control">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="2.5" r="1.5"/>
            <circle cx="8" cy="8" r="1.5"/>
            <circle cx="8" cy="13.5" r="1.5"/>
          </svg>
        </button>
        <button className="nav-button profile-button" title="Profile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="#4285f4"/>
            <circle cx="12" cy="10" r="3" fill="white"/>
            <path d="M6 18c0-3.31 2.69-6 6-6s6 2.69 6 6" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
