import { combineReducers } from "redux";
import { IGameState } from "../models/IGameState";
import GameState from "./GameState";

export interface IEntities {
  gameState: IGameState;
}

export default combineReducers<IEntities>({
  gameState: GameState,
});
