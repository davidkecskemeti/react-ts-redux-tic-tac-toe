import { combineReducers } from "redux";
import Entities, { IEntities } from "./Entities";

export interface IRootReducer {
  entities: IEntities;
}
export default combineReducers<IRootReducer>({
  entities: Entities,
});
