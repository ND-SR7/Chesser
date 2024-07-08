package com.chesser.server.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetCPUMoveDTO {

    private String fen;
    private int depth;
}
