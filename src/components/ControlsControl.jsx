import React from 'react';
import ControlsIcon from './ControlsIcon.jsx';

const ControlsControl = ({ handleChange, isClosed }) => (
  <button className="controls__control" onClick={() => handleChange(!isClosed)}>
    <ControlsIcon isClosed={isClosed} />
    <span className="controls__text">Controls</span>
  </button>
);

export default ControlsControl;
