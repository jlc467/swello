import React, { Component } from 'react';
import GLMap from './GLMap';
import DrawMap from './DrawMap';
import config from '../../../config/client';
import { connect } from 'react-redux';
import { getCurrentForecast, getLocation, disableGetLocation } from '../../actions';

class MapContainer extends Component {
  constructor(props) {
    super(props);
    // map defaults
    this.mapView = {
      style: 'mapbox://styles/jcmuse/cih9a9bbq0023rom4g8ehgvf0',
      center: [-82.4764, 27.9681],
      zoom: 5,
      container: 'map'
    };
  }
  componentDidMount() {
    document.title = 'Map | Swello';
    // Check for Geolocation API permissions
    if (navigator && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
      .then((permissionStatus) => {
        if (permissionStatus.state === 'denied') {
          this.props.dispatch(disableGetLocation());
        }
      });
    }
  }
  render() {
    const {
      dispatch,
      params,
      location,
      locationCoords,
      currentForecast,
      currentForecastError,
      loadingForecast,
      loadingMarine,
      marine,
      marineError,
      starredEnabled,
      starredItems
    } = this.props;

    // map style
    let width = '100%';
    let offSet = 10;
    if (location.query.showStarred === 'true' && starredEnabled === true) {
      width = 'calc(100% - 250px)';
      offSet = 260;
    }
    const mapStyle = {
      position: 'absolute',
      top: 40,
      bottom: 0,
      width
    };

    if (location.pathname.indexOf('drawmap') > -1) {
      return (
        <div>
          <DrawMap
            baselayer="mz10nv15"
            getLocation={() => dispatch(getLocation())}
            disableGetLocation={this.props.disableGetLocation}
            location={location}
            locationCoords={locationCoords}
            mapStyle={mapStyle}
            offSet={offSet}
            params={params}
            ref="glmap"
            token={config.token.map}
            view={Object.assign(this.mapView, { style: 'mapbox://styles/jcmuse/cikcm77hi007l9fm127xym4v1' })}
          />
        </div>
      );
    }

    return (
      <div>
        <GLMap
          baselayer="mz10nv15"
          currentForecast={currentForecast}
          currentForecastError={currentForecastError}
          getLocation={() => dispatch(getLocation())}
          disableGetLocation={this.props.disableGetLocation}
          getCurrentForecast={(coords, zoneId) => dispatch(getCurrentForecast(coords, zoneId))}
          location={location}
          locationCoords={locationCoords}
          loadingForecast={loadingForecast}
          loadingMarine={loadingMarine}
          mapStyle={mapStyle}
          marine={marine}
          marineError={marineError}
          offSet={offSet}
          params={params}
          ref="glmap"
          token={config.token.map}
          view={this.mapView}
          starredItems={starredItems}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentForecast: state.appState.currentForecast,
    currentForecastError: state.appState.currentForecastError,
    marine: state.appState.marine,
    marineError: state.appState.marineError,
    locationCoords: state.appState.location,
    loadingForecast: state.appState.loadingForecast,
    loadingMarine: state.appState.loadingMarine,
    starredEnabled: state.appState.starredEnabled,
    starredItems: state.appState.starredItems,
    disableGetLocation: state.appState.disableGetLocation
  };
}

export default connect(mapStateToProps)(MapContainer);
