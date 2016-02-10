import React from 'react';
import { Motion, spring, presets } from 'react-motion';
import MdClose from '../common/svg/close';
import MiniForecastMarine from './MiniForecastMarine';
import MiniForecastWind from './MiniForecastWind';
import MiniForecastConditionsNow from './MiniForecastConditionsNow';
import css from './MiniForecast.css';

const MiniForecast = (props) => {
  // render current forecast
  const getCurrentForecast = () => {
    if (props.currentForecastError === true) {
      return (
        <div className={css['menu-sub-header']}>
          Unable to retrieve current forecast for the selected location.
          <br/>
          We will look into it.
        </div>
      );
    } else if (props.loadingForecast === true) {
      return <h3 style={{ marginLeft: 15 }}>Loading Forecast</h3>;
    } else if (props.currentForecast) {
      return (
        <div>
          <MiniForecastConditionsNow
            css={css}
            icon={props.currentForecast.currently.icon}
            summary={props.currentForecast.currently.summary}
            temperature={props.currentForecast.currently.temperature}
          />
          <div
            onClick={() => props.toggleRadar()}
            className={css.button}
          >
            View Radar
          </div>
          <div
            data-test="full-forecast-button"
            onClick={() => props.goToFullForecast()}
            className={css.button}
          >
            View Full Forecast
          </div>
          <MiniForecastWind
            css={css}
            bearing={props.currentForecast.currently.windBearing}
            mph={props.currentForecast.currently.windSpeed}
          />
        </div>
      );
    }
    return null;
  };
  return (
    <Motion
      defaultStyle={{ y: -10, scale: 0.1 }}
      style={{ y: spring(70, presets.wobbly), scale: spring(1) }}
    >
      {value =>
        <div
          style={{
            scale: value.scale,
            right: props.right,
            top: value.y,
            transform: `scale(${value.scale})`
          }}
          className={css.container}
        >
          <MdClose
            className={css.close}
            onClick={props.close}
          />
          {getCurrentForecast()}
          <MiniForecastMarine
            css={css}
            loadingMarine={props.loadingMarine}
            marineError={props.marineError}
            marine={props.marine}
          />
        </div>
      }
    </Motion>
  );
};

export default MiniForecast;
