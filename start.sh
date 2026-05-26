#!/usr/bin/env sh
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

echo "Starting MongoDB..."
docker compose up -d mongo

cd backend
if [ ! -d node_modules ]; then
  echo "Installing backend dependencies..."
  npm install
fi

cd "$ROOT_DIR/frontend"
if [ ! -d node_modules ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

cd "$ROOT_DIR"

echo "Starting backend and frontend..."

cd backend
npm run dev > "$ROOT_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
cd "$ROOT_DIR/frontend"
npm run dev > "$ROOT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

cd "$ROOT_DIR"

echo "Backend running as PID $BACKEND_PID"
echo "Frontend running as PID $FRONTEND_PID"
echo "Logs: backend.log, frontend.log"

echo "Press Ctrl+C to stop."
trap 'echo "Stopping servers..."; kill "$BACKEND_PID" "$FRONTEND_PID"; docker compose down; exit 0' INT TERM
wait "$BACKEND_PID" "$FRONTEND_PID"