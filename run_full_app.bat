@echo off
title EVision Enterprise 2.0 - Global Release
echo =====================================================================
echo    STARTING EVISION ENTERPRISE E-MOBILITY & INFRASTRUCTURE PLATFORM
echo =====================================================================
echo.
cd /d "%~dp0"
echo [1/3] Verifying Database Schema and Seeds...
call npm run db:generate --workspace=server
echo.
echo [2/3] Opening Frontend Browser Portal at http://localhost:5173 ...
start http://localhost:5173
echo.
echo [3/3] Launching Full-Stack Services (Backend: 5000 ^| Frontend: 5173)...
npm run dev
pause

