# Script de gerenciamento Docker - PentaChaos
# PowerShell Script

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('start', 'stop', 'restart', 'logs', 'status', 'clean', 'rebuild', 'db-shell', 'backend-logs', 'mobile-logs')]
    [string]$Action = 'status'
)

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

function Start-Services {
    Write-Host "🚀 Iniciando todos os serviços..." -ForegroundColor Green
    docker compose up -d
    Write-Host "✅ Serviços iniciados!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Acesse:" -ForegroundColor Cyan
    Write-Host "  - Backend: http://localhost:8080" -ForegroundColor White
    Write-Host "  - Mobile:  http://localhost:8081" -ForegroundColor White
    Write-Host "  - DB:      localhost:5432" -ForegroundColor White
}

function Stop-Services {
    Write-Host "⏹️  Parando todos os serviços..." -ForegroundColor Yellow
    docker compose down
    Write-Host "✅ Serviços parados!" -ForegroundColor Green
}

function Restart-Services {
    Write-Host "🔄 Reiniciando todos os serviços..." -ForegroundColor Yellow
    docker compose restart
    Write-Host "✅ Serviços reiniciados!" -ForegroundColor Green
}

function Show-Logs {
    Write-Host "📋 Mostrando logs (Ctrl+C para sair)..." -ForegroundColor Cyan
    docker compose logs -f
}

function Show-Status {
    Write-Host "📊 Status dos containers:" -ForegroundColor Cyan
    docker compose ps
    Write-Host ""
    Write-Host "💾 Uso de recursos:" -ForegroundColor Cyan
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
}

function Clean-All {
    Write-Host "🧹 Limpando tudo (containers, volumes, imagens)..." -ForegroundColor Red
    $confirmation = Read-Host "Tem certeza? Isso removerá TODOS os dados do banco! (s/N)"
    if ($confirmation -eq 's' -or $confirmation -eq 'S') {
        docker compose down -v --rmi all
        Write-Host "✅ Limpeza completa!" -ForegroundColor Green
    } else {
        Write-Host "❌ Operação cancelada" -ForegroundColor Yellow
    }
}

function Rebuild-All {
    Write-Host "🔨 Rebuild de todos os serviços..." -ForegroundColor Yellow
    docker compose up -d --build
    Write-Host "✅ Rebuild completo!" -ForegroundColor Green
}

function Open-DbShell {
    Write-Host "🗄️  Abrindo shell do PostgreSQL..." -ForegroundColor Cyan
    Write-Host "Digite '\q' para sair" -ForegroundColor Yellow
    docker compose exec db psql -U admin_sge -d sge_app_db
}

function Show-BackendLogs {
    Write-Host "📋 Logs do Backend (Ctrl+C para sair)..." -ForegroundColor Cyan
    docker compose logs -f backend
}

function Show-MobileLogs {
    Write-Host "📋 Logs do Mobile (Ctrl+C para sair)..." -ForegroundColor Cyan
    docker compose logs -f mobile
}

# Main execution
Set-Location $ProjectRoot

switch ($Action) {
    'start'         { Start-Services }
    'stop'          { Stop-Services }
    'restart'       { Restart-Services }
    'logs'          { Show-Logs }
    'status'        { Show-Status }
    'clean'         { Clean-All }
    'rebuild'       { Rebuild-All }
    'db-shell'      { Open-DbShell }
    'backend-logs'  { Show-BackendLogs }
    'mobile-logs'   { Show-MobileLogs }
}
