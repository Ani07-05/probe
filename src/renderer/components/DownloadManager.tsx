import React, { useState, useEffect } from 'react';

interface Download {
  fileName: string;
  percent: string;
  receivedBytes: number;
  totalBytes: number;
  status: 'downloading' | 'completed' | 'failed';
  savePath?: string;
}

const DownloadManager: React.FC = () => {
  const [downloads, setDownloads] = useState<Map<string, Download>>(new Map());
  const [isVisible, setIsVisible] = useState(false);

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
      setIsVisible(true);
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
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setDownloads(prev => {
          const newMap = new Map(prev);
          newMap.delete(info.fileName);
          if (newMap.size === 0) setIsVisible(false);
          return newMap;
        });
      }, 5000);
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

  if (!isVisible || downloads.size === 0) return null;

  return (
    <div className="download-manager">
      <div className="download-header">
        <span>Downloads</span>
        <button onClick={() => setIsVisible(false)} className="download-close">✕</button>
      </div>
      <div className="download-list">
        {Array.from(downloads.values()).map((download) => (
          <div key={download.fileName} className={`download-item ${download.status}`}>
            <div className="download-info">
              <div className="download-name" title={download.fileName}>
                {download.fileName}
              </div>
              <div className="download-status">
                {download.status === 'downloading' && (
                  <>
                    {formatBytes(download.receivedBytes)} / {formatBytes(download.totalBytes)} ({download.percent}%)
                  </>
                )}
                {download.status === 'completed' && (
                  <span className="download-success">
                    ✓ Completed - <button onClick={() => openFile(download.savePath!)} className="download-link">Show in folder</button>
                  </span>
                )}
                {download.status === 'failed' && <span className="download-error">✗ Failed</span>}
              </div>
            </div>
            {download.status === 'downloading' && (
              <div className="download-progress">
                <div className="download-progress-bar" style={{ width: `${download.percent}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadManager;
