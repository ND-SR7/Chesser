package com.chesser.server.service;

import com.chesser.server.model.dto.GetGameStateDTO;
import com.chesser.server.model.entity.GameState;

public interface GameStateService {

    GameState getGameState(GetGameStateDTO dto);
}
