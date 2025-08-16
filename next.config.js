const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    // Cache Google Storage images
    {
      urlPattern: /^https:\/\/storage\.googleapis\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-storage-images',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    },
    // Cache API requests from api.geekstack.dev
    {
      urlPattern: /^https:\/\/api\.geekstack\.dev/,
      handler: 'NetworkFirst', // Better for API data freshness
      options: {
        cacheName: 'geekstack-api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60 // 1 day
        },
        networkTimeoutSeconds: 10, // Fallback to cache if network takes too long
        cacheableResponse: {
          statuses: [0, 200] // Cache successful responses and opaque responses
        }
      }
    }
  ]
});

module.exports = withPWA({
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '**',
      },
    ],
  },
});