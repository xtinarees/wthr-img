import {
  ButtonOption,
  ToggleOption,
  RangeControlSettings,
  ConditionValues,
} from "./types";

export const moonPhaseControl: RangeControlSettings = {
  title: "Moon Phase",
  name: "moonRange",
  min: "0",
  max: "1",
  step: "0.125",
  options: {
    "0.5": "Full",
    "0.625": "Waning Gibbus",
    "0.75": "Third Quarter",
    "0.875": "Waning Crescent",
    "1": "New",
    "0": "New",
    "0.125": "Waxing Crescent",
    "0.25": "First Quarter",
    "0.375": "Waxing Gibbus",
  },
};

export const temperatureControl: RangeControlSettings = {
  title: "Temperature",
  name: "temperatureRange",
  min: "20",
  max: "100",
  step: "1",
  unit: String.fromCharCode(176) + "F",
};

interface TimeToggleOption extends ToggleOption {
  slug: "day" | "night";
}

export const timeOptions: TimeToggleOption[] = [
  { value: false, label: "Day", slug: "day" },
  { value: true, label: "Night", slug: "night" },
];

interface ConditionButtonOption extends ButtonOption {
  value: ConditionValues;
}

export const conditionOptions: ConditionButtonOption[] = [
  { value: "rainy", label: "Rain" },
  { value: "snowy", label: "Snow" },
];
