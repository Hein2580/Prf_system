/**
 * Development Cache Clearing Utility
 * Add this script to any page during development to force cache clearing
 */

// Clear all caches on page load during development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 Development mode: Clearing caches...');
  
  // Clear service worker caches
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          console.log('🗑️ Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('✅ All caches cleared');
    });
  }
  
  // Unregister service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        console.log('🗑️ Unregistering service worker');
        registration.unregister();
      }
    });
  }
  
  // Add cache-busting to dynamically loaded resources
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && !url.includes('?')) {
      url += '?dev=' + Date.now();
    }
    return originalFetch(url, options);
  };
  
  // Add developer shortcuts
  window.clearCaches = function() {
    location.reload(true); // Hard reload
  };
  
  window.toggleDevMode = function() {
    localStorage.setItem('devMode', localStorage.getItem('devMode') === 'true' ? 'false' : 'true');
    console.log('Development mode:', localStorage.getItem('devMode'));
  };
  
  console.log('🛠️ Developer tools available:');
  console.log('  - clearCaches() - Force hard reload');
  console.log('  - toggleDevMode() - Toggle development features');
} 