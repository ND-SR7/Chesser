package com.chesser.server.controller;

import com.chesser.server.model.dto.GetGameStateDTO;
import com.chesser.server.model.entity.GameState;
import com.chesser.server.service.GameStateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/game-state")
public class GameStateController {

    private final GameStateService gameStateService;

    @PostMapping
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<GameState> getGameState(@RequestBody GetGameStateDTO dto) {
        return ResponseEntity.ok(gameStateService.getGameState(dto));
    }
}
