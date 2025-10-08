import React, { useState, useEffect, useRef } from 'react';

interface FindInPageProps {
  isVisible: boolean;
  onClose: () => void;
}

const FindInPage: React.FC<FindInPageProps> = ({ isVisible, onClose }) => {
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isVisible]);

  // Notify main process about visibility changes
  useEffect(() => {
    window.electronAPI.setOverlayVisible('find-in-page', isVisible);
  }, [isVisible]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text) {
      window.electronAPI.findInPage(text, { findNext: true });
    } else {
      window.electronAPI.stopFindInPage('clearSelection');
    }
  };

  const handleNext = () => {
    if (searchText) {
      window.electronAPI.findInPage(searchText, { findNext: true, forward: true });
    }
  };

  const handlePrevious = () => {
    if (searchText) {
      window.electronAPI.findInPage(searchText, { findNext: true, forward: false });
    }
  };

  const handleClose = () => {
    window.electronAPI.stopFindInPage('clearSelection');
    setSearchText('');
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        handlePrevious();
      } else {
        handleNext();
      }
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="find-in-page">
      <input
        ref={inputRef}
        type="text"
        placeholder="Find in page"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className="find-input"
      />
      <button onClick={handlePrevious} className="find-button" title="Previous (Shift+Enter)">
        ↑
      </button>
      <button onClick={handleNext} className="find-button" title="Next (Enter)">
        ↓
      </button>
      <button onClick={handleClose} className="find-close" title="Close (Esc)">
        ✕
      </button>
    </div>
  );
};

export default FindInPage;
