# Инструкции по развертыванию GuestMe Tips

## 🚀 Публикация на GitHub Pages

### 1. Создание репозитория на GitHub

1. Перейдите на [github.com](https://github.com)
2. Нажмите "+" → "New repository"
3. Назовите репозиторий: `guestme-tips`
4. Сделайте его публичным
5. НЕ ставьте галочки на "Add a README file", "Add .gitignore", "Choose a license"
6. Нажмите "Create repository"

### 2. Подключение локального репозитория

После создания репозитория, GitHub покажет команды. Выполните их в терминале:

```bash
# Добавьте удаленный репозиторий (замените YOUR_USERNAME на ваше имя пользователя)
git remote add origin https://github.com/YOUR_USERNAME/guestme-tips.git

# Отправьте код в GitHub
git push -u origin main
```

### 3. Настройка GitHub Pages

1. В репозитории перейдите в "Settings" → "Pages"
2. В разделе "Source" выберите "GitHub Actions"
3. GitHub Actions workflow уже настроен в `.github/workflows/deploy.yml`

### 4. Автоматический деплой

При каждом push в ветку `main` будет автоматически:
- Собираться проект
- Деплоиться на GitHub Pages
- Доступен по адресу: `https://YOUR_USERNAME.github.io/guestme-tips/`

## 🔧 Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
```

## 📁 Структура проекта

- `src/app/` - Next.js App Router страницы
- `src/components/` - React компоненты
- `src/data/` - JSON данные для тестирования
- `.github/workflows/` - GitHub Actions для автоматического деплоя
- `next.config.ts` - конфигурация Next.js для статической генерации

## ⚠️ Важные моменты

1. **Статическая генерация**: Проект настроен для статической генерации (`output: 'export'`)
2. **GitHub Pages**: Автоматически настраивается `basePath` для GitHub Pages
3. **API endpoints**: В статической версии API работает через файлы JSON
4. **Изображения**: Отключена оптимизация изображений для статической генерации
