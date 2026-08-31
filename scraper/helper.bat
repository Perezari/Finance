@echo off
REM Budgy import helper — leave this window open, then use the
REM "ייבא נתונים מהבנק" button in Budgy.
chcp 65001 >nul
cd /d "%~dp0"
title Budgy import helper

if not exist node_modules (
  echo Installing dependencies, one moment...
  call npm install || goto :err
)

node helper.mjs
if errorlevel 1 goto :err
exit /b 0

:err
echo.
echo The helper stopped with an error.
pause
exit /b 1
