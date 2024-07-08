package com.chesser.server.service;

import com.chesser.server.model.dto.GetCPUMoveDTO;
import com.chesser.server.model.entity.CPUMove;

public interface CPUMoveService {

    CPUMove getCPUMove(GetCPUMoveDTO dto);
}
