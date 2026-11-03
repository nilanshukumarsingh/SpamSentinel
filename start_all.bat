@echo off
echo =======================================================================
echo   SpamSentinel AI: Intelligent Spam Detection & Archival System
echo   Course: CSE-494 (Intelligent NoSQL Databases)
echo =======================================================================
echo.
echo [1/2] Launching Backend Server on http://localhost:8000 ...
start "SpamSentinel Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching Frontend UI on http://localhost:5173 ...
start "SpamSentinel Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are launching!
echo Backend Swagger Docs: http://localhost:8000/docs
echo Frontend Web UI:      http://localhost:5173
echo =======================================================================
pause

