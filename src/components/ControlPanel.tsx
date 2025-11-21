import Range from "./Range";
import ButtonGroup from "./ButtonGroup";
import ToggleButton from "./ToggleButton";
import ControlsControl from "./ControlsHeader";
import {
  temperatureControl,
  moonPhaseControl,
  conditionOptions,
  timeOptions,
} from "../controlSettings";
import styles from "./ControlPanel.module.css";

interface ControlPanelProps {
  handleChangeControls: (isClosed: boolean) => void;
  isControlsClosed: boolean;
  controlsStyle: React.CSSProperties;
  colors: { [key: string]: string };
  temp: number | "";
  handleChangeTemperatureRange: (value: number) => void;
  rangeMoonPhase: number;
  handleChangeMoonRange: (value: number) => void;
  selectedConditions: string[];
  handleChangeCondition: (value: string) => void;
  isNight: boolean;
  handleChangeTime: (value: boolean) => void;
}

const ControlPanel = ({
  handleChangeControls,
  isControlsClosed,
  colors,
  temp,
  handleChangeTemperatureRange,
  rangeMoonPhase,
  handleChangeMoonRange,
  selectedConditions,
  handleChangeCondition,
  isNight,
  handleChangeTime,
}: ControlPanelProps) => {
  return (
    <div className={styles.controls}>
      <div className={styles.inner}>
        <ControlsControl
          handleChange={handleChangeControls}
          isClosed={isControlsClosed}
        />
        {!isControlsClosed && (
          <div className={styles.content}>
            <p className={styles.info}>
              Initial results are based on your current weather and conditions.
              Change the settings below to create a new image.
            </p>
            <Range
              colors={colors}
              range={temp}
              updateRange={handleChangeTemperatureRange}
              settings={temperatureControl}
              isNight={isNight}
            />
            <Range
              colors={colors}
              range={rangeMoonPhase}
              updateRange={handleChangeMoonRange}
              settings={moonPhaseControl}
              isNight={isNight}
            />
            <ButtonGroup
              options={conditionOptions}
              handleChange={handleChangeCondition}
              activeButtons={selectedConditions}
              colors={colors}
            />
            <ToggleButton
              isActive={isNight}
              handleChange={handleChangeTime}
              options={timeOptions}
              colors={colors}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
