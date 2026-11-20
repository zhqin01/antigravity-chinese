@echo off
chcp 65001 >nul
title Antigravity Chinese Localization Tool
cd /d "%~dp0"
node "%~dp0antigravity-i18n.js" menu
if %errorlevel% neq 0 (
  pause
)
