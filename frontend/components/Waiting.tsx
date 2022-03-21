import React from "react";
import styles from "../styles/Waiting.module.css";

interface IWaiting {
  roomId: string;
}

const Waiting: React.FC<IWaiting> = ({ roomId }) => {
  return (
    <div className={styles.container}>
      <h1>{roomId}</h1>
      <h2>Waiting for an opponent...</h2>
    </div>
  );
};

export default Waiting;
