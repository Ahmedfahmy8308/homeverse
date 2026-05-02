@echo off
title Homeverse - Stop Servers
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0stop.ps1"
echo.
echo Press any key to close this window...
pause >nul
