import tinycolor from "tinycolor2";
import { getMoonGradientPercentages, toPercentString } from "../utils";
import styles from "./Moon.module.css";

interface MoonProps {
  phase: number;
  color: string;
  isLoading: boolean;
}

const Moon = ({ phase, color, isLoading }: MoonProps) => {
  const phaseNum = parseFloat(phase.toString());
  const isNewMoon = phaseNum === 1 || phaseNum === 0;
  const earthOrMoonGradient =
    phaseNum < 0.25 || phaseNum > 0.75 ? "earth" : "moon";

  const percentages = getMoonGradientPercentages(phaseNum);
  const white = "rgba(255,255,255,1)";
  const transparent = "rgba(255,255,255,0)";
  const getGradient = (gradientColor: string) => {
    return `radial-gradient(circle at ${toPercentString(percentages[0])}, ${gradientColor} ${toPercentString(percentages[1])}, ${transparent} ${toPercentString(percentages[2])})`;
  };
  const colorGradient = getGradient(tinycolor(color).toString());
  const whiteGradient = getGradient(white);

  let moonStyles = {};
  let earthStyles = {};
  if (earthOrMoonGradient === "earth" && isNewMoon) {
    earthStyles = {
      backgroundImage: colorGradient,
      opacity: 1,
    };
    moonStyles = {
      backgroundColor: transparent,
    };
  } else if (earthOrMoonGradient === "earth") {
    earthStyles = {
      backgroundImage: colorGradient,
      opacity: 1,
    };
    moonStyles = {
      backgroundColor: white,
    };
  } else if (earthOrMoonGradient === "moon") {
    earthStyles = {
      backgroundColor: transparent,
      opacity: 0,
    };
    moonStyles = {
      backgroundImage: whiteGradient,
    };
  }

  return (
    <>
      <div
        className={`${styles.moon} ${isLoading ? styles.loading : ""}`}
        style={moonStyles}
      ></div>
      <div className={styles.earth} style={earthStyles}></div>
    </>
  );
};

export default Moon;
