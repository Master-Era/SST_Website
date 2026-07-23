@echo off
start "Mandir Node Backend" cmd /k "cd /d %~dp0backend-node && npm install && npm start"
start "Mandir React Frontend" cmd /k "cd /d %~dp0 && npm install && npm start"
