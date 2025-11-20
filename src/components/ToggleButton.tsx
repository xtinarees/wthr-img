import React from "react";
import tinycolor from "tinycolor2";

const ToggleButton = ({ options, isActive, handleChange, colors }) => {
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
            style={isActive === item.value ? activeStyles : null}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default ToggleButton;
