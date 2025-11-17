import React from 'react';
import Precipitation from './Precipitation.jsx';

const Condition = ({ types, color }) => {
  const precips = types.filter(n => ['snowy', 'rainy'].includes(n));
  return (
    <div>
      <Precipitation types={precips} color={color} />
    </div>
  );
};

export default Condition;
