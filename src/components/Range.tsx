import { ColorMap, RangeControlSettings } from "../types";

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
    <div className="control">
      <div className="range__label-wrap">
        <label className="range__label" htmlFor={settings.name}>
          {settings.title}
        </label>
        <span className="range__number">
          {label}
          {unit}
        </span>
      </div>
      <input
        className="range__input"
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
