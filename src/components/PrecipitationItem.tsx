import { useMemo } from "react";
import { getRandomInt } from "../utils";
import { ConditionValues } from "../types";

interface PrecipitationItemProps {
  types: string[];
  precipType: ConditionValues;
  color: string;
}

const PrecipitationItem = ({
  types,
  precipType,
  color,
}: PrecipitationItemProps) => {
  // Memoize the drops so they don't change on every render unless types/precipType changes
  const drops = useMemo(() => {
    return Array(50)
      .fill(1)
      .map((_, i) => {
        const sizeCSS = getRandomInt(2, 20) + "px";
        const topCSS = getRandomInt(0, 100) + "vh";
        const leftCSS = getRandomInt(0, 100) + "vw";
        const styles = {
          width: `clamp(0px, ${sizeCSS}, 3vw)`,
          height: `clamp(0px, ${sizeCSS}, 3vw)`,
          top: topCSS,
          left: leftCSS,
          backgroundColor: precipType === "rainy" ? color : "white",
        };
        return <div className={precipType} style={styles} key={i}></div>;
      });
  }, [types, precipType]);

  return <>{drops}</>;
};

export default PrecipitationItem;
