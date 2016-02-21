import React from 'react';
import Skycons from '../common/skycons/ReactSkycons';
import PointedArrow from '../common/svg/pointed-arrow';
import FaUmbrella from '../common/svg/umbrella';
import css from './DayPreview.css';

const DayPreview = (props) => {
  const transform = `rotate(${props.wind.bearing + 180 - 45}deg)`; // for wind direction
  return (
    <div className={css.container} onClick={props.toggle}>
      <div // day of week / date
        style={{ marginLeft: 3, minWidth: 40 }}
      >
        <div className={css.weekday}>{props.dayDisplay}</div>
        <span className={css.date}>{props.dateDisplay}</span>
      </div>
      <Skycons // weather icon
        style={{ marginLeft: 15, minWidth: 50 }}
        color="white" icon={props.icon}
      />
        <div // high / low temperatures
          className={css.temps}
          data-for="fullTip"
          data-tip="High/Low Temps"
        >
          <span style={{ fontSize: 22 }}>
            {Math.round((props.temp.high * 10) / 10)}
            <sup>°</sup>
          </span>
          <span className={css.slash}></span>
          <span style={{ fontSize: 14, fontStyle: 'italic', position: 'relative', top: 5 }}>
            {Math.round((props.temp.low * 10) / 10)}
            <sup>°</sup>
          </span>
        </div>
      <div // wind speed
        data-for="fullTip"
        data-tip="Wind Speed"
        style={{ marginLeft: 20, minWidth: 70 }}
      >
          {Math.round(props.wind.speed * 0.868976)} Knots
      </div>
      <div // wind direction
        style={{ marginLeft: 10, minWidth: 60 }}
        data-offset="{'top': 2}"
        data-for="fullTip"
        data-tip={`Wind Direction ${props.wind.bearing}°`}
      >
        <PointedArrow
          style={{ transform, fill: '#E0DFC1' }}
          width="35" height="35"
        />
      </div>
        <div // percipitation %
          data-offset="{'left': 10}"
          data-for="fullTip"
          data-tip="Precipitation Chance"
          style={{ marginLeft: 10, minWidth: 70 }}
        >
          <span>
            <FaUmbrella
              width="15" height="15"
              style={{ marginRight: 5, fill: '#E0DFC1' }}
            />
            {Math.round(props.precip * 100)}%
          </span>
        </div>
        {/* summary snippet */}
        {!props.isOpen ? <div className={css.snippetContainer}>
          <span className={css.snippet}>{props.summary}</span>
        </div> : null}
    </div>
  );
};

export default DayPreview;
