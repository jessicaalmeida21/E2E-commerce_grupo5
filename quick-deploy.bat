@echo off
title Quick Deploy - E2E Commerce

echo 🚀 QUICK DEPLOY - E2E COMMERCE
echo.

git add .
git commit -m "Quick deploy: %date% %time%"
git push origin main

echo.
echo ✅ Deploy concluído!
echo 🌐 https://jessicaalmeida21.github.io/E2E-commerce_grupo5/
timeout /t 3