
import React from 'react';
import { DownloadIcon } from './Icons';

interface FakeDownloadButtonsProps {
  onDownloadClick: () => void;
}

const FakeDownloadButtons: React.FC<FakeDownloadButtonsProps> = ({ onDownloadClick }) => {
  // Generate random file sizes for each quality
  const generateRandomSize = (minMB: number, maxMB: number) => {
    const size = Math.floor(Math.random() * (maxMB - minMB + 1)) + minMB;
    return size >= 1000 ? `${(size / 1000).toFixed(1)} GB` : `${size} MB`;
  };

  const downloadOptions = [
    { quality: 'HD 720p', size: generateRandomSize(180, 350), format: 'MP4' },
    { quality: '4K UHD', size: generateRandomSize(800, 1500), format: 'MP4' },
    { quality: 'HD 1080p', size: generateRandomSize(400, 750), format: 'MP4' },
    { quality: 'Mobile', size: generateRandomSize(80, 150), format: 'MP4' }
  ];

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <DownloadIcon className="h-5 w-5 text-green-400" />
        Download Options
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {downloadOptions.map((option, index) => (
          <button
            key={index}
            onClick={onDownloadClick}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation min-h-[60px] sm:min-h-[48px]"
          >
            <div className="flex items-center gap-3">
              <DownloadIcon className="h-5 w-5 text-white" />
              <div className="text-left">
                <div className="text-white font-semibold">{option.quality}</div>
                <div className="text-green-100 text-sm">{option.size} • {option.format}</div>
              </div>
            </div>
            <div className="text-white text-sm font-medium">Download</div>
          </button>
        ))}
      </div>
      <p className="text-gray-400 text-sm mt-3 text-center">
        Click any download button to access premium downloads
      </p>
    </div>
  );
};

export default FakeDownloadButtons;
