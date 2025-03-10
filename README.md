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
### Automatic
0. Check if the build script has execution rights
1. Run `./build_and_run.sh` script
2. Client app will open at `localhost:3000` when ready

### Manual
1. Navigate to /client
2. Run `npm install` to install node_modules
3. Run `npm start` to start the client app
4. Navigate to /server
5. Run `./mvnw spring-boot:run` to start the server app
6. Access client app at `localhost:3000`

# Known issues
- When playing against CPU, promotion is automated to queen
