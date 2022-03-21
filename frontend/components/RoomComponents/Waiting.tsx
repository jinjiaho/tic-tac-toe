import React from "react";
import styles from "../../styles/Waiting.module.css";

interface IWaiting {
  roomId: string;
  onLeaveRoom: () => void;
}

const Waiting: React.FC<IWaiting> = ({ roomId, onLeaveRoom }) => {
  return (
    <div className={styles.container}>
      <h1>{roomId}</h1>
      <h2>Waiting for an opponent...</h2>
      <div className={styles.leaveRoom} onClick={onLeaveRoom}>
        Leave Room
      </div>
    </div>
  );
};

export default Waiting;
