export type ConditionValues = "rainy" | "snowy";

export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  clouds?: {
    all: number;
  };
  rain?: any;
  snow?: any;
}

export interface LocationResult {
  coords: {
    latitude: number;
    longitude: number;
  };
  data: {
    latitude: number;
    longitude: number;
  };
}

export interface ColorMap {
  main: string;
  light: string;
  lighter: string;
  lightest: string;
  dark: string;
  darker: string;
  darkestColor: string;
  content: string;
  contentText: string;
  buttonText: string;
  buttonBackground: string;
  isDark: boolean;
}

export interface ButtonOption {
  value: string;
  label: string;
}

export interface ToggleOption {
  value: boolean;
  label: string;
  slug: string;
}

export interface RangeControlSettings {
  title: string;
  name: string;
  min: string;
  max: string;
  step: string;
  unit?: string;
  options?: Record<string, string>;
}
