import { ToggleOption, ColorMap } from "../types";

interface ToggleButtonProps {
  isActive: boolean;
  handleChange: (value: boolean) => void;
  options: ToggleOption[];
  colors: ColorMap;
}
const ToggleButton = ({
  options,
  isActive,
  handleChange,
  colors,
}: ToggleButtonProps) => {
  const activeStyles = {
    background: colors.buttonBackground,
    color: colors.buttonText,
    borderColor: colors.content,
    fontWeight: "bold",
  };
  return (
    <div className="toggle-buttons">
      {options.map((item) => {
        return (
          <button
            className="toggle-button"
            key={item.slug}
            onClick={() => handleChange(item.value)}
            style={isActive === item.value ? activeStyles : {}}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default ToggleButton;
