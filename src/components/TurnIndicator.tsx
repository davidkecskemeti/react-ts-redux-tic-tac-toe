import { useSelector } from "react-redux";
import { Turn } from "../constants/Turn.enum";
import { getTurnSelector, isOngoingSelector } from "../store/GameState";

const TurnIndicator: React.FC = () => {
  const turn = useSelector(getTurnSelector);
  const ongoing = useSelector(isOngoingSelector);

  return (
    <div className="turn-indicator">
      {ongoing && (turn === Turn.PLAYER ? "Your Turn" : "AI Turn")}
    </div>
  );
};

export default TurnIndicator;
