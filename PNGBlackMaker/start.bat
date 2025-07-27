@echo off
chcp 65001 >nul
title Smart Mask Generator 2.0
echo ========================================
echo Smart Mask Generator 2.0 Starting...
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not detected!
    echo Please install Python 3.7 or above
    echo Download: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo [CHECK] Python is installed
python --version
echo.

echo [START] Starting local server...
echo.

REM Start server
python server.py

echo.
echo [END] Server closed
pause