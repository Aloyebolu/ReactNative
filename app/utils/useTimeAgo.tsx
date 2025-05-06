import { useState, useEffect } from 'react';

export function useTimeAgo(timestamp) {
  const [timeAgoText, setTimeAgoText] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = Date.now();
      const secondsPast = Math.floor((now - timestamp) / 1000);

      if (secondsPast < 60) {
        setTimeAgoText(`${secondsPast} sec${secondsPast !== 1 ? 's' : ''} ago`);
      } else if (secondsPast < 3600) {
        const minutes = Math.floor(secondsPast / 60);
        setTimeAgoText(`${minutes} min${minutes !== 1 ? 's' : ''} ago`);
      } else if (secondsPast < 86400) {
        const hours = Math.floor(secondsPast / 3600);
        setTimeAgoText(`${hours} hr${hours !== 1 ? 's' : ''} ago`);
      } else {
        const days = Math.floor(secondsPast / 86400);
        setTimeAgoText(`${days} day${days !== 1 ? 's' : ''} ago`);
      }
    };

    updateTimeAgo();

    const interval = setInterval(updateTimeAgo, 60000); // Update every minute
    return () => clearInterval(interval); // Cleanup on unmount
  }, [timestamp]);

  return timeAgoText;
}
