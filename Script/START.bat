@echo off
title Homeverse - Auto Setup
echo.
echo Starting Homeverse full stack setup...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0setup.ps1" -ForceRestart
echo.
echo Press any key to close this window...
pause >nul
