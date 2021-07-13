import { NodeState } from "../constants/NodeState.enum";
import { Turn } from "../constants/Turn.enum";
import { Winner } from "../constants/Winner.enum";
import { IAIHighlight } from "./IAIHighlight";
import { IMove } from "./IMove";

export interface IGameState {
  ongoing: boolean;
  active: boolean;
  turn: Turn;
  move: IMove;
  moveCount: number;
  winner: Winner;
  size: number;
  board: NodeState[][];
  highlightedByAI?: IAIHighlight;
}
