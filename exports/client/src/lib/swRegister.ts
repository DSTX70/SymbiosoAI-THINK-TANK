export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered successfully:', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker available');
              // You can show a notification to the user about the update
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.warn('Service Worker registration failed:', error);
      throw error;
    }
  } else {
    console.warn('Service Worker not supported');
    throw new Error('Service Worker not supported');
  }
}