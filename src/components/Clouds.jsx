import React from 'react';

const Clouds = ({ isCloudy }) => {
  if (isCloudy) return <div className="clouds"></div>;
  return null;
};

export default Clouds;
