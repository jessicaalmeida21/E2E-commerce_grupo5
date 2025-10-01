# Auto Deploy Script - E2E Commerce
# Executa commit e push automático para GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    AUTO DEPLOY - E2E COMMERCE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    # Verificar se há mudanças
    $status = git status --porcelain
    
    if (-not $status) {
        Write-Host "✅ Nenhuma mudança detectada" -ForegroundColor Green
        Read-Host "Pressione Enter para continuar"
        exit 0
    }
    
    Write-Host "📁 Mudanças detectadas:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    
    # Adicionar todos os arquivos
    Write-Host "📦 Adicionando arquivos..." -ForegroundColor Blue
    git add .
    
    # Fazer commit com timestamp
    $timestamp = Get-Date -Format "dd/MM/yyyy HH:mm:ss"
    $commitMessage = "Auto-deploy: Atualização automática - $timestamp"
    
    Write-Host "💾 Fazendo commit..." -ForegroundColor Blue
    git commit -m $commitMessage
    
    # Push para GitHub
    Write-Host "🚀 Enviando para GitHub..." -ForegroundColor Blue
    git push origin main
    
    Write-Host ""
    Write-Host "✅ Deploy automático concluído com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Site será atualizado em: https://jessicaalmeida21.github.io/E2E-commerce_grupo5/" -ForegroundColor Cyan
    Write-Host "⏱️  Aguarde 2-5 minutos para as mudanças aparecerem online" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host "❌ Erro durante o deploy: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Read-Host "Pressione Enter para continuar"