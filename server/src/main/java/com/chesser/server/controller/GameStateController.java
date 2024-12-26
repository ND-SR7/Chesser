package com.chesser.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import com.chesser.server.model.dto.GetGameStateDTO;
import com.chesser.server.model.entity.GameState;
import com.chesser.server.service.GameStateService;

import lombok.RequiredArgsConstructor;

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
