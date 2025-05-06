// utils/Logger.js

import { Platform } from "react-native";

export const logEvent = async (eventName, eventData = {}) => {
    try {
      const payload = {
        event: eventName,
        data: eventData,
        timestamp: new Date().toISOString(),
        platform: Platform.OS,
      };
  
      console.log("LOG EVENT:", payload); // for now log locally
  
      // OPTIONAL: Send to your backend if you have server
      // await fetch('http://yourserver.com/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
  
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  };
  