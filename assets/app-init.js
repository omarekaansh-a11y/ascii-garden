// ASCII Animals - Chrome Extension Entry Point
(async () => {
  'use strict';

  // 1. Chromium SVG liquid-glass refraction filter support
  if (/Chrome\//.test(navigator.userAgent)) {
    document.documentElement.classList.add('liquid');
  }

  // 2. Storage bridge: rehydrate all saved settings before engine starts
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    try {
      const all = await chrome.storage.local.get(null);
      for (const [k, v] of Object.entries(all)) {
        if (typeof k === 'string' && k.startsWith('ascii-animals:')) {
          try { localStorage.setItem(k, v); } catch(e) {}
        }
      }
    } catch(err) {
      console.warn('Storage sync init error:', err);
    }

    // Intercept writes so tweaks are permanently mirrored to chrome.storage.local
    const origSet = localStorage.setItem.bind(localStorage);
    const origRemove = localStorage.removeItem.bind(localStorage);

    localStorage.setItem = function(k, v) {
      origSet(k, v);
      if (typeof k === 'string' && k.startsWith('ascii-animals:')) {
        chrome.storage.local.set({ [k]: v });
      }
    };

    localStorage.removeItem = function(k) {
      origRemove(k);
      if (typeof k === 'string' && k.startsWith('ascii-animals:')) {
        chrome.storage.local.remove(k);
      }
    };
  }

  // 3. Load engine and extension features once storage is rehydrated and DOM is ready
  await import('./index-Bc3EnHls.js');
  await import('./extension-features.js');
})();
