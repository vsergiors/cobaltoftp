@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js no esta instalado en este equipo.
  echo Abre index.html con doble clic y la web funcionara igual.
  pause
  exit /b 1
)

echo Iniciando el servidor en una ventana minimizada...
start "Cobalto FTP - servidor" /min cmd /c "node servidor.js"
timeout /t 2 /nobreak >nul
start "" "http://localhost:8099/"

echo.
echo Web abierta en http://localhost:8099/
echo La ventana minimizada "Cobalto FTP - servidor" debe seguir abierta.
echo.
pause
