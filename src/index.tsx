import { useState, useEffect } from "react";
import SunCalc from "suncalc";
import { getWeather, latLngString, getInitialMoonPhaseValue } from "./setup";
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
  const [isLocationError, setIsLocationError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function setInitialWeatherState(
      result: GeolocationPosition | LocationResult,
    ) {
      setIsLoading(false);

      const date = new Date();
      const dateStamp = Math.floor(date.getTime() / 1000);
      const moonPhase = SunCalc.getMoonIllumination(date).phase;
      setRangeMoonPhase(getInitialMoonPhaseValue(moonPhase));

      const lat =
        "coords" in result ? result?.coords.latitude : result?.latitude;
      const lng =
        "coords" in result ? result?.coords.longitude : result?.longitude;
      const loc = latLngString(lat, lng);

      await getWeather(loc).then(function (result) {
        const conditions: string[] = [];
        let night = true;

        if ("rain" in result) {
          conditions.push("rainy");
        }
        if ("snow" in result) {
          conditions.push("snowy");
        }
        if (result.sys.sunrise < dateStamp && result.sys.sunset > dateStamp) {
          night = false;
        }

        setLocation(loc);
        setWeather(result);
        setTemp(result.main.temp);
        setSelectedConditions(conditions);
        setIsNight(night);
      });
    }

    const getBackupLocation = async (): Promise<LocationResult> => {
      const response = await fetch("https://ipapi.co/json/");
      return response.json();
    };

    const handleError = (error: any) => {
      console.error(error);
      setIsLocationError(true);
      setIsLoading(false);
    };

    const geolocationErrorCallback = (error: GeolocationPositionError) => {
      if (error.code == error.PERMISSION_DENIED) {
        // User denied permission
        // Implement fallback here
        console.error(
          "User denied the request for Geolocation. Using fallback.",
        );
        getBackupLocation()
          .then(setInitialWeatherState)
          .catch((error) => {
            handleError(error);
          });
      } else {
        // Handle other errors like TIMEOUT or POSITION_UNAVAILABLE
        console.error("Geolocation error: " + error.message);
        getBackupLocation()
          .then(setInitialWeatherState)
          .catch((error) => {
            handleError(error);
          });
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        setInitialWeatherState,
        geolocationErrorCallback,
      );
    } else {
      // geolocation is not supported
      // get your location some other way
      handleError("Geolocation is not enabled on this browser");
    }
  }, []);

  const handleChangeControls = (closed: boolean): void => {
    setIsControlsClosed(closed);
  };

  const handleChangeTemperatureRange = (val: number): void => {
    setTemp(Number(val));
    setIsLocationError(false);
    setIsLoading(false);
  };

  const handleChangeMoonRange = (val: number): void => {
    setRangeMoonPhase(Number(val));
    setIsLocationError(false);
    setIsLoading(false);
  };

  const handleChangeTime = (val: boolean): void => {
    setIsNight(val);
    setIsLocationError(false);
    setIsLoading(false);
  };

  const handleChangeCondition = (selectedCondition: string): void => {
    setSelectedConditions((prev) => {
      setIsLocationError(false);
      setIsLoading(false);
      if (prev.includes(selectedCondition)) {
        return prev.filter((item) => item !== selectedCondition);
      } else {
        return [...prev, selectedCondition];
      }
    });
  };

  const colors = buildColorMap({ temp, isNight });
  const contentStyle = { color: colors.content };

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
      {isLoading && (
        <div className={styles.allowText}>
          Loading... Please allow location access to fetch your local weather
          data.
        </div>
      )}
      {isLocationError && (
        <div className={styles.errorText}>
          Unable to determine your location. Please check your internet
          connection or browser location permissions. Or, you can adjust the
          controls under the settings menu on this page to generate an image
          without location-based weather data.
        </div>
      )}
    </div>
  );
};

export default Body;
