import { ReactNode, useEffect, useState } from "react";
import GameNode from "./GameNode";
import GameRow from "./GameRow";
import {
  getGameStateSelector,
  getTurnSelector,
  AISelection,
} from "./../store/GameState";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Turn } from "../constants/Turn.enum";
// import { Turn } from "../constants/Turn.enum";
export interface GameBoardProps {}

const GameBoard: React.FC<GameBoardProps> = () => {
  const [boardNode, setNodeBoard] = useState<ReactNode[] | undefined>();
  const gameState = useSelector(getGameStateSelector);
  const turn = useSelector(getTurnSelector);
  const dispatch = useDispatch();

  const generateBoard = (size: number): React.ReactNode[] => {
    return Array.from(new Array(size)).map((value, i: number) => {
      const gameNodeList = Array.from(new Array(size)).map(
        (value, j: number) => {
          return <GameNode key={`${i}-${j}`} row={i} column={j} />;
        }
      );
      return <GameRow key={i} row={i} nodes={gameNodeList} />;
    });
  };

  useEffect(() => {
    setNodeBoard(generateBoard(3));
  }, []);

  useEffect(() => {
    if (gameState.ongoing && gameState.active && gameState.turn === Turn.AI) {
      dispatch(AISelection());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn]);

  return <div>{boardNode && boardNode}</div>;
};

export default GameBoard;
