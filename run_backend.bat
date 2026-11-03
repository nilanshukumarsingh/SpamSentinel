@echo off
echo ========================================================
echo Starting SpamSentinel AI Backend (FastAPI + PyMongo)...
echo ========================================================
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause

