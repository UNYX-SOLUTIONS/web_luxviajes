@echo off
REM Script para remover deploy/ del historial de git
setlocal enabledelayedexpansion

echo Iniciando limpieza del historial de git...
echo Esto puede tomar varios minutos...
echo.

REM Usar git filter-branch
echo Borrando deploy/ y deploy.zip del historial...
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch -r deploy deploy.zip" --prune-empty -- --all

if errorlevel 1 (
    echo Error durante la limpieza
    exit /b 1
)

echo Limpieza completada!
echo.
echo Expirando reflog...
git reflog expire --expire=now --all

echo Ejecutando garbage collection...
git gc --prune=now --aggressive

echo.
echo Historial limpiado exitosamente
echo Los archivos deploy/ y deploy.zip han sido removidos del historial

endlocal
