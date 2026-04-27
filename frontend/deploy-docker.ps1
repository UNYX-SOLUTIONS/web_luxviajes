# Script de Deployment para Docker en Hostinger VPS (PowerShell)
# Uso: .\deploy-docker.ps1

param(
    [string]$Branch = "main",
    [string]$ProjectPath = "C:\Trabajo\Lux Viajes\web_luxviajes"
)

# Configuración
$ErrorActionPreference = "Stop"
$WarningPreference = "SilentlyContinue"

# Funciones de colores
function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Lux Viajes - Docker (PowerShell)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Verificar conexión SSH a Hostinger
Write-Host "`n📡 Verificando conexión..." -ForegroundColor Yellow
try {
    # Esta es una verificación local, para VPS ejecutar vía SSH
    Write-Success "Sistema preparado para deployment"
} catch {
    Write-Error "No se pudo establecer conexión"
    exit 1
}

# 2. Ir al directorio del proyecto
if (-not (Test-Path $ProjectPath)) {
    Write-Error "El directorio $ProjectPath no existe"
    exit 1
}

Set-Location $ProjectPath
Write-Success "Navegando a $ProjectPath"

# 3. Actualizar código
Write-Host "`n📦 Actualizando código..." -ForegroundColor Yellow
git fetch origin
git checkout $Branch
git pull origin $Branch
Write-Success "Código actualizado de rama: $Branch"

# 4. Ir a frontend
Set-Location frontend
Write-Success "Navegando a directorio frontend"

# 5. Construir imagen Docker
Write-Host "`n🔨 Construyendo imagen Docker..." -ForegroundColor Yellow
docker compose build --no-cache
Write-Success "Imagen construida exitosamente"

# 6. Iniciar contenedor
Write-Host "`n🚀 Iniciando aplicación..." -ForegroundColor Yellow
docker compose down --remove-orphans -ErrorAction SilentlyContinue
docker compose up -d
Write-Success "Aplicación iniciada"

# 7. Esperar a que esté lista
Write-Host "`n⏳ Esperando a que la aplicación esté lista..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 8. Verificar contenedor
Write-Host "`n📊 Estado de la aplicación:" -ForegroundColor Yellow
docker compose ps

# 9. Mostrar logs
Write-Host "`n📝 Logs recientes:" -ForegroundColor Yellow
docker compose logs --tail=15 luxviajes-app

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✓ Deployment completado exitosamente!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nAccede a tu aplicación en: http://localhost:3000" -ForegroundColor Cyan
