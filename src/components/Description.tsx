import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Winner } from "../constants/Winner.enum";
import { getWinnerSelector, isOngoingSelector } from "../store/GameState";

const Description: React.FC = () => {
  const ongoing = useSelector(isOngoingSelector);
  const winner = useSelector(getWinnerSelector);

  const [description, setDescription] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (winner !== Winner.NONE) {
      switch (winner) {
        case Winner.DRAW:
          setDescription("DRAW! Tie game, try again.");
          break;
        case Winner.PLAYER:
          setDescription("You win!");
          break;
        case Winner.AI:
          setDescription("You lose!");
          break;
      }
    }
  }, [winner]);

  return (
    <div className="description">{!ongoing && description && description}</div>
  );
};

export default Description;
