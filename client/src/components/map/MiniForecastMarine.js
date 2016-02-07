import React from 'react';

const MiniForecastMarine = (props) => {
  // render marine forecast if within noaa zone
  if (props.marineError === true) {
    return (
      <div className={props.css['menu-sub-header']}>
        Unable to retrieve marine forecast for the selected location.
        <br/>
        We will look into it.
      </div>
    );
  } else if (props.loadingMarine === true) {
    return <h3 style={{ marginLeft: 15 }}>Loading Marine</h3>;
  } else if (props.marine && !props.marine.error) {
    let advisory = null;
    if (props.marine.advisory && props.marine.advisory.length > 0) {
      advisory = props.marine.advisory.map((a, i) =>
        <div key={ `${i}adv` }>{a}</div>
      );
    }
    return (
      <div className={props.css['mini-marine']}>
        {advisory ?
          <div>
            <div className={props.css['menu-header']}>
              Advisory
            </div>
            <div className={props.css['menu-sub-header']}>
              {advisory}
            </div>
          </div> : null
        }
        <div className={props.css['menu-header']}>
          Waters {props.marine[1].dayString}
        </div>
        <div className={props.css['menu-sub-header']}>
          {props.marine[1].text}
        </div>
      </div>
    );
  }
  return <div></div>;
};

export default MiniForecastMarine;
