import React from "react";
import { GameEndMessage } from "../interfaces.ts/websocket";
import styles from "../styles/GameEnd.module.css";

interface IGameEnd extends GameEndMessage {
  onBack: () => void;
}

const GameEnd: React.FC<IGameEnd> = ({ players, left, onBack }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>{left} has left the room.</h1>
      <div className={styles.scoreboard}>
        <h4 className={styles.scoreboardHeader}>Final Score</h4>
        <div className={styles.scoreboardCell}>{players[0].username}</div>
        <div className={styles.scoreboardCell}>{players[0].score}</div>
        <div className={styles.scoreboardCell}>{players[1].username}</div>
        <div className={styles.scoreboardCell}>{players[1].score}</div>
      </div>
      <div className={styles.back} onClick={onBack}>
        <h2>Back to homepage</h2>
      </div>
    </div>
  );
};

export default GameEnd;
