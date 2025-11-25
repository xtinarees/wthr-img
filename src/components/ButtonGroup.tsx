import { ButtonOption, ColorMap } from "../types";
import styles from "./ButtonGroup.module.css";
import cc from "classcat";

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
  };

  return (
    <div className={styles.buttonGroup}>
      {options.map((item, i) => {
        const isActive = activeButtons.includes(item.value);
        return (
          <button
            className={cc([styles.button, { [styles.isActive]: isActive }])}
            key={i}
            onClick={() => handleChange(item.value)}
            style={isActive ? activeStyles : {}}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonGroup;
