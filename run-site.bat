@echo off
setlocal
cd /d "%~dp0"

if not exist "index.html" (
  echo Could not find index.html in:
  echo %~dp0
  pause
  exit /b 1
)

where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo Starting local web server at http://localhost:8000 ...
  start "" "http://localhost:8000"
  python -m http.server 8000
) else (
  echo Opening index.html directly...
  start "" "%~dp0index.html"
)
