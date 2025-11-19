import React from 'react';

const ButtonGroup = ({ options, activeButtons, handleChange, colors }) => {
  const activeStyles = { 
    background: colors.buttonBackground,
    color: colors.buttonText,
    borderColor: colors.content,
    fontWeight: "bold",
    "&:hover": {
      background: "blue"
    },
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
            style={isActive ? activeStyles : null}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonGroup;
