import { ButtonOption, ColorMap } from "../types";
import styles from "./ButtonGroup.module.css";

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
    <div className={styles.buttonGroup}>
      {options.map((item, i) => {
        const isActive = activeButtons.includes(item.value);
        return (
          <button
            className={styles.button}
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
