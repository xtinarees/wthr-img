import { useState, useEffect } from "react";
import SunCalc from "suncalc";
import {
  getLocation,
  getBackupLocation,
  getWeather,
  latLngString,
  getInitialMoonPhaseValue,
} from "./setup";
import {
  moonPhaseControl,
  temperatureControl,
  timeOptions,
  conditionOptions,
} from "./controlSettings";
import { buildColorMap } from "./utils";
import { WeatherData, LocationResult } from "./types";
import Background from "./components/Background";
import Range from "./components/Range";
import ButtonGroup from "./components/ButtonGroup";
import ToggleButton from "./components/ToggleButton";
import BackgroundControls from "./components/BackgroundControls";
import Moon from "./components/Moon";
import Condition from "./components/Condition";
import ControlsControl from "./components/ControlsControl";

const Body = () => {
  const [isNight, setIsNight] = useState<boolean>(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [rangeMoonPhase, setRangeMoonPhase] = useState<number>(0.5);
  const [, setLocation] = useState<string>("");
  const [, setWeather] = useState<WeatherData | "">("");
  const [temp, setTemp] = useState<number | "">("");
  const [isControlsClosed, setIsControlsClosed] = useState<boolean>(true);

  useEffect(() => {
    function setInitialWeatherState(
      result: GeolocationPosition | { data: LocationResult["data"] },
    ) {
      const date = new Date();
      const dateStamp = Math.floor(date.getTime() / 1000);
      const moonPhase = SunCalc.getMoonIllumination(date).phase;
      setRangeMoonPhase(getInitialMoonPhaseValue(moonPhase));

      const lat =
        "coords" in result ? result.coords.latitude : result?.data.latitude;
      const lng =
        "coords" in result ? result.coords.longitude : result?.data.longitude;
      const loc = latLngString(lat, lng);

      getWeather(loc).then(function (result) {
        const conditions: string[] = [];
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

    const locationPromise = getLocation();
    if (locationPromise) {
      locationPromise.then(setInitialWeatherState).catch(() => {
        getBackupLocation().then(setInitialWeatherState);
      });
    } else {
      getBackupLocation().then(setInitialWeatherState);
    }
  }, []);

  const handleChangeControls = (closed: boolean): void => {
    setIsControlsClosed(closed);
  };

  const handleChangeTemperatureRange = (val: string): void => {
    setTemp(Number(val));
  };

  const handleChangeMoonRange = (val: string): void => {
    setRangeMoonPhase(Number(val));
  };

  const handleChangeTime = (val: boolean): void => {
    setIsNight(val);
  };

  const handleChangeCondition = (selectedCondition: string): void => {
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
    <div className={"content " + contentClasses} style={contentStyle}>
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
};

export default Body;
