import { NodeState } from "../constants/NodeState.enum";

export interface IMove {
  row: number;
  column: number;
  nodeState: NodeState;
}
