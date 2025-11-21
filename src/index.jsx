import React from "react";
import { useState, useEffect } from "react";
import SunCalc from "suncalc";
import {
  getLocation,
  getBackupLocation,
  getWeather,
  latLngString,
  getInitialMoonPhaseValue,
} from "./setup";
import { buildColorMap } from "./utils";
import Background from "./components/Background";
import Range from "./components/Range";
import ButtonGroup from "./components/ButtonGroup";
import ToggleButton from "./components/ToggleButton";
import BackgroundControls from "./components/BackgroundControls";
import Moon from "./components/Moon";
import Condition from "./components/Condition";
import ControlsControl from "./components/ControlsControl";
import styles from "./index.module.css";

/*
 * Set Global Constants
 */
const moonPhaseControl = {
  title: "Moon Phase",
  name: "moonRange",
  min: "0",
  max: "1",
  step: "0.125",
  options: {
    0.5: "Full",
    0.625: "Waning Gibbus",
    0.75: "Third Quarter",
    0.875: "Waning Crescent",
    1: "New",
    0: "New",
    0.125: "Waxing Crescent",
    0.25: "First Quarter",
    0.375: "Waxing Gibbus",
  },
};

const temperatureControl = {
  title: "Temperature",
  name: "temperatureRange",
  min: "20",
  max: "100",
  step: "1",
  unit: String.fromCharCode(176) + "F",
};

const timeOptions = [
  { value: false, label: "Day", slug: "day" },
  { value: true, label: "Night", slug: "night" },
];

const conditionOptions = [
  { value: "rainy", label: "Rain" },
  { value: "snowy", label: "Snow" },
];

function Body() {
  const [isNight, setIsNight] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [rangeMoonPhase, setRangeMoonPhase] = useState(0.5);
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState("");
  const [temp, setTemp] = useState("");
  const [isControlsClosed, setIsControlsClosed] = useState(true);

  useEffect(() => {
    function setInitialWeatherState(result) {
      let date = new Date();
      let dateStamp = Math.floor(date.getTime() / 1000);
      let moonPhase = SunCalc.getMoonIllumination(date).phase;
      setRangeMoonPhase(getInitialMoonPhaseValue(moonPhase));
      const lat =
        "coords" in result ? result.coords.latitude : result.data.latitude;
      const lng =
        "coords" in result ? result.coords.longitude : result.data.longitude;
      const loc = latLngString(lat, lng);
      getWeather(loc).then(function (result) {
        let conditions = [];
        let night = true;
        if ("rain" in result.data) {
          conditions.push("rainy");
        }
        if ("snow" in result.data) {
          conditions.push("snowy");
        }
        if (
          result.data.sys.sunrise < dateStamp &&
          result.data.sys.sunset > dateStamp
        ) {
          night = false;
        }
        setLocation(loc);
        setWeather(result.data);
        setTemp(result.data.main.temp);
        setSelectedConditions(conditions);
        setIsNight(night);
      });
    }
    getLocation()
      .then(setInitialWeatherState)
      .catch(() => {
        getBackupLocation().then(setInitialWeatherState);
      });
  }, []);

  const handleChangeControls = (closed) => {
    setIsControlsClosed(closed);
  };
  const handleChangeTemperatureRange = (val) => {
    setTemp(val);
  };
  const handleChangeMoonRange = (val) => {
    setRangeMoonPhase(val);
  };
  const handleChangeTime = (val) => {
    setIsNight(val);
  };

  const handleChangeCondition = (selectedCondition) => {
    setSelectedConditions((prev) => {
      if (prev.includes(selectedCondition)) {
        return prev.filter((item) => item !== selectedCondition);
      } else {
        return [...prev, selectedCondition];
      }
    });
  };

  const colors = buildColorMap({ temp, isNight });
  const controlsStyle = isControlsClosed
    ? { display: "none" }
    : { display: "block" };

  const contentStyle = { color: colors.content };
  let contentClasses = isControlsClosed
    ? "is-closed-controls"
    : "is-open-controls";
  contentClasses += colors.isDark ? " is-dark-color" : " is-light-color";
  contentClasses += temp === "" ? " is-loading" : "";

  return (
    <div className={styles.content + " " + contentClasses} style={contentStyle}>
      <Background color={colors.main} />
      <BackgroundControls color={colors.main} />
      <div className="controls">
        <div className="controls__inner">
          <ControlsControl
            handleChange={handleChangeControls}
            isClosed={isControlsClosed}
          />
          <div className="controls__content" style={controlsStyle}>
            <p className="control control--info">
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
        </div>
      </div>
      <Moon phase={rangeMoonPhase} color={colors.main} />
      <Condition types={selectedConditions} color={colors.main} />
    </div>
  );
}

export default Body;
