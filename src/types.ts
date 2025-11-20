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
  coords?: {
    latitude: number;
    longitude: number;
  };
  data?: {
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

export interface RangeControlSettings {
  title: string;
  name: string;
  min: string;
  max: string;
  step: string;
  unit?: string;
  options?: Record<string, string>;
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

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

// Component Props Types
export interface BackgroundProps {
  color: string;
}

export interface BackgroundControlsProps {
  color: string;
}

export interface RangeProps {
  colors: ColorMap;
  range: number | string;
  updateRange: (value: string) => void;
  settings: RangeControlSettings;
  isNight: boolean;
}

export interface ButtonGroupProps {
  options: ButtonOption[];
  handleChange: (value: string) => void;
  activeButtons: string[];
  colors: ColorMap;
}

export interface ToggleButtonProps {
  isActive: boolean;
  handleChange: (value: boolean) => void;
  options: ToggleOption[];
  colors: ColorMap;
}

export interface ControlsControlProps {
  handleChange: (isClosed: boolean) => void;
  isClosed: boolean;
}

export interface ControlsIconProps {
  isClosed: boolean;
}

export interface MoonProps {
  phase: number;
  color: string;
  humidity?: number;
}

export interface ConditionProps {
  types: string[];
  color: string;
}

export interface PrecipitationProps {
  types: string[];
  color: string;
}

export interface PrecipitationItemProps {
  types: string[];
  precipType: string;
  color: string;
}

export interface CloudsProps {
  types: string[];
  color: string;
}

export interface NightProps {
  isNight: boolean;
  color: string;
}
