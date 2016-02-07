/*eslint-disable */
import React from 'react';
import ClearDay from './ClearDay';
import ClearNight from './ClearNight';
import Cloudy from './Cloudy';
import Fog from './Fog';
import PartlyCloudyDay from './PartlyCloudyDay';
import PartlyCloudyNight from './PartlyCloudyNight';
import Rain from './Rain';
import Sleet from './Sleet';
import Snow from './Snow';
import Wind from './Wind';

const ReactSkycons = React.createClass({

  propTypes: {
    color: React.PropTypes.string,
    icon: React.PropTypes.oneOf([
      'clear-day',
      'clear-night',
      'partly-cloudy-day',
      'partly-cloudy-night',
      'cloudy',
      'rain',
      'sleet',
      'snow',
      'wind',
      'fog'
    ])
  },

  getDefaultProps() {
    return {
      color: 'white',
      width: 50,
      height: 50
    };
  },
  getComponent(iconProp) {
    const propToComponent = {
      'clear-day': ClearDay,
      'clear-night': ClearNight,
      'partly-cloudy-day': PartlyCloudyDay,
      'partly-cloudy-night': PartlyCloudyNight,
      cloudy: Cloudy,
      rain: Rain,
      sleet: Sleet,
      snow: Snow,
      wind: Wind,
      fog: Fog
    }
    return propToComponent[iconProp];
  },
  render() {
    const icon = React.createElement(this.getComponent(this.props.icon),
      {
        width: this.props.width,
        height: this.props.height,
        fill: this.props.color,
        style: this.props.style
      });
    return icon;
  }
});

export default ReactSkycons;
