start_backend:
	cd src/backend && uvicorn database:app --reload

start_frontend:
	cd src/frontend/duck-pond && npm run dev

start_ai:
	cd src/backend && python flask_server.py