// utils/cache.js
export const cacheService = {
    async get(key) {
      if (typeof caches === 'undefined') return null;
      const cache = await caches.open('app-cache');
      const response = await cache.match(key);
      if (!response) return null;
      return response.json();
    },
   
    async set(key, data) {
      if (typeof caches === 'undefined') return;
      const cache = await caches.open('app-cache');
      const response = new Response(JSON.stringify(data));
      await cache.put(key, response);
    }
   };
   
