import React, { useMemo } from 'react';
import tinycolor from 'tinycolor2';
import { getRandomInt } from '../utils';


function PrecipitationItem({ types, precipType }) {
  // Memoize the drops so they don't change on every render unless types/precipType changes
  const drops = useMemo(() => {
    return Array(50).fill(1).map((el, i) => {
      const sizeCSS = getRandomInt(2, 20) + 'px';
      const topCSS = getRandomInt(0, 100) + 'vh';
      const leftCSS = getRandomInt(0, 100) + 'vw';
      const styles = {
        width: sizeCSS,
        height: sizeCSS,
        top: topCSS,
        left: leftCSS,
      };
      return <div className={precipType} style={styles} key={i}></div>;
    });
  }, [types, precipType]);

  return <>{drops}</>;
}

function Precipitation({ types, color }) {
  const backgroundColor = tinycolor(color).lighten(10).spin(5);
  const css = `
    .precipitation .rainy {
      background-color: ${backgroundColor};
    }`;

  return (
    <>
      {types.map((precipType) => (
        <div className="precipitation" key={precipType}>
          <style>{css}</style>
          <PrecipitationItem types={types} precipType={precipType} />
        </div>
      ))}
    </>
  );
}


export default Precipitation;