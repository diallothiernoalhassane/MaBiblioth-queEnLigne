@echo off
echo ========================================
echo    DEMARRAGE DES SERVEURS
echo ========================================
echo.

echo [1/2] Demarrage du serveur Backend...
start "Backend Server" cmd /k "cd BackEnd && node server.js"

echo.
echo [2/2] Demarrage du serveur Frontend...
start "Frontend Server" cmd /k "cd FrontEnd && npm run dev"

echo.
echo ========================================
echo    SERVEURS EN COURS DE DEMARRAGE
echo ========================================
echo.
echo Backend  : http://localhost:5000
echo Frontend: http://localhost:5173 ou 5174
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul

