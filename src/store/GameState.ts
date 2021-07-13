import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Turn } from "../constants/Turn.enum";
import { IGameState } from "../models/IGameState";
import { createSelector } from "reselect";
import { RootState } from "..";
import { Dispatch } from "react";
import { Winner } from "../constants/Winner.enum";
import { IMove } from "../models/IMove";
import { GameService } from "../services/Game.service";
import { AIService } from "../services/AI.service";
import { IAIHighlight } from "../models/IAIHighlight";
import { NodeState } from "../constants/NodeState.enum";

const gameService = GameService();
const aiService = AIService();

const slice = createSlice({
  name: "gameState",
  initialState: {
    ongoing: false,
    active: false,
    turn: Turn.NONE,
    moveCount: 0,
    winner: Winner.NONE,
    size: 3,
    board: gameService.generateInitialBoard(3),
  } as IGameState,
  reducers: {
    setWinner: (state: IGameState, action: PayloadAction<Winner>) => {
      state.winner = action.payload;
    },

    setTurn: (state, action) => {
      state.turn = action.payload;
    },

    setGameOngoing: (state, action) => {
      state.ongoing = action.payload;
    },

    setGameStatus: (state, action) => {
      state.active = action.payload;
    },

    setBoard: (state, action) => {
      state.board = action.payload;
    },

    setAIHiglighted: (state, action) => {
      state.highlightedByAI = action.payload;
    },

    setMoveCounter: (state, action) => {
      state.moveCount = action.payload;
    },

    removeAIHiglighted: (state, action) => {
      state.highlightedByAI = undefined;
    },

    setGameNode: (state: IGameState, action: PayloadAction<IMove>) => {
      const { row, column, nodeState } = action.payload;
      state.moveCount++;
      state.move = action.payload;
      state.board[row][column] = nodeState;
    },
  },
});

export const {
  setGameNode,
  setGameStatus,
  setWinner,
  setTurn,
  setGameOngoing,
  setAIHiglighted,
  removeAIHiglighted,
  setBoard,
  setMoveCounter,
} = slice.actions;

//Action creators
export const changeGameStatus = createAction<boolean>(setGameStatus.type);
export const changeTurn = createAction<Turn>(setTurn.type);
export const changeWinner = createAction<Winner>(setWinner.type);
export const changeGameNode = createAction<IMove>(setGameNode.type);
export const changeGameOngoing = createAction<boolean>(setGameOngoing.type);
export const changeHighlighted = createAction<IAIHighlight | undefined>(
  setAIHiglighted.type
);
export const removeHighlight = createAction(removeAIHiglighted.type);
export const changeBoard = createAction<NodeState[][]>(setBoard.type);
export const changeMoveCounter = createAction<number>(setMoveCounter.type);

export const resetGame = () => (dispatch: Dispatch<any>) => {
  dispatch(changeTurn(Turn.NONE));
  dispatch(changeMoveCounter(0));
  dispatch(changeGameOngoing(false));
  dispatch(changeGameStatus(false));
  dispatch(changeBoard(gameService.generateInitialBoard(3)));
};

export const startGame = () => (dispatch: Dispatch<any>) => {
  dispatch(changeTurn(Turn.PLAYER));
  dispatch(changeGameOngoing(true));
  dispatch(changeGameStatus(true));
};

export const selectGameNode = (move: IMove) => (dispatch: Dispatch<any>) => {
  dispatch(changeGameStatus(false));
  dispatch(changeGameNode(move));
  dispatch(evaluateBoard());
};

const evaluateBoard = () => (dispatch: any, getState: () => RootState) => {
  const gameState: IGameState = getState().rootReducer.entities.gameState;
  const winner: Winner = gameService.evaluateBoard(
    gameState.moveCount,
    gameState.size,
    gameState.board,
    gameState.turn,
    gameState.move
  );

  if (winner !== Winner.NONE) {
    dispatch(changeGameOngoing(false));
    dispatch(changeWinner(winner));
    dispatch(changeGameStatus(false));
  } else {
    dispatch(changeGameStatus(true));
    dispatch(
      changeTurn(gameState.turn === Turn.PLAYER ? Turn.AI : Turn.PLAYER)
    );
  }
};

export const AISelection =
  () => async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const gameState: IGameState = getState().rootReducer.entities.gameState;
    dispatch(changeGameStatus(false));
    await dispatch(mimicHighlight(gameState.size));

    const selectedMoveByAI = aiService.getNextMove(gameState);

    if (selectedMoveByAI) {
      dispatch(
        changeGameNode({
          row: selectedMoveByAI.row,
          column: selectedMoveByAI.column,
          nodeState: NodeState.AI,
        })
      );
      dispatch(evaluateBoard());
    } else {
      dispatch(changeGameOngoing(false));
    }
  };

const mimicHighlight = (size: number) => async (dispatch: Dispatch<any>) => {
  for (let index = 0; index < size * 4; index++) {
    let row: number = Math.floor(Math.random() * size);
    let column: number = Math.floor(Math.random() * size);
    await dispatch(highlightActionCreator(row, column));
  }
  dispatch(removeHighlight());
};
const highlightActionCreator =
  (row: number, column: number) => (dispatch: Dispatch<any>) =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        dispatch(
          changeHighlighted({
            row: row,
            column: column,
          })
        );
        resolve();
      }, 100);
    });

//SELECTORS
export const getSelectedBoardNodaStateSelector = (
  row: number,
  column: number
) =>
  createSelector(
    gameStateSelector,
    (gameState) => gameState.board[row][column]
  );

export const isHighlightedByAISelector = (row: number, column: number) =>
  createSelector(gameStateSelector, (gameState) => {
    return (
      gameState.highlightedByAI &&
      row === gameState.highlightedByAI?.row &&
      column === gameState.highlightedByAI.column
    );
  });

const gameStateSelector = (state: RootState) =>
  state.rootReducer.entities.gameState;

export const getGameStateSelector = createSelector(
  gameStateSelector,
  (gameState: IGameState) => gameState
);

export const getTurnSelector = createSelector(
  gameStateSelector,
  (gameState) => gameState.turn
);

export const getWinnerSelector = createSelector(
  gameStateSelector,
  (gameState) => gameState.winner
);

export const getBoardSelector = createSelector(
  gameStateSelector,
  (gameState) => gameState.board
);

export const isOngoingSelector = createSelector(
  gameStateSelector,
  (gameState) => gameState.ongoing
);

export const isGameOngoingSelector = createSelector(
  gameStateSelector,
  (gameState): boolean => gameState.ongoing
);

export default slice.reducer;
