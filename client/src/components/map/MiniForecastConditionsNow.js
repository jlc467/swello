import React from 'react';
import Skycons from '../common/skycons/ReactSkycons';

const MiniForecastConditionsNow = (props) =>
  <div style={{ marginBottom: -15 }} >
    <div className={props.css['menu-header']}>
      Conditions Now
    </div>
    <div className={props.css['menu-sub-header']}>
      {props.summary}
    </div>
    <div>
      <Skycons width="125" height="125"
        color="white" style={{ marginTop: -30 }} icon={props.icon}
      />
      <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
        <span style={{ fontSize: 55, float: 'left' }}>
          {Math.round(props.temperature)}
        </span>
        <div style={{ float: 'left', display: 'inline', fontSize: 12, marginTop: 10 }}>
          <span aria-label="°Fahrenheit">°F</span>
        </div>
      </div>
    </div>
  </div>;

export default MiniForecastConditionsNow;
