@echo off
REM ============================================================
REM  Budgy - release build
REM  Output: src-tauri\target\release\budgy.exe
REM          src-tauri\target\release\bundle\nsis\*.exe  (installer)
REM  Same toolchain pin as dev.bat - see the note there.
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

npm run tauri build
if errorlevel 1 goto :fail

echo.
echo ============================================================
echo  Done.
echo  exe:       src-tauri\target\release\budgy.exe
echo  installer: src-tauri\target\release\bundle\nsis\
echo ============================================================
pause
exit /b 0

:fail
echo.
echo BUILD FAILED
pause
exit /b 1
