import React from 'react';
import tinycolor from 'tinycolor2';
import { BackgroundProps } from '../types';

function Background({ color }: BackgroundProps): JSX.Element {
  const styles = { backgroundColor: tinycolor(color).toString() };
  return (
    <div className="background" style={styles}></div>
  );
}

export default Background;