import type { NextPage } from "next";
import App from "../components/App";
import styles from "../styles/App.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.responsiveContainer}>
      <App />
    </div>
  );
};

export default Home;
