#!/bin/bash

# CenterPort - Run Backend & Frontend
# Starts both the Spring Boot backend and Next.js frontend in parallel.
# Usage: ./run.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo ""
  echo "Shutting down..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

echo "=== CenterPort Development Startup ==="
echo ""

# Start Backend (Spring Boot)
echo "[Backend] Starting Spring Boot on port 8080..."
cd "$SCRIPT_DIR/backend"
if [ -f "./mvnw" ]; then
  ./mvnw spring-boot:run &
else
  mvn spring-boot:run &
fi
BACKEND_PID=$!

# Start Frontend (Next.js)
echo "[Frontend] Starting Next.js dev server on port 3000..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=== Both services are starting ==="
echo "  Backend:  http://localhost:8080"
echo "  Frontend: http://localhost:3000"
echo "  Swagger:  http://localhost:8080/swagger-ui.html"
echo ""
echo "Press Ctrl+C to stop both services."

wait
