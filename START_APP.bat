@echo off
title EVision Enterprise - One-Click Launcher
color 0B
cls
echo ===============================================================================
echo                  EVision Enterprise Platform Launcher
echo             Tata / Google Style Smart EV Infrastructure Portal
echo ===============================================================================
echo.
echo [*] Initializing EVision Portal...
cd /d "%~dp0"

:: 1. Check if Node.js is ready (Fastest & most reliable on this PC)
node -v >nul 2>&1
if %errorlevel% equ 0 (
    echo [+] Node.js engine detected!
    echo [*] Starting EVision Enterprise Server on http://localhost:8000 ...
    echo [*] Your browser will open in 3 seconds...
    start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:8000"
    node run_server.js
    goto server_stopped
)

:: 2. Check Python
python -c "import sys" >nul 2>&1
if %errorlevel% equ 0 (
    echo [+] Python engine detected!
    echo [*] Checking packages (Flask, Pandas, Scikit-learn, Plotly, NumPy)...
    pip install flask pandas scikit-learn plotly numpy
    echo [*] Starting EVision Flask Server on http://localhost:8000 ...
    start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:8000"
    python flask_app/app.py
    goto server_stopped
)

echo.
echo [!] Neither Node.js nor Python was accessible from this terminal.
echo [i] Please open VS Code and run the commands provided in the chat.
echo.

:server_stopped
echo.
echo [!] EVision Server has stopped.
pause
