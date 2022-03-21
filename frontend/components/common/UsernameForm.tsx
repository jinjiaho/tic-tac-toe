import React from "react";
import styles from "../../styles/Form.module.css";
import { validateUsername } from "../../utils";

interface IUsernameForm {
  error?: string;
  submitText: string;
  onSubmit: (username: string) => void;
}

const UsernameForm: React.FC<IUsernameForm> = ({
  error,
  submitText,
  onSubmit,
}) => {
  const [val, setVal] = React.useState("");
  const [err, setErr] = React.useState("");

  const handleInput = (e: any) => {
    setErr("");
    setVal(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const error = validateUsername(val);
    console.log("Validate username result", error);
    if (error) {
      setErr(error);
    } else {
      onSubmit(val);
    }
  };

  return (
    <form className={styles.form}>
      <input
        type="text"
        pattern="[a-zA-Z0-9]{3,15}"
        className={styles.input}
        value={val}
        onChange={handleInput}
        placeholder="Enter a username"
        tabIndex={0}
        autoFocus
      />
      <span className={styles.error}>{err || error}</span>
      <button
        className={styles.button}
        onClick={handleSubmit}
        tabIndex={1}
        type="submit"
      >
        {submitText}
      </button>
    </form>
  );
};

export default UsernameForm;
