import tinycolor from "tinycolor2";
import { ColorMap } from "./types";

export const arraysMatch = (array1: string[], array2: string[]): boolean => {
  return array1.sort().join(",") === array2.sort().join(",");
};

export const toPercentString = (num: number): string => {
  return num.toString() + "%";
};

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

export const isEven = (num: number): boolean => {
  return num % 2 === 0;
};

export const getMoonGradientPercentages = (
  phase: number,
): [number, number, number] => {
  let percent0 = 0;
  let percent1 = 0;
  let percent2 = 0;

  if (phase >= 0.25 && phase <= 0.5) {
    percent0 = 50 + (50 - phase * 100) * 2;
    percent1 = 0;
    percent2 = 100;
  } else if (phase > 0.5 && phase <= 0.75) {
    percent0 = 50 - (phase * 100 - 50) * 2;
    percent1 = 0;
    percent2 = 100;
  } else if (phase < 0.25) {
    percent0 = 0;
    percent1 = (25 - phase * 100) * 4;
    percent2 = 100;
  } else if (phase > 0.75) {
    percent0 = 100;
    percent1 = (phase * 100 - 75) * 4;
    percent2 = 100;
  }

  return [percent0, percent1, percent2];
};

/*
 * Magenta: rgb(255, 0, 255) _________ 100, Section 0
 * B -
 * Red: rgb(255, 0, 0) _______________ 85, Section 1
 * G +
 * Yellow: rgb(255, 255, 0) __________ 70, Section 2
 * R -
 * Green: rgb(0, 255, 0) _____________ 55, Section 3
 * B +
 * Turquoise: rgb(0, 255, 255) _______ 40, Section 4
 * G -
 * Blue/Indigo: rgb(0, 0, 255) _______ 25, Section 5
 * R +
 */
type colorMapOptions = "r" | "g" | "b";
export const getColorByTemp = (temp: number): tinycolor.Instance => {
  // split temp in 15 increments
  const tempSpan = 15;
  // hottest color = magenta
  let color = {
    r: 255,
    g: 0,
    b: 255,
  };

  const colorMap: colorMapOptions[] = ["b", "g", "r", "b", "g"];
  const colorSection = Math.ceil((100 - temp) / tempSpan);

  for (let i = 1; i <= colorSection; i++) {
    // if super cold, less than 100 - (tempSpan * 5)
    if (colorSection > 5) {
      color = { r: 0, g: 0, b: 255 };
      break;
    }

    // alternate between adding and subtracting RGB values
    const isAdd = isEven(i);

    // element that is getting changed
    const RGorB = colorMap[i - 1];

    // check if this is the last loop
    const isLast = i === colorSection;
    const remainder = (100 - temp) % tempSpan;
    const num = isLast && remainder !== 0 ? (255 * remainder) / tempSpan : 255;

    // if even, add to element
    // if odd, subtract
    if (isAdd) {
      color[RGorB] = color[RGorB] + num;
    } else {
      color[RGorB] = color[RGorB] - num;
    }
  }

  return tinycolor(color).desaturate(80);
};

export const getColor = (
  temp: number,
  isNight: boolean,
): tinycolor.Instance => {
  const baseColor = getColorByTemp(temp);
  return isNight ? tinycolor(baseColor).darken(20) : baseColor;
};

export const buildColorMap = ({
  temp,
  isNight,
}: {
  temp: number | string;
  isNight: boolean;
}): ColorMap => {
  const rootColor = temp
    ? getColor(Number(temp), isNight)
    : tinycolor("#d3d3d3");
  const lightColor = tinycolor(rootColor).clone().lighten(15).toString();
  const lighterColor = tinycolor(rootColor).clone().lighten(40).toString();
  const lightestColor = tinycolor(rootColor).clone().lighten(60).toString();
  const darkColor = tinycolor(rootColor).clone().darken(15).toString();
  const darkerColor = tinycolor(rootColor).clone().darken(30).toString();
  const darkestColor = tinycolor(rootColor).clone().darken(60).toString();
  const isRootColorDark = tinycolor(rootColor).isDark();
  const contentColor = isRootColorDark ? lighterColor : darkerColor;
  const contentTextColor = isRootColorDark ? lightestColor : darkestColor;
  const buttonTextColor = isRootColorDark ? darkColor : lighterColor;
  const gradient = isRootColorDark
    ? `linear-gradient(45deg, ${lightColor}, ${lighterColor})`
    : `linear-gradient(45deg, ${darkColor}, ${darkerColor})`;

  return {
    main: rootColor.toString(),
    light: lightColor,
    lighter: lighterColor,
    lightest: lightestColor,
    dark: darkColor,
    darker: darkerColor,
    darkest: darkestColor,
    content: contentColor,
    contentText: contentTextColor,
    buttonText: buttonTextColor,
    buttonBackground: gradient,
    isDark: isRootColorDark,
  };
};
