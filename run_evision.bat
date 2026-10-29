@echo off
title EVision Web Application
echo ========================================================
echo        STARTING EVISION WEB APPLICATION
echo ========================================================
echo.
cd /d "%~dp0"
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)
echo Opening browser at http://localhost:8501 ...
start http://localhost:8501
echo Launching Streamlit server...
streamlit run app/app.py --server.port 8501
pause
