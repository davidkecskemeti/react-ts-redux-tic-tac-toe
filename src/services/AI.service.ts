import { NodeState } from "../constants/NodeState.enum";
import { Turn } from "../constants/Turn.enum";
import { Winner } from "../constants/Winner.enum";
import { IGameState } from "../models/IGameState";
import { IMove } from "../models/IMove";
import { GameService } from "./Game.service";

const gameService = GameService();
export const AIService = () => {
  const getNextMove = (gameState: IGameState): IMove | undefined => {
    const testValue = minimaxAlgorithm(
      gameState.moveCount,
      gameState.size,
      gameState.board,
      gameState.turn,
      Turn.AI,
      gameState.move
    );
    return {
      row: testValue[1][0],
      column: testValue[1][1],
      nodeState: NodeState.AI,
    } as IMove;
  };

  const minimaxAlgorithm = (
    moveCount: number,
    size: number,
    board: NodeState[][],
    turn: Turn,
    nextTurn: Turn,
    move: IMove
  ): any[] => {
    const winner: Winner = gameService.evaluateBoard(
      moveCount,
      size,
      board,
      turn,
      move
    );

    if (winner === Winner.AI) {
      return [1, move];
    } else if (winner === Winner.PLAYER) {
      return [-1, move];
    }

    let score: number;
    if (nextTurn === Turn.AI) {
      [score, move] = minimaxMaximize(moveCount, size, board);
    } else {
      [score, move] = minimaxMinimize(moveCount, size, board);
    }

    if (move == null) {
      score = 0;
    }

    return [score, move];
  };

  const minimaxMaximize = (
    moveCount: number,
    size: number,
    board: NodeState[][]
  ): any[] => {
    let score = Number.NEGATIVE_INFINITY;
    let move = null;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        if (board[x][y] === NodeState.BLANK) {
          const newBoard = board.map((r) => r.slice());
          newBoard[x][y] = NodeState.AI;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [newMoveScore, _] = minimaxAlgorithm(
            ++moveCount,
            size,
            newBoard,
            Turn.AI,
            Turn.PLAYER,
            { row: x, column: y, nodeState: NodeState.AI }
          );

          if (newMoveScore > score) {
            move = [x, y];
            score = newMoveScore;
          }
        }
      }
    }

    return [score, move];
  };

  const minimaxMinimize = (
    moveCount: number,
    size: number,
    board: NodeState[][]
  ): any[] => {
    let score = Number.POSITIVE_INFINITY;
    let move = null;

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (board[x][y] === NodeState.BLANK) {
          const newBoard = board.map((r) => r.slice());
          newBoard[x][y] = NodeState.PLAYER;

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [newMoveScore, _] = minimaxAlgorithm(
            ++moveCount,
            size,
            newBoard,
            Turn.PLAYER,
            Turn.AI,
            { row: x, column: y, nodeState: NodeState.PLAYER }
          );

          if (newMoveScore < score) {
            move = [x, y];
            score = newMoveScore;
          }
        }
      }
    }

    return [score, move];
  };

  return {
    getNextMove,
  };
};
