import React from 'react';
import Collapse from 'react-collapse';
import { reduce } from 'lodash';
import { presets } from 'react-motion';
import moment from 'moment';
import css from './Day.css';
import Hourly from './Hourly';
import DayPreview from './DayPreview';

const Day = (props) => {
  const timeAsMoment = moment.unix(props.time).utcOffset(props.offset);
  const dayDisplay = timeAsMoment.format('ddd'); // day of week e.g. MON
  const dateDisplay = timeAsMoment.format('MMM, DD'); // date e.g. Jan 01
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
      <DayPreview
        toggle={props.toggle.bind(null, props.dIndex)}
        dayDisplay={dayDisplay}
        dateDisplay={dateDisplay}
        icon={props.icon}
        temp={props.temp}
        wind={props.wind}
        precip={props.precip}
        isOpen={props.isOpen}
        summary={props.summary}
      />
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
