#!/bin/bash
echo ""
echo "  ⚡ FitLvl - Gamified Fitness App"
echo "  ================================"
echo ""

# Start Django backend
cd /home/claude/fitlvl
python manage.py runserver 8000 &
BACKEND_PID=$!
echo "  ✅ Backend started: http://localhost:8000"
echo "  ✅ Admin panel:     http://localhost:8000/admin"

# Start React frontend
cd /home/claude/fitlvl/frontend
npx serve -s build -l 3000 &
FRONTEND_PID=$!
echo "  ✅ Frontend started: http://localhost:3000"
echo ""
echo "  📖 API Docs:"
echo "     POST /api/auth/register/  - Register"
echo "     POST /api/auth/login/     - Login"
echo "     GET  /api/profile/        - User profile"
echo "     GET  /api/workout-templates/ - Workout programs"
echo "     GET  /api/quests/         - Active quests"
echo "     GET  /api/leaderboard/    - Rankings"
echo "     GET  /api/badges/         - All badges"
echo ""
echo "  Press Ctrl+C to stop both servers"
echo ""

wait
