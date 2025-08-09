
import React, { useState, useEffect } from 'react';
import { EyeIcon, UserIcon } from './Icons';

const SocialProofNotifications: React.FC = () => {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const notifications = [
    "127 users are currently viewing premium content",
    "89 people upgraded to VIP in the last hour",
    "Premium content unlocked by 234 users today",
    "156 users are watching in 4K quality right now",
    "VIP members have access to 2,847 exclusive videos",
    "92% of users upgrade within their first visit"
  ];

  useEffect(() => {
    const showNotification = () => {
      setIsVisible(true);
      setCurrentNotification(Math.floor(Math.random() * notifications.length));
      
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    // Show first notification after 10 seconds
    const initialTimer = setTimeout(showNotification, 10000);
    
    // Then show every 20-30 seconds
    const interval = setInterval(() => {
      const randomDelay = Math.random() * 10000 + 20000; // 20-30 seconds
      setTimeout(showNotification, randomDelay);
    }, 35000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-slideInRight">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg border-l-4 border-green-400 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="relative">
              <UserIcon className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{notifications[currentNotification]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofNotifications;
