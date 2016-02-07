import React from 'react';
import PointedArrow from '../common/svg/pointed-arrow';

const MiniForecastWind = (props) => {
  const transform = `rotate(${props.bearing + 180 - 45}deg)`; // for wind direction
  return (
    <div>
      <div className={props.css['menu-header']}>
        Wind {Math.round(props.mph * 0.868976)} Knots
      </div>
      <div style={{ marginBottom: 10, marginTop: 10 }} className={props.css['menu-sub-header']}>
         <PointedArrow style={{ transform, fill: '#E0DFC1' }} width="100" height="100" />
      </div>
    </div>
  );
};

export default MiniForecastWind;
