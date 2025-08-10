// Константа для basePath GitHub Pages
export const GITHUB_PAGES_BASE = '/guestme-tips'

// Утилита для работы с путями в Next.js
export const getAssetPath = (path: string) => {
  // Для GitHub Pages добавляем префикс /guestme-tips
  // В development режиме используем обычный путь
  if (typeof window !== 'undefined') {
    // Клиентская сторона
    if (window.location.hostname === 'guestme-docs.github.io') {
      return `${GITHUB_PAGES_BASE}${path}`
    }
  }
  return path
}

// Утилита для статических путей (работает на сервере и клиенте)
export const getStaticAssetPath = (path: string) => {
  // Всегда добавляем префикс для GitHub Pages
  return `${GITHUB_PAGES_BASE}${path}`
}

// Утилита для внутренних ссылок
export const getInternalPath = (path: string) => {
  // Next.js автоматически добавит basePath при сборке
  return path
}
