import React, { useState, useEffect } from 'react';

interface Download {
  fileName: string;
  percent: string;
  receivedBytes: number;
  totalBytes: number;
  status: 'downloading' | 'completed' | 'failed';
  savePath?: string;
}

interface DownloadManagerProps {
  isVisible: boolean;
  onClose: () => void;
}

const DownloadManager: React.FC<DownloadManagerProps> = ({ isVisible, onClose }) => {
  const [downloads, setDownloads] = useState<Map<string, Download>>(new Map());

  useEffect(() => {
    window.electronAPI.onDownloadStarted((info) => {
      setDownloads(prev => {
        const newMap = new Map(prev);
        newMap.set(info.fileName, {
          fileName: info.fileName,
          percent: '0',
          receivedBytes: 0,
          totalBytes: info.totalBytes,
          status: 'downloading',
          savePath: info.savePath
        });
        return newMap;
      });
      // Don't auto-show, let parent control visibility
    });

    window.electronAPI.onDownloadProgress((info) => {
      setDownloads(prev => {
        const newMap = new Map(prev);
        const download = newMap.get(info.fileName);
        if (download) {
          newMap.set(info.fileName, {
            ...download,
            percent: info.percent,
            receivedBytes: info.receivedBytes
          });
        }
        return newMap;
      });
    });

    window.electronAPI.onDownloadCompleted((info) => {
      setDownloads(prev => {
        const newMap = new Map(prev);
        const download = newMap.get(info.fileName);
        if (download) {
          newMap.set(info.fileName, {
            ...download,
            status: 'completed',
            percent: '100',
            savePath: info.savePath
          });
        }
        return newMap;
      });
      
      // Keep downloads in history, don't auto-delete
      // User can close the manager manually
    });

    window.electronAPI.onDownloadFailed((fileName) => {
      setDownloads(prev => {
        const newMap = new Map(prev);
        const download = newMap.get(fileName);
        if (download) {
          newMap.set(fileName, {
            ...download,
            status: 'failed'
          });
        }
        return newMap;
      });
    });
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const openFile = (savePath: string) => {
    if (savePath) {
      window.electronAPI.openInBrowser('file://' + savePath);
    }
  };

  const clearDownloads = () => {
    setDownloads(new Map());
  };

  // Notify main process about visibility changes
  useEffect(() => {
    window.electronAPI.setOverlayVisible('download-manager', isVisible);
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="download-manager">
      <div className="download-header">
        <div className="download-header-left">
          <span>Downloads</span>
          {downloads.size > 0 && (
            <button onClick={clearDownloads} className="download-clear-all">Clear all</button>
          )}
        </div>
        <button onClick={onClose} className="download-close">✕</button>
      </div>
      {downloads.size === 0 ? (
        <div className="download-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#5f6368">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          <p>No downloads yet</p>
        </div>
      ) : (
        <div className="download-list">
        {Array.from(downloads.values()).map((download) => (
          <div 
            key={download.fileName} 
            className={`download-item ${download.status}`}
            onClick={() => download.status === 'completed' && openFile(download.savePath!)}
          >
            {/* File Icon */}
            <div className="download-icon">
              {download.status === 'downloading' ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 14L5 9h3V3h4v6h3l-5 5z"/>
                  <path d="M3 16h14v2H3z"/>
                </svg>
              ) : download.status === 'completed' ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#81c995">
                  <path d="M7 10l2 2 4-4m4 2a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="#f28b82">
                  <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z"/>
                </svg>
              )}
            </div>

            {/* File Info */}
            <div className="download-info">
              <div className="download-name" title={download.fileName}>
                {download.fileName}
              </div>
              
              {/* Status and Size */}
              <div className="download-status">
                {download.status === 'downloading' && (
                  <>
                    <span>{formatBytes(download.receivedBytes)} / {formatBytes(download.totalBytes)}</span>
                    <span>•</span>
                    <span>{download.percent}%</span>
                  </>
                )}
                {download.status === 'completed' && (
                  <span className="download-success">
                    {formatBytes(download.totalBytes)} - Completed
                  </span>
                )}
                {download.status === 'failed' && (
                  <span className="download-error">Failed - Download interrupted</span>
                )}
              </div>

              {/* Thin Progress Bar (Chrome-style) */}
              {download.status === 'downloading' && (
                <div className="download-progress">
                  <div 
                    className="download-progress-bar downloading" 
                    style={{ width: `${download.percent}%` }} 
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {download.status === 'completed' && (
              <button 
                className="download-action-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  openFile(download.savePath!);
                }}
                title="Show in folder"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                </svg>
              </button>
            )}
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default DownloadManager;
