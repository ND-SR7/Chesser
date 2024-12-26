package com.chesser.server.model.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameState {

    private boolean isDraw;
    private boolean isInsufficientMaterial;
    private boolean isStalemate;
    private boolean isKingAttacked;
    private boolean isMated;
}
