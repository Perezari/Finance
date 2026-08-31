@echo off
REM ============================================================
REM  Budgy - dev launcher
REM  Runs the Tauri shell over the web app in the repo root
REM  (sync-frontend.mjs stages it via beforeDevCommand).
REM  Forces the VS 2022 BuildTools toolchain - the VS 18
REM  Community C++ libs are incomplete (no lib\x64), and Rust
REM  otherwise picks the newest install and fails with
REM  LNK1104: cannot open file 'msvcrt.lib'.
REM ============================================================
chcp 65001 >nul
cd /d "%~dp0"

set "VSDEV=C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\Common7\Tools\VsDevCmd.bat"
if exist "%VSDEV%" (
  call "%VSDEV%" -arch=x64 -host_arch=x64
) else (
  for /f "usebackq delims=" %%i in (`node src-tauri\scripts\find-vcvars.mjs`) do call "%%i" >nul
)
set "PATH=%USERPROFILE%\.cargo\bin;%PATH%"

if not exist node_modules call npm install || goto :fail

npm run tauri dev
exit /b %errorlevel%

:fail
echo.
echo npm install failed.
pause
exit /b 1
