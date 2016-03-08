import React, { Component } from 'react';
import GeoLocate from './GeoLocate';
import css from './GLMap.css';
import loader from '../common/svg/radio.svg';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import reactMixin from 'react-mixin';
import config from '../../../config/client';
import { isEmpty } from 'lodash';

console.log(config.FIREBASE_URL);

const ref = new Firebase(`${config.FIREBASE_URL}/geo`);

class DrawMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loadingLocation: false,
      geo: {}
    };
  }
  componentDidMount() {
    mapboxgl.accessToken = this.props.token;
    this.map = new mapboxgl.Map(this.props.view);
    this.draw = mapboxgl.Draw({
      controls: { marker: true, line: true, shape: false, square: false },
      styles: {
        'gl-draw-selected-point': {
          paint: {
            'circle-radius': 6,
            'circle-color': '#DB6D70'
          }
        },
        'gl-draw-point': {
          paint: {
            'circle-radius': 6,
            'circle-color': '#DB6D70'
          }
        },
        'gl-draw-selected-point-mid': {
          paint: {
            'circle-radius': 3,
            'circle-color': '#DB6D70'
          }
        },
        'gl-draw-line': {
          paint: {
            'line-color': '#DB6D70',
            'line-width': 2
          }
        },
        'gl-draw-selected-line': {
          paint: {
            'line-color': '#DB6D70',
            'line-width': 2
          }
        }
      }
    });
    this.map.addControl(this.draw);
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();
    this.map.doubleClickZoom.disable();
    this.map.on('draw.set', (e) => {
      this.firebaseRefs.geo.child(e.id).set(e.geojson);
    });
    this.map.on('draw.delete', (e) => {
      this.firebaseRefs.geo.child(e.id).remove();
    });
    this.bindAsObject(ref, 'geo');
    this.firebaseRefs.geo.on('child_removed', (oldChildSnapshot) => {
      this.draw.destroy(oldChildSnapshot.key());
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.disableGetLocation === true) {
      this.setState({ loadingLocation: false });
    }
    // if user allows geolocation, flyTo their location so map is centered where they are
    if (!this.props.locationCoords && nextProps.locationCoords) {
      this.goToCurrentLocation(nextProps.locationCoords);
    } else if (this.props.locationCoords
        && this.props.locationCoords.long
        !== nextProps.locationCoords.long
      ) {
      this.goToCurrentLocation(nextProps.locationCoords);
    }
  }
  // when starred side-bar is toggled, resize
  componentDidUpdate(prevProps, _prevState) {
    if (this.props.offSet !== prevProps.offSet) {
      this.map.resize();
    }
    if (isEmpty(this.state.geo) === false) {
      for (const id in this.state.geo) {
        if (id[0] !== '.') {
          this.draw.add(this.state.geo[id]);
        }
      }
    }
  }
  componentWillUnmount() {
    this.map.remove();
  }
  // render map buttons bottom right
  getMapButtons() {
    return (
      <div>
        {!this.props.disableGetLocation ? <GeoLocate
          onClick={() => this.goToCurrentLocation(this.props.locationCoords)}
          bottom="20"
          coords={this.props.locationCoords}
          right={this.props.offSet}
          css={css.button}
        /> : null}
      </div>
    );
  }
  // when user clicks on 'My Location' button, drop marker on current location from geolocation API
  goToCurrentLocation(locationCoords) {
    if (locationCoords !== null) {
      this.setState({ loadingLocation: false });
      this.flyTo(locationCoords, 9);
    } else {
      this.setState({ loadingLocation: true });
      this.props.getLocation();
    }
  }
  // center map to given coordinates, zoom-in 1.02 times
  flyTo(location, zoom = this.map.getZoom() * 1.02) {
    this.map.flyTo({
      center: [
        location.long,
        location.lat
      ],
      zoom,
      speed: 1.2,
      curve: 0.6,
    });
  }
  render() {
    let loadingIndicator = null;
    if (this.state.loaded === false || this.state.loadingLocation === true) {
      loadingIndicator = <img className={css.loader} src={loader}/>;
    }
    return (
      <div>
        {loadingIndicator}
        <div style={this.props.mapStyle} id="map"></div>
          <div id="credits" className={css.credits}>
            Maps Powered By&nbsp;
            <a href="https://mapbox.com/about/maps/" target="_blank">© Mapbox</a> and&nbsp;
            <a href="http://openstreetmap.org/about/" target="_blank">© OpenStreetMap</a>
            &nbsp;//&nbsp;Weather Powered By&nbsp;
            <a href="https://forecast.io/" target="_blank">Forecast.io</a>,&nbsp;
            <a href="http://wunderground.com/" target="_blank">© Weather Underground</a>,&nbsp;and&nbsp;
            <a href="http://nws.noaa.gov/om/marine/zone/usamz.htm" target="_blank">USA NOAA</a>
            &nbsp;//&nbsp;
            <a href="https://github.com/jlc467/swello" target="_blank">GitHub Repo</a>
          </div>
          {this.getMapButtons()}
      </div>
    );
  }
}

DrawMap.contextTypes = {
  router: React.PropTypes.object.isRequired
};

reactMixin(DrawMap.prototype, ReactFireMixin);

export default DrawMap;
