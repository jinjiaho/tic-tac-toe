import React from "react";
import classnames from "classnames";
import styles from "../styles/GridCell.module.css";

interface IGridCell {
  index: number;
  content: string;
  lastMove: boolean;
  clickable: boolean;
  playerSymbol: string;
  onClick: (index: number) => void;
}

const GridCell: React.FC<IGridCell> = ({
  clickable,
  index,
  content,
  lastMove,
  playerSymbol,
  onClick,
}) => {
  const [classes, setClasses] = React.useState<string[]>([styles.container]);
  const [hover, setHover] = React.useState(false);

  const addClass = (classname: string) => {
    if (!classes.includes(classname)) {
      setClasses([...classes, classname]);
    }
  };

  const removeClass = (classname: string) => {
    if (classes.includes(classname)) {
      setClasses(classes.filter((x) => x !== classname));
    }
  };

  const handleClick = () => {
    onClick(index);
  };

  React.useEffect(() => {
    if (lastMove) {
      addClass(styles.last);
    } else {
      removeClass(styles.last);
    }
  }, [lastMove]);

  React.useEffect(() => {
    // Sometimes hover doesn't get removed
    setHover(false);
  }, [content]);

  React.useEffect(() => {
    if (hover) {
      addClass(styles.hover);
    } else {
      removeClass(styles.hover);
    }
  }, [hover]);

  return (
    <div
      className={classnames(classes)}
      onMouseEnter={clickable ? () => setHover(true) : undefined}
      onMouseLeave={clickable ? () => setHover(false) : undefined}
      onClick={clickable ? () => handleClick() : undefined}
    >
      {hover ? playerSymbol : content}
    </div>
  );
};

export default GridCell;
