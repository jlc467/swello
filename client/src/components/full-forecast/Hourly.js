import React from 'react';
import moment from 'moment';
import Skycons from '../common/skycons/ReactSkycons';
import PointedArrow from '../common/svg/pointed-arrow';
import css from './Hourly.css';

const Hourly = (props) => {
  const hours = props.hourly.reduce((final, h, i) => {
    const newFinal = final ? final.slice() : [];
    if (i % 3 === 0 || props.hourly.length < 9) {
      const transform = `rotate(${h.windBearing + 180 - 45}deg)`; // for wind direction
      newFinal.push(
        <div key={h.time} className={css.box}>
          <div className={css.header}>{moment.unix(h.time).format('h A')}</div>
            <Skycons
              data-tip={h.summary}
              style={{ width: 60 }}
              color="white" icon={h.icon}
            />
            <div style={{ paddingBottom: 10, paddingTop: 10 }}>
              {Math.round((h.temperature * 10) / 10)}
              <sup>°</sup>
              F
            </div>
            <PointedArrow
              data-tip={`Wind Direction ${h.windBearing}°`}
              style={{ marginBottom: 15, marginTop: 5, transform, fill: '#E0DFC1' }}
              width="40" height="40"
            />
          <div>{Math.round(h.windSpeed * 0.868976)} Knots</div>
          <div
            data-tip="Precipitation Chance"
            style={{ paddingTop: 5 }}
          >
            {Math.round(h.precipProbability * 100)}%
          </div>
        </div>
      );
    }
    return newFinal;
  }, []);


  return (
    <div className={css.container}>
      {hours}
    </div>
    );
};

export default Hourly;
