import { ColorMap, RangeControlSettings } from "../types";
import styles from "./Range.module.css";

interface RangeProps {
  colors: ColorMap;
  range: number | string;
  updateRange: (value: string) => void;
  settings: RangeControlSettings;
  isNight: boolean;
}

const Range = ({
  colors,
  range,
  updateRange,
  settings,
  isNight,
}: RangeProps) => {
  const label = settings.options ? settings.options[range.toString()] : range;
  const unit = "unit" in settings ? settings.unit : "";
  const accentColor = isNight ? colors.dark : colors.darker;

  return (
    <div className={styles.range}>
      <div className={styles.labelWrap}>
        <label className={styles.label} htmlFor={settings.name}>
          {settings.title}
        </label>
        <span className={styles.number}>
          {label}
          {unit}
        </span>
      </div>
      <input
        className={styles.input}
        id="range"
        type="range"
        name={settings.name}
        value={range}
        min={settings.min}
        max={settings.max}
        step={settings.step}
        style={{ accentColor: accentColor }}
        onChange={(e) => updateRange(e.target.value)}
      />
    </div>
  );
};

export default Range;
