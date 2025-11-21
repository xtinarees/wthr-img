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
import { WeatherData, LocationResult } from "./types";
import Background from "./components/Background";
import BackgroundControls from "./components/BackgroundControls";
import Moon from "./components/Moon";
import Condition from "./components/Condition";
import ControlPanel from "./components/ControlPanel";

import styles from "./index.module.css";

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
  const contentStyle = { color: colors.content };
  const isLoading = Boolean(temp === "");

  return (
    <div className={styles.content} style={contentStyle}>
      <Background color={colors.main} />
      {!isControlsClosed && <BackgroundControls color={colors.main} />}
      <ControlPanel
        handleChangeControls={handleChangeControls}
        handleChangeTemperatureRange={handleChangeTemperatureRange}
        handleChangeMoonRange={handleChangeMoonRange}
        handleChangeCondition={handleChangeCondition}
        isControlsClosed={isControlsClosed}
        colors={colors}
        temp={temp}
        rangeMoonPhase={rangeMoonPhase}
        selectedConditions={selectedConditions}
        isNight={isNight}
        handleChangeTime={handleChangeTime}
      />
      <Moon phase={rangeMoonPhase} color={colors.main} isLoading={isLoading} />
      <Condition types={selectedConditions} color={colors.main} />
    </div>
  );
};

export default Body;
