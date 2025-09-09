@echo off
echo ========================================
echo    ARRET DES SERVEURS
echo ========================================
echo.

echo Arret de tous les processus Node.js...
taskkill /f /im node.exe

echo.
echo ========================================
echo    SERVEURS ARRETES
echo ========================================
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul

