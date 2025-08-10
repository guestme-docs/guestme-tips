@echo off
cd /d "D:\dev\guestme-tips"
git add .
git commit -m "Исправлена навигация с главной страницы - добавлена проверка hostname"
git push origin main
pause
