// utils/loadFlags.js
function loadFlags() {
    const flags = {};
    
    // Dynamically require all images in the flags directory
    const context = require.context('../../assets/flags', false, /\.png$/);
  
    context.keys().forEach((key) => {
      const flagCode = key.replace('./', '').replace('.png', '');
      flags[flagCode] = context(key);
    });
  
    return flags;
  }
  
  export const flagImages = loadFlags();
  