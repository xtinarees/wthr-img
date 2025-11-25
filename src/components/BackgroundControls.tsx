import tinycolor from "tinycolor2";
import styles from "./BackgroundControls.module.css";

/**
 * Manage background styles for controls panel
 * inside of div in order to control opacity independently
 */
const BackgroundControls = ({ color }: { color: string }) => {
  const colorStr = tinycolor(color).toString();
  const gradient = `linear-gradient(to right, rgba(255,0,0,0), ${colorStr}, ${colorStr})`;

  const bgStyle = { backgroundImage: gradient };

  return (
    <div className={styles.wrapper}>
      <div className={styles.desktop} style={bgStyle}></div>
      <div className={styles.mobile} style={{ backgroundColor: color }}></div>
    </div>
  );
};

export default BackgroundControls;
