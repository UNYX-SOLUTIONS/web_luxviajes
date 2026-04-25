#!/usr/bin/env pwsh
# Script para remover deploy/ del historial de git

$ErrorActionPreference = "Stop"

Write-Host "Iniciando limpieza del historial de git..." -ForegroundColor Yellow
Write-Host "Esto puede tomar varios minutos..."
Write-Host ""

# Establecer variable de entorno para suprimir warnings
$env:FILTER_BRANCH_SQUELCH_WARNING = 1

# Usar git filter-branch 
Write-Host "Borrando deploy/ y deploy.zip del historial..." -ForegroundColor Cyan

# Usar git index-filter
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch -r deploy deploy.zip" --prune-empty -- --all

if ($LASTEXITCODE -eq 0) {
    Write-Host "Limpieza completada!" -ForegroundColor Green
    
    Write-Host "Expirando reflog..." -ForegroundColor Cyan
    git reflog expire --expire=now --all
    
    Write-Host "Ejecutando garbage collection..." -ForegroundColor Cyan
    git gc --prune=now --aggressive
    
    Write-Host ""
    Write-Host "Historial limpiado exitosamente" -ForegroundColor Green
    Write-Host "Los archivos deploy/ y deploy.zip han sido removidos del historial" -ForegroundColor Green
} else {
    Write-Host "Error durante la limpieza" -ForegroundColor Red
    exit 1
}
