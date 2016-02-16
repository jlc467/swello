import config from '../../../config/client';
import React from 'react';
import MdClose from './svg/close';
import { Motion, spring, presets } from 'react-motion';
import Image from './Image';
import css from './Radar.css';

const radarWidthHeight = {
  width: 600,
  height: 480
};

const URL = `https://api.wunderground.com/api/` +
  `${config.wunderground}/animatedradar/image.gif?&radius=100&newmaps=1&width=` +
  `${radarWidthHeight.width}&height=${radarWidthHeight.height}` +
  `&num=15&delay=1&noclutter=1&smooth=1&timelabel=1&timelabel.y=12`;

const Radar = (props) =>
  <Motion
    defaultStyle={{ top: -100 }}
    style={{ top: spring(0, presets.gentle) }}
  >
    {value => (
      <div>
        <div onClick={() => props.toggleRadar()} className={css.overlay}></div>
        <div className={css.wrapper} style={{ top: `${value.top}%` }}>
          <div style={{ width: radarWidthHeight.width, height: radarWidthHeight.height }}>
            <MdClose
              className={css.close}
              onClick={() => props.toggleRadar()}
              width="20" height="20"
            />
            <Image src={
                `${URL}&centerlat=${Math.round(props.coords.lat * 10) / 10}` +
                `&centerlon=${Math.round(props.coords.long * 10) / 10}`
              }
            />
          </div>
        </div>
      </div>
    )}
  </Motion>;

export default Radar;
