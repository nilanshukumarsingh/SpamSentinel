Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host "  SpamSentinel AI: Intelligent Spam Detection & Archival System" -ForegroundColor Green
Write-Host "  Course: CSE-494 (Intelligent NoSQL Databases)" -ForegroundColor Yellow
Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] Starting Backend Server (FastAPI + PyMongo)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "[2/2] Starting Frontend UI (React + Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "Done! Services are launching in separate windows." -ForegroundColor Green
Write-Host "Backend API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Frontend Web App: http://localhost:5173" -ForegroundColor Cyan

