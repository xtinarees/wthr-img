import React from 'react';
import IconCirclePlus from './IconCirclePlus.jsx';
import IconCircleMinus from './IconCircleMinus.jsx';

const ControlsIcon = ({ isClosed }) => {
  return isClosed ? <IconCirclePlus /> : <IconCircleMinus />;
};

export default ControlsIcon;
