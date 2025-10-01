@echo off
echo ========================================
echo    AUTO DEPLOY - E2E COMMERCE
echo ========================================
echo.

REM Verificar se há mudanças
git status --porcelain > temp_status.txt
if %errorlevel% neq 0 (
    echo ❌ Erro ao verificar status do Git
    pause
    exit /b 1
)

REM Verificar se o arquivo temp_status.txt está vazio
for %%A in (temp_status.txt) do set size=%%~zA
if %size% equ 0 (
    echo ✅ Nenhuma mudança detectada
    del temp_status.txt
    pause
    exit /b 0
)

echo 📁 Mudanças detectadas:
type temp_status.txt
del temp_status.txt
echo.

REM Adicionar todos os arquivos
echo 📦 Adicionando arquivos...
git add .
if %errorlevel% neq 0 (
    echo ❌ Erro ao adicionar arquivos
    pause
    exit /b 1
)

REM Fazer commit com timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%DD%/%MM%/%YYYY% %HH%:%Min%:%Sec%"

echo 💾 Fazendo commit...
git commit -m "Auto-deploy: Atualizacao automatica - %timestamp%"
if %errorlevel% neq 0 (
    echo ❌ Erro ao fazer commit
    pause
    exit /b 1
)

REM Push para GitHub
echo 🚀 Enviando para GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ Erro ao fazer push
    pause
    exit /b 1
)

echo.
echo ✅ Deploy automático concluído com sucesso!
echo 🌐 Site será atualizado em: https://jessicaalmeida21.github.io/E2E-commerce_grupo5/
echo ⏱️  Aguarde 2-5 minutos para as mudanças aparecerem online
echo.
pause