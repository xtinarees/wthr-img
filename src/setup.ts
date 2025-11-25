import { WeatherData } from "./types";

/*
 * Initial Setup
 */

export const getWeather = async (location: string): Promise<WeatherData> => {
  const units = "&units=imperial";
  const appid = "&APPID=" + import.meta.env.VITE_OPENWEATHERMAP_KEY;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?" +
    location +
    units +
    appid;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch weather data");
  return response.json();
};

export const latLngString = (lat: number, lng: number): string => {
  return "lat=" + lat + "&lon=" + lng;
};

export const getInitialMoonPhaseValue = (moonPhase: number): number => {
  const moonPhasesStatic = [0.5, 0.75, 1, 0, 0.25];
  if (moonPhasesStatic.includes(moonPhase)) {
    return moonPhase;
  }

  if (moonPhase > 0 && moonPhase < 0.25) {
    return 0.125;
  }
  if (moonPhase > 0.25 && moonPhase < 0.5) {
    return 0.375;
  }
  if (moonPhase > 0.5 && moonPhase < 0.75) {
    return 0.625;
  }
  if (moonPhase > 0.75 && moonPhase < 1) {
    return 0.875;
  }

  return 0.5; // fallback
};
