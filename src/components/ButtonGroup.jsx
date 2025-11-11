import React from 'react';

const ButtonGroup = ({ options, activeButtons, handleChange }) => {
  return (
    <div className="control button-group">
      {options.map((item, i) => {
        const activeClass = activeButtons.includes(item.value) ? 'is-active' : '';
        const classNames = `${activeClass} button`;
        return (
          <button className={classNames} key={i} onClick={() => handleChange(item.value)}>
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default ButtonGroup;
