@echo off
REM Budgy — mortgage recorder, interactive run. Double-click me.
chcp 65001 >nul
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies, one moment...
  call npm install || goto :err
)

node mortgage-recorder.mjs %*
set rc=%errorlevel%

REM Only pause when double-clicked (no arguments), not from Task Scheduler.
if "%~1"=="" pause
exit /b %rc%

:err
echo.
echo npm install failed.
pause
exit /b 1
