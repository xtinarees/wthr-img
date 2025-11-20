import React from 'react';
import tinycolor from 'tinycolor2';
import { getMoonGradientPercentages, toPercentString } from '../utils';
import { MoonProps } from '../types';

const Moon = ({ phase, color }: MoonProps): JSX.Element => {
  const phaseNum = parseFloat(phase.toString());
  const earthOrMoonGradient = phaseNum < 0.25 || phaseNum > 0.75 ? 'earth' : 'moon';
  const earthBackgroundCSS = earthOrMoonGradient === 'earth' ? 'backgroundImage' : 'backgroundColor';
  const moonBackgroundCSS = earthOrMoonGradient === 'moon' ? 'backgroundImage' : 'backgroundColor';
  const percentages = getMoonGradientPercentages(phaseNum);
  const white = 'rgba(255,255,255,1)';
  const transparent = 'rgba(255,255,255,0)';
  const colorStr = earthOrMoonGradient === 'earth' ? tinycolor(color).toString() : white;
  const gradient = `radial-gradient(circle at ${toPercentString(percentages[0])}, ${colorStr} ${toPercentString(percentages[1])}, ${transparent} ${toPercentString(percentages[2])})`;
  
  const moonStyles: React.CSSProperties = {};
  (moonStyles as any)[moonBackgroundCSS] = earthOrMoonGradient === 'moon' ? gradient : white;
  
  const earthStyles: React.CSSProperties = {};
  (earthStyles as any)[earthBackgroundCSS] = earthOrMoonGradient === 'earth' ? gradient : 'none';
  (earthStyles as any)['display'] = earthOrMoonGradient === 'earth' ? 'block' : 'none';
  
  return (
    <div className="moon-earth-wrapper" >
      <div className="moon" style={moonStyles}></div>
      <div className="earth" style={earthStyles}></div>
    </div>
  );
};

export default Moon;