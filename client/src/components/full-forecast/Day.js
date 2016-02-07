import React from 'react';
import Collapse from 'react-collapse';
import { reduce } from 'lodash';
import { presets } from 'react-motion';
import MdClose from '../common/svg/close';
import moment from 'moment';
import Skycons from '../common/skycons/ReactSkycons';
import PointedArrow from '../common/svg/pointed-arrow';
import css from './Day.css';
import Hourly from './Hourly';
import FaUmbrella from '../common/svg/umbrella';

const Day = (props) => {
  const timeAsMoment = moment.unix(props.time).utcOffset(props.offset);
  const dayDisplay = timeAsMoment.format('ddd'); // day of week e.g. MON
  const dateDisplay = timeAsMoment.format('MMM, DD'); // date e.g. Jan 01
  const transform = `rotate(${props.wind.bearing + 180 - 45}deg)`; // for wind direction
  // render marine forecast if available
  const getMarine = () => {
    if (props.marineError === true) {
      return (
        <div className={css.text}>
          Unable to retrieve marine forecast for the selected location.
          <br/>
          We will look into it.
        </div>
      );
    } else if (props.loadingMarine === true) {
      return <div className={css.text}>Loading Marine Forecast...</div>;
    } else if (props.marine) {
      if (Object.keys(props.marine).length === 0) {
        return <div className={css.text}>No marine forecast for this day.</div>;
      }
      return reduce(props.marine, (final, m) => {
        const newFinal = final ? final.slice() : [];
        // marine advisory, if available, belongs with the very first marine forecast
        let advisory = null;
        if (props.advisory && m.order === 1) {
          advisory = (
            <div>
              <div className={css.header}>
                Advisory
              </div>
              <div className={css.text}>
                {props.advisory.map((a, i) =>
                  <div key={ `${i}adv'` }>{a}</div>
                )}
              </div>
            </div>
          );
        }
        newFinal.push(
          <div key={`${m.order}marineDay`}>
            {advisory}
            <div className={css.header}>waters {m.dayString}</div>
            <div className={css.text}>{m.text}</div>
          </div>
        );
        return newFinal;
      }, []);
    }
    return <div className={css.text}>Marine forecast not available for selected location.</div>;
  };

  return (
    <div className={css.container}>
      {/* Begin day forecast preview */}
      <div className={css.preview} onClick={ () => props.toggle(props.dIndex) }>
        <MdClose // expand / collapse Day
          className={css.close}
          onClick={ () => props.toggle(props.dIndex) }
          style={{ display: props.isOpen ? 'block' : 'none' }}
        />
        <div // day of week / date
          style={{ display: 'inline-block', marginTop: 8, marginLeft: 3, minWidth: 40 }}
        >
          <div className={css.weekday}>{dayDisplay}</div>
          <span className={css.date}>{dateDisplay}</span>
        </div>
        <div // high / low temperatures
          style={{ display: 'inline-block' }}
        >
        <Skycons // weather icon
          style={{ marginLeft: 15, position: 'relative', bottom: 10 }}
          color="white" icon={props.icon}
        />
        </div>
        <div // high / low temperatures
          data-for="fullTip"
          data-tip="High/Low Temps"
          style={{ minWidth: 60, marginLeft: 15, display: 'inline-block' }}
        >
          <span style={{ bottom: 6, fontSize: 22, position: 'relative' }}>
            {Math.round((props.temp.high * 10) / 10)}
            <sup>°</sup>
          </span>
          <span className={css.slash}></span>
          <span style={{ bottom: -2, fontSize: 14, fontStyle: 'italic', position: 'relative' }}>
            {Math.round((props.temp.low * 10) / 10)}
            <sup>°</sup>
          </span>
        </div>
        <div // wind speed
          data-for="fullTip"
          data-tip="Wind Speed"
          style={{ marginLeft: 20, display: 'inline-block', minWidth: 70 }}
        >
          <div
            style={{ bottom: 6, position: 'relative' }}
          >
            {Math.round(props.wind.speed * 0.868976)} Knots
          </div>
        </div>
        <div // wind direction
          data-offset="{'top': 10}"
          style={{ display: 'inline-block', minWidth: 60 }}
          data-for="fullTip"
          data-tip={`Wind Direction ${props.wind.bearing}°`}
        >
          <PointedArrow
            style={{ position: 'relative', bottom: 9, left: 8, transform, fill: '#E0DFC1' }}
            width="35" height="35"
          />
        </div>
        <div // percipitation %
          data-offset="{'left': 10}"
          data-for="fullTip"
          data-tip="Precipitation Chance"
          style={{ marginLeft: 15, display: 'inline-block', minWidth: 70 }}
        >
          <span style={{ bottom: 6, position: 'relative' }}>
            <FaUmbrella
              width="15" height="15"
              style={{ marginRight: 5, paddingBottom: 2, fill: '#E0DFC1' }}
            />
            {Math.round(props.precip * 100)}%
          </span>
        </div>
        {/* summary snippet */}
        {!props.isOpen ? <div className={css.snippetContainer}>
          <span className={css.snippet}>{props.summary}</span>
        </div> : null}
      </div> {/* End of day forecast preview */}
      <Collapse
        className={css.collapse}
        keepCollapsedContent
        springConfig={presets.noWobble}
        isOpened={ props.isOpen }
      >
        <div className={css.text}>{props.summary}</div>
        <div style={{ paddingBottom: 10 }}>{getMarine()}</div>
        <Hourly hourly={props.hourly} />
        <div style={{ height: 10 }}></div>
      </Collapse>
    </div>
    );
};

export default Day;
