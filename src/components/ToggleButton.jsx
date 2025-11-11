import React from 'react';

const ToggleButton = ({ options, isActive, handleChange }) => {
  return (
    <div className="control toggle-button">
      {options.map(item => {
        const activeClass = isActive === item.value ? 'is-active' : '';
        const classNames = `${activeClass} button`;
        return (
          <button className={classNames} key={item.slug} onClick={() => handleChange(item.value)}>{item.label}</button>
        );
      })}
    </div>
  );
};

export default ToggleButton;
