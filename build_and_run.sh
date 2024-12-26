#!/bin/bash

log_message() {
  echo "[`date '+%Y-%m-%d %H:%M:%S'`] $1"
}

log_message "Navigating to /client directory..."
cd client || { log_message "Failed to navigate to /client directory."; exit 1; }

log_message "Running npm install to install node_modules..."
npm install || { log_message "npm install failed."; exit 1; }

log_message "Starting the client app..."
npm start &
CLIENT_PID=$!
if [ $? -eq 0 ]; then
  log_message "Client app started successfully (PID: $CLIENT_PID). Waiting for the page to load..."
  while ! curl -sSf http://localhost:3000 > /dev/null; do
    sleep 5
  done
  log_message "Client app is up and running at http://localhost:3000."
else
  log_message "Failed to start the client app."
  exit 1
fi

log_message "Navigating to /server directory..."
cd ..
cd server || { log_message "Failed to navigate to /server directory."; exit 1; }

log_message "Starting the server app using Spring Boot..."
./mvnw spring-boot:run &
SERVER_PID=$!
if [ $? -eq 0 ]; then
  log_message "Server app started successfully (PID: $SERVER_PID). Waiting for Spring Boot to initialize..."
  while ! curl -sSf http://localhost:8080/api/v1/ping > /dev/null; do
    sleep 5
  done
  log_message "Server app is up and running at http://localhost:8080."
else
  log_message "Failed to start the server app."
  exit 1
fi

log_message "Chesser is ready for use."
log_message "To stop both applications, press Ctrl+C."

wait $CLIENT_PID
wait $SERVER_PID

log_message "Build and run process completed."
