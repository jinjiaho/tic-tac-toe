import classnames from "classnames";
import React from "react";
import styles from "../../styles/RoomList.module.css";

interface IRoomListRow {
  text: string;
  onClick: () => void;
}

const RoomListRow: React.FC<IRoomListRow> = ({ text, onClick }) => {
  const [classes, setClasses] = React.useState(classnames([styles.room]));

  const handleMouseEnter = () =>
    setClasses(classnames([styles.room, styles.hover]));

  const handleMouseLeave = () => setClasses(classnames(styles.room));

  return (
    <div
      className={classes}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick()}
    >
      {text}
    </div>
  );
};

export default RoomListRow;
