up:
	supabase start
	cd backend && uv run uvicorn app.main:app --reload --port 8000 &

down:
	supabase stop
	pkill -f "uvicorn app.main:app"
