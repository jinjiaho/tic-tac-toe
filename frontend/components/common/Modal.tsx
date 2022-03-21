import React from "react";
import styles from "../../styles/Modal.module.css";

interface IModal {
  title: string;
  content?: React.ReactNode;
  onClose: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  primaryActionText?: string;
  secondaryActionText?: string;
}

const Modal: React.FC<IModal> = ({
  title,
  content,
  onClose,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionText,
  secondaryActionText,
}) => {
  return (
    <div className={styles.background} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.close} onClick={onClose}>
            X
          </div>
        </div>
        {content && <div className={styles.body}>{content}</div>}
        <div className={styles.footer}>
          {secondaryActionText && (
            <button
              className={styles.secondaryAction}
              onClick={onSecondaryAction}
            >
              {secondaryActionText}
            </button>
          )}
          {primaryActionText && (
            <button className={styles.primaryAction} onClick={onPrimaryAction}>
              {primaryActionText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
