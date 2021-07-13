import { NodeState } from "../constants/NodeState.enum";

export interface INode {
  row: number;
  column: number;
  state: NodeState;
}
