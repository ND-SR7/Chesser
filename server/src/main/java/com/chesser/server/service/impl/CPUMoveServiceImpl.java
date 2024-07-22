package com.chesser.server.service.impl;

import com.chesser.server.model.dto.GetCPUMoveDTO;
import com.chesser.server.model.entity.CPUMove;
import com.chesser.server.service.CPUMoveService;
import com.github.bhlangonijr.chesslib.*;
import com.github.bhlangonijr.chesslib.move.Move;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CPUMoveServiceImpl implements CPUMoveService {

    private final Board board = new Board();

    @Override
    public CPUMove getCPUMove(GetCPUMoveDTO dto) {
        board.loadFromFen(dto.getFen());

        Side cpuSide = board.getSideToMove();
        Move bestMove = getBestMove(board, dto.getDepth(), cpuSide);

        // after game ends, best move is null
        if (bestMove == null)
            return new CPUMove();

        CPUMove cpuMove = new CPUMove();
        cpuMove.setFrom(bestMove.getFrom().toString());
        cpuMove.setTo(bestMove.getTo().toString());

        return cpuMove;
    }

    private Move getBestMove(Board board, int depth, Side cpuSide) {
        List<Move> legalMoves = board.legalMoves();
        Move bestMove = null;
        int bestValue = Integer.MIN_VALUE;

        for (Move move : legalMoves) {
            board.doMove(move);
            int boardValue = minimax(board, depth - 1, Integer.MIN_VALUE, Integer.MAX_VALUE, false, cpuSide);
            board.undoMove();

            if (boardValue > bestValue) {
                bestValue = boardValue;
                bestMove = move;
            }
        }

        // setting best move as castling instead of moving one space towards rook when possible
        // has to be manual due to lack of depth (max depth is 4)
        if (bestMove != null) {
            if (cpuSide == Side.WHITE) {
                if (bestMove.getFrom() == Square.E1 && bestMove.getTo() == Square.F1) {
                    if (board.legalMoves().contains(new Move(Square.E1, Square.G1))) {
                        bestMove = new Move(Square.E1, Square.G1);
                    }
                } else if (bestMove.getFrom() == Square.E1 && bestMove.getTo() == Square.D1) {
                    if (board.legalMoves().contains(new Move(Square.E1, Square.C1))) {
                        bestMove = new Move(Square.E1, Square.C1);
                    }
                }
            } else if (cpuSide == Side.BLACK) {
                if (bestMove.getFrom() == Square.E8 && bestMove.getTo() == Square.F8) {
                    if (board.legalMoves().contains(new Move(Square.E8, Square.G8))) {
                        bestMove = new Move(Square.E8, Square.G8);
                    }
                } else if (bestMove.getFrom() == Square.E8 && bestMove.getTo() == Square.D8) {
                    if (board.legalMoves().contains(new Move(Square.E8, Square.C8))) {
                        bestMove = new Move(Square.E8, Square.C8);
                    }
                }
            }
        }

        return bestMove;
    }

    private int minimax(Board board, int depth, int alpha, int beta, boolean maximizingPlayer, Side cpuSide) {
        if (depth == 0) {
            return evaluateBoard(board, cpuSide);
        }

        List<Move> legalMoves = board.legalMoves();

        if (maximizingPlayer) {
            int maxEval = Integer.MIN_VALUE;
            for (Move move : legalMoves) {
                board.doMove(move);
                int eval = minimax(board, depth - 1, alpha, beta, false, cpuSide);
                board.undoMove();
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) {
                    break;
                }
            }
            return maxEval;
        } else {
            int minEval = Integer.MAX_VALUE;
            for (Move move : legalMoves) {
                board.doMove(move);
                int eval = minimax(board, depth - 1, alpha, beta, true, cpuSide);
                board.undoMove();
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) {
                    break;
                }
            }
            return minEval;
        }
    }

    private int evaluateBoard(Board board, Side cpuSide) {
        int score = 0;

        for (Square square : Square.values()) {
            Piece piece = board.getPiece(square);
            if (piece != Piece.NONE) {
                int pieceValue = getPieceValue(piece);
                int positionValue = getPositionValue(piece, square, cpuSide);
                score += (piece.getPieceSide() == cpuSide ? 1 : -1) * (pieceValue + positionValue);
            }
        }

        return score;
    }

    private int getPieceValue(Piece piece) {
        return switch (piece.getPieceType()) {
            case PAWN -> 100;
            case KNIGHT -> 320;
            case BISHOP -> 330;
            case ROOK -> 500;
            case QUEEN -> 900;
            case KING -> 20000;
            default -> 0;
        };
    }

    private int getPositionValue(Piece piece, Square square, Side cpuSide) {
        int[] pawnTable = {
                0,  0,  0,  0,  0,  0,  0,  0,
                50, 50, 50, 50, 50, 50, 50, 50,
                10, 10, 20, 30, 30, 20, 10, 10,
                5,  5, 10, 25, 25, 10,  5,  5,
                0,  0,  0, 20, 20,  0,  0,  0,
                5, -5,-10,  0,  0,-10, -5,  5,
                5, 10, 10,-20,-20, 10, 10,  5,
                0,  0,  0,  0,  0,  0,  0,  0
        };

        int[] knightTable = {
                -50,-40,-30,-30,-30,-30,-40,-50,
                -40,-20,  0,  0,  0,  0,-20,-40,
                -30,  0, 10, 15, 15, 10,  0,-30,
                -30,  5, 15, 20, 20, 15,  5,-30,
                -30,  0, 15, 20, 20, 15,  0,-30,
                -30,  5, 10, 15, 15, 10,  5,-30,
                -40,-20,  0,  5,  5,  0,-20,-40,
                -50,-40,-30,-30,-30,-30,-40,-50,
        };

        int[] bishopTable = {
                -20,-10,-10,-10,-10,-10,-10,-20,
                -10,  0,  0,  0,  0,  0,  0,-10,
                -10,  0,  5, 10, 10,  5,  0,-10,
                -10,  5,  5, 10, 10,  5,  5,-10,
                -10,  0, 10, 10, 10, 10,  0,-10,
                -10, 10, 10, 10, 10, 10, 10,-10,
                -10,  5,  0,  0,  0,  0,  5,-10,
                -20,-10,-10,-10,-10,-10,-10,-20,
        };

        int[] rookTable = {
                0,  0,  0,  0,  0,  0,  0,  0,
                5, 10, 10, 10, 10, 10, 10,  5,
                -5,  0,  0,  0,  0,  0,  0, -5,
                -5,  0,  0,  0,  0,  0,  0, -5,
                -5,  0,  0,  0,  0,  0,  0, -5,
                -5,  0,  0,  0,  0,  0,  0, -5,
                -5,  0,  0,  0,  0,  0,  0, -5,
                0,  0,  0,  5,  5,  0,  0,  0
        };

        int[] queenTable = {
                -20,-10,-10, -5, -5,-10,-10,-20,
                -10,  0,  0,  0,  0,  0,  0,-10,
                -10,  0,  5,  5,  5,  5,  0,-10,
                -5,  0,  5,  5,  5,  5,  0, -5,
                0,  0,  5,  5,  5,  5,  0, -5,
                -10,  5,  5,  5,  5,  5,  0,-10,
                -10,  0,  5,  0,  0,  0,  0,-10,
                -20,-10,-10, -5, -5,-10,-10,-20
        };

        int[] kingTable = {
                -30,-40,-40,-50,-50,-40,-40,-30,
                -30,-40,-40,-50,-50,-40,-40,-30,
                -30,-40,-40,-50,-50,-40,-40,-30,
                -30,-40,-40,-50,-50,-40,-40,-30,
                -20,-30,-30,-40,-40,-30,-30,-20,
                -10,-20,-20,-20,-20,-20,-20,-10,
                20, 20,  0,  0,  0,  0, 20, 20,
                20, 30, 10,  0,  0, 10, 30, 20
        };

        int index = square.ordinal();
        int[] table = new int[64];

        switch (piece.getPieceType()) {
            case PAWN -> table = pawnTable;
            case KNIGHT -> table = knightTable;
            case BISHOP -> table = bishopTable;
            case ROOK -> table = rookTable;
            case QUEEN -> table = queenTable;
            case KING -> table = kingTable;
        }

        if (cpuSide == Side.BLACK) {
            int row = index / 8;
            int newIndex = (7 - row) * 8 + (index % 8);
            return table[newIndex];
        } else {
            return table[index];
        }
    }
}
