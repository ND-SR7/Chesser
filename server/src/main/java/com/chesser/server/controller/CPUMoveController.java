package com.chesser.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import com.chesser.server.model.dto.GetCPUMoveDTO;
import com.chesser.server.model.entity.CPUMove;
import com.chesser.server.service.CPUMoveService;

import lombok.RequiredArgsConstructor;

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
