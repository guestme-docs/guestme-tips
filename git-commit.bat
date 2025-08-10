@echo off
echo Выполняю git команды...
git status
echo.
echo Добавляю файлы...
git add .
echo.
echo Создаю коммит...
git commit -m "Добавлены новые сценарии оплаты команде и изменена главная страница"
echo.
echo Отправляю в репозиторий...
git push origin main
echo.
echo Готово!
pause
