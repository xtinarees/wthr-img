import React from 'react';
import tinycolor from 'tinycolor2'

function Night({ isNight, color }) {
  let styles = {
    backgroundColor: tinycolor(color).darken(50).saturate(20)
  };
  if (!isNight) { styles = { display: 'none' }; }
  return (
    <div className="night" style={styles}></div>
  )
}

export default Night;