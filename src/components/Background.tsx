import tinycolor from "tinycolor2";
import styles from "./Background.module.css";

const Background = ({ color }: { color: string }) => {
  // const style = { backgroundColor: tinycolor(color).toString() };
  const gradient = `linear-gradient(to right, ${tinycolor(color).spin(10).toString()}, ${tinycolor(color).toString()})`;
  const style = { background: gradient };

  return <div className={styles.background} style={style}></div>;
};

export default Background;
