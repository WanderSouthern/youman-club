export default defineNuxtConfig({
  compatibilityDate: '2025-08-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: ['@vite-pwa/nuxt'],
  runtimeConfig: {
    sessionSecret: process.env.SESSION_SECRET || 'youman-dev-change-this-in-production-32bytes',
    public: {
      siteName: '游漫社',
      siteFullName: '福建师范大学旗山校区游戏协会',
      campus: '旗山校区'
    }
  },
  app: {
    head: {
      title: '游漫社',
      titleTemplate: '%s · 游漫社',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#e24a3b' },
        { name: 'description', content: '福建师范大学旗山校区游戏协会（游漫社）官方网站。电竞与游戏研发同好集结，活动报名、赛事承办、社员工作台。' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.svg' },
        { rel: 'preconnect', href: 'https://fonts.loli.net' },
        { rel: 'preconnect', href: 'https://gstatic.loli.net', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@600;700&family=ZCOOL+XiaoWei&display=swap'
        }
      ]
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '游漫社',
      short_name: '游漫社',
      description: '福建师范大学旗山校区游戏协会',
      theme_color: '#e24a3b',
      background_color: '#f7f1e6',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      lang: 'zh-CN',
      icons: [
        { src: '/pwa-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
        { src: '/pwa-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any' }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,svg,ico,woff2}']
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: false
    }
  }
})
