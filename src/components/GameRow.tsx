export interface IGameRowProps {
  row: number;
  nodes: React.ReactNode[];
}

const GameRow: React.FC<IGameRowProps> = ({ row, nodes }) => {
  return <div className="game-row">{nodes}</div>;
};

export default GameRow;
