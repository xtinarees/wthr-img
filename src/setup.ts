import axios, { AxiosResponse } from 'axios';
import { WeatherData, LocationResult } from './types';

/*
 * Initial Setup
 */
export const getLocation = (): Promise<GeolocationPosition> | false => {
  if ("geolocation" in navigator) {
    return new Promise<GeolocationPosition>(
      (resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject)
    );
  } else {
    // geolocation is not supported
    // get your location some other way
    console.log('geolocation is not enabled on this browser');
    return false;
  }
};

export const getBackupLocation = (): Promise<AxiosResponse<LocationResult['data']>> => {
  return axios.get("https://ipapi.co/json/");
};

export const getWeather = (location: string): Promise<AxiosResponse<WeatherData>> => {
  const units = "&units=imperial";
  const appid = "&APPID=" + import.meta.env.VITE_OPENWEATHERMAP_KEY;
  
  return axios.get("https://api.openweathermap.org/data/2.5/weather?" + location + units + appid);
};

export const latLngString = (lat: number, lng: number): string => {
  return 'lat=' + lat + '&lon=' + lng;
};

export const getInitialMoonPhaseValue = (moonPhase: number): number => {
  const moonPhasesStatic = [0.5, 0.75, 1, 0, 0.25];
  if (moonPhasesStatic.includes(moonPhase)) { 
    return moonPhase; 
  }

  if (moonPhase > 0 && moonPhase < 0.25) { return 0.125; }
  if (moonPhase > 0.25 && moonPhase < 0.5) { return 0.375; }
  if (moonPhase > 0.5 && moonPhase < 0.75) { return 0.625; }
  if (moonPhase > 0.75 && moonPhase < 1) { return 0.875; }
  
  return 0.5; // fallback
};