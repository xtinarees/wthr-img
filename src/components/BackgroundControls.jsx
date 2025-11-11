import React from 'react';
import tinycolor from 'tinycolor2';

const BackgroundControls = ({ color }) => {
  const colorStr = tinycolor(color).toString();
  const gradient = `linear-gradient(to right, rgba(255,0,0,0), ${colorStr})`;
  const stylesDesktop = { backgroundImage: gradient };
  const stylesMobile = { backgroundColor: colorStr };

  return (
    <div className="controls__background">
      <div className="controls__background-inner controls__background--mobile" style={stylesMobile}></div>
      <div className="controls__background-inner controls__background--desktop" style={stylesDesktop}></div>
    </div>
  );
};

export default BackgroundControls;
