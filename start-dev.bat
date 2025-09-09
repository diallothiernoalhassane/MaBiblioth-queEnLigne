@echo off
echo Demarrage des serveurs Frontend et Backend...

echo.
echo === Demarrage du Backend (Port 5000) ===
start "Backend Server" cmd /k "cd BackEnd && npm start"

timeout /t 3 /nobreak > nul

echo.
echo === Demarrage du Frontend (Port 5173) ===
start "Frontend Server" cmd /k "cd FrontEnd && npm run dev"

echo.
echo Les serveurs sont en cours de demarrage...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
pause

