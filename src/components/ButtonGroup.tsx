import { ButtonOption, ColorMap } from "../types";

interface ButtonGroupProps {
  options: ButtonOption[];
  handleChange: (value: string) => void;
  activeButtons: string[];
  colors: ColorMap;
}

const ButtonGroup = ({
  options,
  activeButtons,
  handleChange,
  colors,
}: ButtonGroupProps) => {
  const activeStyles = {
    background: colors.buttonBackground,
    color: colors.buttonText,
    borderColor: colors.content,
    fontWeight: "bold" as const,
  };

  return (
    <div className="control button-group">
      {options.map((item, i) => {
        const isActive = activeButtons.includes(item.value);
        return (
          <button
            className="button"
            key={i}
            onClick={() => handleChange(item.value)}
            style={isActive ? activeStyles : undefined}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonGroup;
