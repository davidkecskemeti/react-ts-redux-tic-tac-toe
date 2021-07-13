import { useDispatch, useSelector } from "react-redux";
import {
  isGameOngoingSelector,
  resetGame,
  startGame,
} from "../store/GameState";

export interface ActionMenuProps {}

const ActionMenu: React.FC<ActionMenuProps> = () => {
  const dispatch = useDispatch();
  const isGameOnGoing = useSelector(isGameOngoingSelector);

  const startGameClick: React.MouseEventHandler<HTMLButtonElement> = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!isGameOnGoing) {
      dispatch(resetGame());
      dispatch(startGame());
    }
  };

  return (
    <div className="action-menu">
      {isGameOnGoing === false ? (
        <button onClick={startGameClick} className="button">
          Start game
        </button>
      ) : null}
    </div>
  );
};

export default ActionMenu;
