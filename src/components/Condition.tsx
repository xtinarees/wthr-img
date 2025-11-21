import Precipitation from "./Precipitation.jsx";
import styles from "./Condition.module.css";
/**
 * Could be extended to support other "conditions" such as
 * Cloudy, Lightning, etc.
 */
const Condition = ({ types, color }: { types: string[]; color: string }) => {
  const precips = types.filter((n: string) => ["snowy", "rainy"].includes(n));
  return (
    <div className={styles["content"]}>
      <Precipitation types={precips} color={color} />
    </div>
  );
};

export default Condition;
