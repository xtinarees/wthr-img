import React from 'react';
import Precipitation from './Precipitation.jsx';
import Clouds from './Clouds.jsx';

const Condition = ({ types, color }) => {
  const precips = types.filter(n => ['snowy', 'rainy'].includes(n));
  const isCloudy = types.includes('cloudy');
  return (
    <div>
      <Clouds isCloudy={isCloudy} />
      <Precipitation types={precips} color={color} />
    </div>
  );
};

export default Condition;
