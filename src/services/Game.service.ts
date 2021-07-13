import { NodeState } from "../constants/NodeState.enum";
import { Turn } from "../constants/Turn.enum";
import { Winner } from "../constants/Winner.enum";
import { IMove } from "../models/IMove";

export const GameService = () => {
  const generateInitialBoard = (size: number): NodeState[][] => {
    return Array.from(Array(size)).map((value, i) => {
      return Array.from(Array(size)).map((value, j) => {
        return NodeState.BLANK;
      });
    });
  };

  const evaluateBoard = (
    moveCount: number,
    size: number,
    board: NodeState[][],
    turn: Turn,
    move: IMove
  ): Winner => {
    const winningStates = [
      // Horizontals
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ],
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],

      // Diagonals
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
      [
        [2, 0],
        [1, 1],
        [0, 2],
      ],
    ];

    for (const possibleState of winningStates) {
      let curPlayer = null;
      let isWinner = true;
      for (const [x, y] of possibleState) {
        const occupant = board[x][y];
        if (curPlayer === null && occupant !== NodeState.BLANK) {
          curPlayer = occupant;
        } else if (curPlayer !== occupant) {
          isWinner = false;
        }
      }
      if (isWinner) {
        if (curPlayer === NodeState.AI) {
          return Winner.AI;
        } else if (curPlayer === NodeState.PLAYER) {
          return Winner.PLAYER;
        } else {
          return Winner.NONE;
        }
      }
    }

    let hasMoves = false;
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (board[x][y] === NodeState.BLANK) {
          hasMoves = true;
        }
      }
    }
    if (!hasMoves) {
      return Winner.DRAW;
    }

    return Winner.NONE;
  };

  return {
    generateInitialBoard,
    evaluateBoard,
  };
};
