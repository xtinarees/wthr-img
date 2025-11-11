import React from 'react';
import tinycolor from 'tinycolor2';
import { getMoonGradientPercentages, toPercentString } from '../utils.jsx';

const Moon = ({ phase, color, humidity }) => {
  let hum = (humidity - 25) / 6.5;
  hum = hum < 0 ? 0 : hum;
  const phaseNum = parseFloat(phase);
  const earthOrMoonGradient = phaseNum < 0.25 || phaseNum > 0.75 ? 'earth' : 'moon';
  const earthBackgroundCSS = earthOrMoonGradient === 'earth' ? 'backgroundImage' : 'backgroundColor';
  const moonBackgroundCSS = earthOrMoonGradient === 'moon' ? 'backgroundImage' : 'backgroundColor';
  const percentages = getMoonGradientPercentages(phaseNum);
  const white = 'rgba(255,255,255,1)';
  const transparent = 'rgba(255,255,255,0)';
  const colorStr = earthOrMoonGradient === 'earth' ? tinycolor(color).toString() : white;
  const gradient = `radial-gradient(circle at ${toPercentString(percentages[0])}, ${colorStr} ${toPercentString(percentages[1])}, ${transparent} ${toPercentString(percentages[2])})`;
  let moonStyles = {};
  moonStyles[moonBackgroundCSS] = earthOrMoonGradient === 'moon' ? gradient : white;
  let earthStyles = {};
  earthStyles[earthBackgroundCSS] = earthOrMoonGradient === 'earth' ? gradient : 'none';
  earthStyles['display'] = earthOrMoonGradient === 'earth' ? 'block' : 'none';
  const wrapperStyles = { filter: `blur(${hum}px)` };
  return (
    <div className="moon-earth-wrapper" style={wrapperStyles}>
      <div className="moon" style={moonStyles}></div>
      <div className="earth" style={earthStyles}></div>
    </div>
  );
};

export default Moon;
