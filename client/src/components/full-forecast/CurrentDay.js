import React from 'react';
import Skycons from '../common/skycons/ReactSkycons';
import PointedArrow from '../common/svg/pointed-arrow';
import css from './CurrentDay.css';

const CurrentDay = (props) => {
  const transform = `rotate(${props.wind.bearing + 180 - 45}deg)`; // for wind direction
  return (
    <div className={css.container}>
        <div className={css.now}>NOW</div>
      <Skycons // weather icon
        style={{ marginLeft: 15, minWidth: 50 }}
        color="white" icon={props.icon}
      />
      <div data-test="full-forecast-current-temp"
        className={css.temps}
      >
        {Math.round((props.temp * 10) / 10)}
        <sup>°</sup>
      </div>
      <div // wind speed
        data-for="fullTip"
        data-tip="Wind Speed"
        style={{ marginLeft: 20, minWidth: 70 }}
      >
          {Math.round(props.wind.speed * 0.868976)} Knots
      </div>
      <div // wind direction
        style={{ marginLeft: 8 }}
        data-offset="{'top': 2}"
        data-for="fullTip"
        data-tip={`Wind Direction ${props.wind.bearing}°`}
      >
        <PointedArrow
          style={{ transform, fill: '#E0DFC1' }}
          width="35" height="35"
        />
      </div>
      <div className={css.text}>
        {props.summary}
      </div>
    </div>
  );
};

export default CurrentDay;
