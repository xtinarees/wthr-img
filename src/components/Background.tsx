
import tinycolor from "tinycolor2";
import styles from "./Background.module.css";

const Background = ({ color }: { color: string }) => {
  const style = { backgroundColor: tinycolor(color).toString() };
  return <div className={styles.background} style={style}></div>;
};

export default Background;
