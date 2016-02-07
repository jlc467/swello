import React from 'react';
import MdSatellite from '../common/svg/satellite';

const ToggleSatellite = (props) =>
  <button
    onClick={() => props.onClick() }
    data-for="headerTip"
    data-tip="Toggle Satellite Map Layer"
    data-place="left" width="25" height="25"
    style={{
      zIndex: 999,
      display: 'block',
      bottom: props.bottom,
      right: props.right,
      position: 'absolute'
    }}
    className={props.css}
  >
    <MdSatellite width="20" height="20" />
  </button>;

export default ToggleSatellite;
