import React, { Component } from 'react';
import GeoLocate from './GeoLocate';
import MiniForecast from './MiniForecast';
import Radar from '../common/Radar';
import css from './GLMap.css';
import loader from '../common/svg/radio.svg';
import { find } from 'lodash';

class GLMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loadingLocation: false,
      feature: null,
      clearForecast: false
    };
  }
  componentDidMount() {
    mapboxgl.accessToken = this.props.token;
    this.map = new mapboxgl.Map(this.props.view);
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();
    this.map.doubleClickZoom.disable();
    this.onMapStyleLoad();
    this.onMapClick();
    this.onMapMouseMove();
    this.onMapMove();
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
    // if route changed and route points to mini forecast, place marker with coord and zoneId params
    if (this.props.location.pathname
        !== nextProps.location.pathname
        && nextProps.location.pathname.indexOf('mini') > -1
    ) {
      this.handleMarkerPlacement(
        { lat: nextProps.params.lat, long: nextProps.params.long },
        nextProps.params.zoneId
      );
    }
    this.map.resize();
  }
  // when starred side-bar is toggled, resize
  componentDidUpdate(prevProps, _prevState) {
    if (this.props.offSet !== prevProps.offSet) {
      this.map.resize();
    }
  }
  componentWillUnmount() {
    this.map.off('move');
    this.map.off('mousemove');
    this.map.off('style.load');
    this.map.remove();
  }
  // on initial map load, if coords found in route,
  // call this.handleMarkerPlacement with coords once style loads
  onMapStyleLoad() {
    this.map.on('style.load', (_e) => {
      this.setState({ loaded: true });
      if (this.props.location.pathname.indexOf('mini') > -1) {
        this.handleMarkerPlacement(
          { lat: this.props.params.lat, long: this.props.params.long },
          this.props.params.zoneId
        );
      } else if (this.props.location.pathname.indexOf('favorite')) {
        const fav = find(this.props.starredItems, (o) =>
          o.id.toString() === this.props.params.favoriteId
        );
        if (fav) {
          this.handleMarkerPlacement(
            { lat: fav.lat, long: fav.long },
            fav.zoneId
          );
        } else { // fav not found
          this.context.router.push({
            pathname: '/map',
            search: this.props.location.search
          });
        }
      }
    });
  }
  // when user clicks map, check for zones then set route with findings
  onMapClick() {
    this.map.on('click', (e) => {
      this.map.featuresAt(
        e.point,
        { layer: 'zones-geometry-good', radius: 1, includeGeometry: true },
        (err, features) => {
          if (err) throw err;
          const coords = { lat: e.lngLat.lat.toFixed(5), long: e.lngLat.lng.toFixed(5) };
          let zoneId = null;
          if (features.length) {
            zoneId = features[0].properties.ID;
          }
          // change route and componentWillReceiveProps will call this.handleMarkerPlacement()
          this.context.router.push({
            pathname: `/map/mini/${coords.lat}/${coords.long}/${zoneId}`,
            search: this.props.location.search
          });
        }
      );
    });
  }
  // clear tooltip if user moves map
  onMapMove() {
    this.map.on('move', (_e) => {
      this.setState({ feature: null });
    });
  }
  // when user hovers over a zone, set this.state.feature for tooltip
  onMapMouseMove() {
    this.map.on('mousemove', (e) => {
      this.map.featuresAt(
        e.point,
        { layer: 'zones-geometry-good', radius: 1, includeGeometry: false },
        (err, features) => {
          if (err) throw err;
          if (features.length) {
            this.setState({
              feature: Object.assign(features[0].properties, { top: e.point.y, left: e.point.x })
            });
          } else {
            this.setState({ feature: null });
          }
        }
      );
    });
  }
  // when user hovers over a zone, render tooltip
  getZoneHover() {
    if (!this.state.feature) {
      return null;
    }
    const style = {
      zIndex: 9999,
      position: 'absolute',
      top: this.state.feature.top + 20,
      left: this.state.feature.left - 3
    };

    return (
      <p
        style={style}
        className="__react_component_tooltip place-right type-dark show"
      >
        {`${this.state.feature.NAME} (${this.state.feature.ID})`}
      </p>
    );
  }
  // when user clicks on map, render 'mini' forecast for marker location
  getMiniForecast() {
    if (this.state.clearForecast === false
      && (this.props.currentForecast
        || this.props.loadingForecast
        || this.props.currentForecastError
      )
      && this.props.location.pathname.indexOf('mini') > -1
    ) {
      return (
        <div onMouseEnter={() => this.setState({ feature: null })}>
          <MiniForecast
            toggleRadar={() => this.toggleRadar()}
            loadingForecast={this.props.loadingForecast}
            loadingMarine={this.props.loadingMarine}
            currentForecast={this.props.currentForecast}
            currentForecastError={this.props.currentForecastError}
            marine={this.props.marine}
            marineError={this.props.marineError}
            right={this.props.offSet}
            goToFullForecast={ () => this.goToFullForecast() }
            close={() => this.closeMiniForecast()}
          />
        </div>
      );
    }
    return null;
  }
  // render Radar if ?showRadar=true
  getRadar() {
    if (this.props.location.query.showRadar === 'true') {
      return (
        <Radar
          toggleRadar={() => this.toggleRadar()}
          coords={{ lat: this.props.params.lat, long: this.props.params.long }}
        />
      );
    }
    return null;
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
  // when user clicks on map, place marker on map and get forecast data
  handleMarkerPlacement(coords, zoneId) {
    // focus marker
    this.flyTo({ lat: coords.lat, long: coords.long });
    // get current forecast
    this.props.getCurrentForecast(coords, zoneId);
    // retrigger animation for mini forecast
    this.setState({ clearForecast: true }, () => {
      this.setState({ clearForecast: false });
    });

    if (this.map.getSource('markers')) {
      this.map.removeSource('markers');
      this.map.removeLayer('markers');
    }

    this.map.addSource('markers', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [coords.long, coords.lat]
          }
        }]
      }
    });

    this.map.addLayer({
      id: 'markers',
      type: 'symbol',
      interactive: true,
      source: 'markers',
      layout: {
        'icon-image': 'default-marker',
        'icon-offset': [0, -15]
      }
    });
  }
  // when user clicks on 'My Location' button, drop marker on current location from geolocation API
  goToCurrentLocation(locationCoords) {
    if (locationCoords !== null) {
      this.setState({ loadingLocation: false });
      const point = this.map.project(
        [locationCoords.long, locationCoords.lat]
      );
      let zoneId = null;
      this.map.featuresAt(
        point,
        { layer: 'zones-geometry-good', radius: 1, includeGeometry: true },
        (err, features) => {
          if (err) throw err;
          if (features.length) {
            zoneId = features[0].properties.ID;
          }
          this.context.router.push({
            pathname: '/map/mini' +
              `/${locationCoords.lat.toFixed(5)}` +
              `/${locationCoords.long.toFixed(5)}` +
              `/${zoneId}`,
            search: this.props.location.search
          });
          this.flyTo(locationCoords, 9);
        }
      );
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
  // set route to show/hide Radar
  toggleRadar() {
    const { location } = this.props;
    if (location.query.showRadar === 'true') {
      this.context.router.push({
        pathname: location.pathname,
        query: Object.assign({}, location.query, { showRadar: 'false' })
      });
    } else {
      this.context.router.push({
        pathname: location.pathname,
        query: Object.assign({}, location.query, { showRadar: 'true' })
      });
    }
  }
  // when user clicks 'x' on MiniForecast, close MiniForecast by changing route
  closeMiniForecast() {
    this.context.router.push({
      pathname: '/map',
      search: this.props.location.search
    });
  }
  // when user clicks 'View Full Forecast' navigate to full route
  goToFullForecast() {
    this.context.router.push({
      pathname: '/full' +
        `/${this.props.params.lat}` +
        `/${this.props.params.long}` +
        `/${this.props.params.zoneId}`,
      search: this.props.location.search
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
        <div
          style={this.props.mapStyle}
          id="map"
        ></div>
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
          {this.getRadar()}
          {this.getZoneHover()}
          {this.getMiniForecast()}
          {this.getMapButtons()}
      </div>
    );
  }
}

GLMap.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default GLMap;
