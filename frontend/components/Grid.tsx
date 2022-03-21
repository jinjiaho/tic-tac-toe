import React from "react";
import styles from "../styles/Grid.module.css";
import GridCell from "./GridCell";

interface IGrid {
  isTurn: boolean;
  status: string;
  last?: number;
  playerSymbol: string;
  onMove: (cell: number) => void;
}

const Grid: React.FC<IGrid> = ({
  isTurn,
  status,
  last,
  playerSymbol,
  onMove,
}) => {
  const [gameStatus, setGameStatus] = React.useState<string[]>([]);
  const [moved, setMoved] = React.useState(false);

  const handleMove = (cell: number) => {
    if (isTurn && !moved) {
      setMoved(true);
      onMove(cell);
    }
  };

  React.useEffect(() => {
    const newStatus = status.replaceAll("-", " ").split("");
    setGameStatus(newStatus);
  }, [status]);

  // If it's this user's turn, refresh move status
  React.useEffect(() => {
    if (isTurn) {
      setMoved(false);
    }
  }, [isTurn]);

  return (
    <div className={styles.container}>
      {gameStatus.length > 0 &&
        gameStatus.map((cell, i) => (
          <GridCell
            clickable={isTurn && cell === " "}
            key={`cell_${i}`}
            lastMove={i === last}
            content={cell}
            playerSymbol={playerSymbol}
            onClick={handleMove}
            index={i}
          />
        ))}
    </div>
  );
};

export default Grid;
