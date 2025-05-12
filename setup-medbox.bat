96.45.45.45
96.45.46@echo off
setlocal enabledelayedexpansion

REM === CONFIGURACIÓN GENERAL ===
set FRONTEND_DIR=C:\MedBox\frontend
set BACKEND_DIR=C:\MedBox\backend
set IIS_DIR=C:\inetpub\wwwroot\medbox
set NODE_PATH=C:\Program Files\nodejs\node.exe
set PM2_BIN=%APPDATA%\npm\pm2.cmd
set NSSM_PATH=C:\nssm\nssm.exe

echo ============================================
echo 🚀 INICIANDO SETUP DE MEDBOX 2025
echo ============================================

REM === VERIFICAR PM2 INSTALADO ===
where pm2 > nul 2>&1
if errorlevel 1 (
    echo ❌ PM2 no está instalado. Ejecuta: pnpm add -g pm2
    pause
    exit /b
)

REM === VERIFICAR NSSM ===
if not exist "%NSSM_PATH%" (
    echo ❌ NSSM no está en %NSSM_PATH%
    echo Descárgalo desde: https://nssm.cc/download y colócalo ahí.
    pause
    exit /b
)

REM === DEPLOY BACKEND ===
echo 🔧 Backend: Instalando dependencias...
cd /d "%BACKEND_DIR%"
pnpm install

echo 🔁 Iniciando backend con PM2...
pm2 delete medbox-api > NUL 2>&1
pm2 start index.js --name medbox-api
pm2 save

REM === REGISTRAR PM2 COMO SERVICIO ===
echo 🛠️ Registrando PM2 como servicio en Windows...

%NSSM_PATH% install PM2 "cmd.exe" "/c \"%PM2_BIN% resurrect\""
%NSSM_PATH% set PM2 DisplayName "PM2 Node.js Process Manager"
%NSSM_PATH% set PM2 Start SERVICE_AUTO_START

REM === DEPLOY FRONTEND ===
echo 🎨 Frontend: Instalando dependencias...
cd /d "%FRONTEND_DIR%"
pnpm install

echo 🏗️ Compilando frontend...
pnpm run build

echo 🧹 Limpiando sitio en IIS...
rd /s /q "%IIS_DIR%"
mkdir "%IIS_DIR%"

echo 📁 Copiando frontend a IIS...
xcopy /s /e /y /i "dist" "%IIS_DIR%"

echo ✅ Copiando web.config...
copy /Y web.config "%IIS_DIR%\web.config"

echo ✅ SETUP COMPLETADO EXITOSAMENTE
pause
endlocal
.46