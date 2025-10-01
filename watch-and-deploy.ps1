# Watch and Auto Deploy Script - E2E Commerce
# Monitora mudanças nos arquivos e executa deploy automático

param(
    [int]$IntervalSeconds = 30
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   WATCH & AUTO DEPLOY - E2E COMMERCE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔍 Monitorando mudanças a cada $IntervalSeconds segundos..." -ForegroundColor Yellow
Write-Host "⚠️  Pressione Ctrl+C para parar" -ForegroundColor Red
Write-Host ""

$lastCommit = ""

try {
    # Obter último commit inicial
    $lastCommit = git rev-parse HEAD
    
    while ($true) {
        Start-Sleep -Seconds $IntervalSeconds
        
        # Verificar se há mudanças não commitadas
        $status = git status --porcelain
        
        if ($status) {
            Write-Host "📁 Mudanças detectadas em $(Get-Date -Format 'HH:mm:ss'):" -ForegroundColor Yellow
            git status --short
            Write-Host ""
            
            try {
                # Adicionar arquivos
                Write-Host "📦 Adicionando arquivos..." -ForegroundColor Blue
                git add .
                
                # Commit com timestamp
                $timestamp = Get-Date -Format "dd/MM/yyyy HH:mm:ss"
                $commitMessage = "Auto-watch deploy: $timestamp"
                
                Write-Host "💾 Fazendo commit..." -ForegroundColor Blue
                git commit -m $commitMessage
                
                # Push para GitHub
                Write-Host "🚀 Enviando para GitHub..." -ForegroundColor Blue
                git push origin main
                
                Write-Host "✅ Deploy automático concluído!" -ForegroundColor Green
                Write-Host "🌐 Atualizações em: https://jessicaalmeida21.github.io/E2E-commerce_grupo5/" -ForegroundColor Cyan
                Write-Host ""
                
                $lastCommit = git rev-parse HEAD
                
            } catch {
                Write-Host "❌ Erro durante deploy automático: $($_.Exception.Message)" -ForegroundColor Red
                Write-Host ""
            }
        } else {
            Write-Host "⏱️  $(Get-Date -Format 'HH:mm:ss') - Nenhuma mudança detectada" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "❌ Erro no monitoramento: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🛑 Monitoramento interrompido" -ForegroundColor Yellow