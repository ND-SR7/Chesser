package com.chesser.server.service.impl;

import com.chesser.server.model.dto.GetGameStateDTO;
import com.chesser.server.model.entity.GameState;
import com.chesser.server.service.GameStateService;
import com.github.bhlangonijr.chesslib.Board;
import org.springframework.stereotype.Service;

@Service
public class GameStateServiceImpl implements GameStateService {

    private final Board board = new Board();

    @Override
    public GameState getGameState(GetGameStateDTO dto) {
        board.loadFromFen(dto.getFen());

        return GameState.builder()
                .isDraw(board.isDraw())
                .isInsufficientMaterial(board.isInsufficientMaterial())
                .isStalemate(board.isStaleMate())
                .isKingAttacked(board.isKingAttacked())
                .isMated(board.isMated())
                .build();
    }
}
