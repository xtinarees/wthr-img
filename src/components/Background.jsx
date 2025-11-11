import React from 'react';
import tinycolor from 'tinycolor2'

function Background({ color }) {
  const styles = { backgroundColor: tinycolor(color).toString() };
  return (
    <div className="background" style={styles}></div>
  )
}

export default Background;