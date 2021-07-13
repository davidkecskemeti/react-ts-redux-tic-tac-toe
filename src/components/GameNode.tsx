import { ReactNode, useEffect, useState } from "react";
import { Turn } from "../constants/Turn.enum";
import x from "./../assets/x.png";
import o from "./../assets/o.png";
import { useDispatch, useSelector } from "react-redux";
import {
  getGameStateSelector,
  getSelectedBoardNodaStateSelector,
  isHighlightedByAISelector,
  selectGameNode,
} from "../store/GameState";
import { NodeState } from "../constants/NodeState.enum";
import { IMove } from "../models/IMove";

export interface IGameNodeProps {
  row: number;
  column: number;
}

const GameNode: React.FC<IGameNodeProps> = ({ row, column }) => {
  const gameState = useSelector(getGameStateSelector);
  const nodeState = useSelector(getSelectedBoardNodaStateSelector(row, column));
  const highlighted = useSelector(isHighlightedByAISelector(row, column));
  const [selection, setSelection] = useState<ReactNode | undefined>(undefined);
  const dispatch = useDispatch();

  const playerClick: React.MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      nodeState === NodeState.BLANK &&
      gameState.ongoing &&
      gameState.active &&
      gameState.turn === Turn.PLAYER
    ) {
      const move: IMove = {
        row,
        column,
        nodeState: NodeState.PLAYER,
      };
      dispatch(selectGameNode(move));
    }
  };

  useEffect(() => {
    if (nodeState !== NodeState.BLANK) {
      setSelection(
        <img
          alt={nodeState === NodeState.PLAYER ? "PLAYER" : "AI"}
          src={nodeState === NodeState.PLAYER ? x : o}
        />
      );
    } else {
      setSelection(undefined);
    }
  }, [nodeState]);

  return (
    <div
      className={`game-node square ${highlighted && "highlight"}`}
      onClick={playerClick}
    >
      {selection && selection}
    </div>
  );
};

export default GameNode;
