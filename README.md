# Chesser ♟️
Web platform for playing chess.
It contains 2 game modes:
1. Game Against CPU - play against custom-made chess engine
2. Solo/Two Player Game - play solo and experiment with Chesser or play against friends on the same client

# Requirements
- Node v18 or above
- Java 17 or above
- curl, if running build script

# Running the app
### Prerequisites
- Automatic Start - check if `build_and_run` and `mvnw` scripts have execution rights
- Manual Start - check if `mvnw` script has execution rights

### Automatic
1. Run `./build_and_run.sh` script
2. Client app will open at `localhost:3000` when ready

### Manual
1. Navigate to client directory
2. Run `npm install` to install node_modules
3. Run `npm start` to start the client app
4. Navigate to server directory
5. Run `./mvnw spring-boot:run` to start the server app
6. Access client app at `localhost:3000`

# Known issues
