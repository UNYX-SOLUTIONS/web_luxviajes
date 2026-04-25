@echo off
REM Script para preparar los archivos para Hostinger
REM Crea un archivo comprimido con todo lo necesario

setlocal enabledelayedexpansion

set WORKSPACE=c:\Users\yosto\Documents\Trabajos\Lux Viajes\web\web_luxviajes\frontend

echo.
echo ========================================
echo Preparando archivos para Hostinger...
echo ========================================
echo.

REM Crear carpeta de salida
if exist "%WORKSPACE%\deploy" rmdir /s /q "%WORKSPACE%\deploy"
mkdir "%WORKSPACE%\deploy"

echo [1/5] Copiando carpeta .next...
xcopy "%WORKSPACE%\.next" "%WORKSPACE%\deploy\.next" /E /I /Y >nul

echo [2/5] Copiando carpeta public...
xcopy "%WORKSPACE%\public" "%WORKSPACE%\deploy\public" /E /I /Y >nul

echo [3/5] Copiando archivos de configuración...
copy "%WORKSPACE%\package.json" "%WORKSPACE%\deploy\" /Y >nul
copy "%WORKSPACE%\pnpm-lock.yaml" "%WORKSPACE%\deploy\" /Y >nul
copy "%WORKSPACE%\next.config.ts" "%WORKSPACE%\deploy\" /Y >nul
copy "%WORKSPACE%\tsconfig.json" "%WORKSPACE%\deploy\" /Y >nul
copy "%WORKSPACE%\tailwind.config.ts" "%WORKSPACE%\deploy\" /Y >nul
copy "%WORKSPACE%\postcss.config.mjs" "%WORKSPACE%\deploy\" /Y >nul
copy "%WORKSPACE%\eslint.config.mjs" "%WORKSPACE%\deploy\" /Y >nul

echo [4/5] Copiando archivo .env.local si existe...
if exist "%WORKSPACE%\.env.local" (
    copy "%WORKSPACE%\.env.local" "%WORKSPACE%\deploy\" /Y >nul
) else (
    echo.env.local no encontrado - copia manualmente después
)

echo [5/5] Creando archivo README para Hostinger...
(
    echo # Instrucciones de despliegue
    echo.
    echo ## Contenido incluido:
    echo - .next/ (build optimizado)
    echo - public/ (archivos estáticos)
    echo - Archivos de configuración (package.json, next.config.ts, etc)
    echo.
    echo ## Pasos en Hostinger:
    echo.
    echo 1. Extrae este archivo en la carpeta de tu aplicación
    echo 2. Ejecuta: pnpm install
    echo 3. En cPanel, crea una aplicación Node.js que apunte a esta carpeta
    echo 4. Copia .env.local con tus variables de entorno
    echo 5. Reinicia la aplicación en cPanel
    echo.
    echo Ver HOSTINGER_DEPLOYMENT.md para instrucciones detalladas.
) > "%WORKSPACE%\deploy\README.md"

echo.
echo ========================================
echo ¡Listo! Archivos preparados en:
echo %WORKSPACE%\deploy
echo.
echo Proximos pasos:
echo 1. Comprime la carpeta 'deploy'
echo 2. Sube a Hostinger vía SFTP/cPanel
echo 3. Extrae los archivos
echo 4. Ejecuta 'pnpm install' en el servidor
echo 5. Configura en Node.js Manager de cPanel
echo.
echo ========================================
echo.

pause
