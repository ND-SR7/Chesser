package com.chesser.server.controller;

import com.chesser.server.model.dto.GetCPUMoveDTO;
import com.chesser.server.model.entity.CPUMove;
import com.chesser.server.service.CPUMoveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/cpu-move")
public class CPUMoveController {

    private final CPUMoveService cpuMoveService;

    @PostMapping
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<CPUMove> getGameState(@RequestBody GetCPUMoveDTO dto) {
        return ResponseEntity.ok(cpuMoveService.getCPUMove(dto));
    }
}
