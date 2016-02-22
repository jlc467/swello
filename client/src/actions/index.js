import config from '../../config/client';
import { isEqual, remove } from 'lodash';
import moment from 'moment';
import appHistory from '../appHistory';
const FORECAST_API = config.FORECAST_API;

// Actions
export const LOADING_FORECAST = 'LOADING_FORECAST';
export const LOADING_MARINE = 'LOADING_MARINE';
export const GOT_LOCATION = 'GOT_LOCATION';
export const GOT_CURRENT_FORECAST = 'GOT_CURRENT_FORECAST';
export const GET_CURRENT_FORECAST_FAILED = 'GET_CURRENT_FORECAST_FAILED';
export const GOT_FULL_FORECAST = 'GOT_FULL_FORECAST';
export const GOT_MARINE = 'GOT_MARINE';
export const GET_MARINE_FAILED = 'GOT_MARINE_FAILED';
export const MOVE_CARD = 'MOVE_CARD';
export const GOT_STARRED = 'GOT_STARRED';
export const DISABLE_GET_LOCATION = 'DISABLE_GET_LOCATION';
export const FETCH_ERROR = 'FETCH_ERROR';

// use to set expiration on forecast cache
const calculateExpiration = (minutesToLive) =>
  moment().add(minutesToLive, 'minutes');

// Action Creators
const gotUnhandledFetchError = (_ex) => (
  {
    type: FETCH_ERROR
  }
);

const loadingForecast = (clearMarine) => (
  {
    type: LOADING_FORECAST,
    clearMarine
  }
);

const loadingMarine = () => (
  {
    type: LOADING_MARINE
  }
);

const gotLocation = (location) => (
  {
    type: GOT_LOCATION,
    location
  }
);

export const disableGetLocation = () => (
  { type: DISABLE_GET_LOCATION }
);

export const getLocation = () =>
  (dispatch) => {
    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 300000
    };
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        long: position.coords.longitude,
        lat: position.coords.latitude
      };
      dispatch(gotLocation(location));
    }, (_error) => {
      dispatch(disableGetLocation());
    }, options);
  };

const gotCurrentForecast = (forecast, coords) => (
  {
    type: GOT_CURRENT_FORECAST,
    forecast,
    coords,
    expiration: calculateExpiration(10)
  }
);

const gotFullForecast = (forecast, coords, fetchedTimestamp) => (
  {
    type: GOT_FULL_FORECAST,
    forecast,
    coords,
    expiration: calculateExpiration(10),
    fetchedTimestamp
  }
);

const gotMarine = (marine, zoneId, fetchedTimestamp) => (
  {
    type: GOT_MARINE,
    marine,
    zoneId,
    expiration: calculateExpiration(10),
    fetchedTimestamp
  }
);

const getMarine = (zoneId, fetchedTimestamp = null) =>
  (dispatch) => {
    dispatch(loadingMarine());

    fetch(`${FORECAST_API}/api/marine`, {
      method: 'post',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ zoneId })
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      const error = new Error(response.statusText);
      throw error;
    }).then(json => dispatch(gotMarine(json, zoneId, fetchedTimestamp)))
    .catch(error => {
      if (error.message === 'Bad Request') {
        dispatch({ type: GET_MARINE_FAILED });
      } else {
        dispatch(gotUnhandledFetchError(error));
      }
    });
  };

// check for non-expired forecast with same coords
const checkIfForecastExpired = (forecast, coords) => {
  if (forecast && isEqual(coords, forecast.coords) && forecast.expiration.isAfter()) {
    // keep existing forecast data
    return false;
  }
  // get new forecast data
  return true;
};

export const getCurrentForecast = (coords, zoneId) =>
  (dispatch, getState) => {
    if (checkIfForecastExpired(getState().appState.forecast, coords) === false) {
      // keep existing forecast data
      return;
    }
    // clear marine forecast if it won't be replaced
    let clearMarine = true;
    if (zoneId !== null && zoneId !== 'null') {
      clearMarine = false; // no need to clear, will be replaced
    }
    if (clearMarine === false) {
      // get marine forecast
      dispatch(getMarine(zoneId));
    }

    // for loading indicator
    dispatch(loadingForecast(clearMarine));

    fetch(`${FORECAST_API}/api/forecast/day`, {
      method: 'post',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ coords, time: moment().format() })
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      const error = new Error(response.statusText);
      throw error;
    }).then(json => dispatch(gotCurrentForecast(json, coords)))
    .catch(error => {
      if (error.message === 'Bad Request') {
        dispatch({ type: GET_CURRENT_FORECAST_FAILED });
      } else {
        dispatch(gotUnhandledFetchError(error));
      }
    });
  };

export const getFullForecast = (coords, zoneId) =>
  (dispatch, getState) => {
    if (checkIfForecastExpired(getState().appState.fullForecast, coords) === false) {
      // keep existing forecast data
      return;
    }
    const fetchedTimestamp = moment().valueOf();
    // clear marine forecast if it won't be replaced
    let clearMarine = true;
    if (zoneId !== null && zoneId !== 'null') {
      clearMarine = false; // no need to clear, will be replaced
      // get marine forecast
      dispatch(getMarine(zoneId, fetchedTimestamp));
    }
    // forecast loading indicator handles clearMarine
    dispatch(loadingForecast(clearMarine));

    fetch(`${FORECAST_API}/api/forecast`, {
      method: 'post',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ coords })
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      const error = new Error(response.statusText);
      throw error;
    }).then(json => dispatch(gotFullForecast(json, coords, fetchedTimestamp)))
      .catch(ex => dispatch(gotUnhandledFetchError(ex)));
  };

export const moveCard = (dragIndex, hoverIndex, dragCard) => (
  { type: MOVE_CARD, dragIndex, hoverIndex, dragCard }
);

const gotStarred = (starredItems = []) => (
  { type: GOT_STARRED, starredItems, starredEnabled: starredItems.length > 0 ? true : false }
);

export const setStarred = () =>
  (dispatch, getState) =>
    localStorage.setItem('starredItems', JSON.stringify(getState().appState.starredItems));

export const getStarred = () => {
  const starredItems = window.localStorage.getItem('starredItems');
  if (starredItems) {
    return gotStarred(JSON.parse(starredItems));
  }
  return gotStarred([]);
};

export const addStarredItem = (item, search) =>
  (dispatch, getState) => {
    const newStarredItems = getState().appState.starredItems.slice();
    item.id = Date.now();
    newStarredItems.push(item);
    localStorage.setItem('starredItems', JSON.stringify(newStarredItems));
    dispatch(gotStarred(newStarredItems));
    appHistory.push({
      pathname: `/favorite/${item.id}`,
      search
    });
  };

export const removeStarredItem = (item, search) =>
  (dispatch, getState) => {
    const newStarredItems = getState().appState.starredItems.slice();
    remove(newStarredItems, (o) => o.id === item.id);
    localStorage.setItem('starredItems', JSON.stringify(newStarredItems));
    dispatch(gotStarred(newStarredItems));
    appHistory.push({
      pathname: '/full' +
        `/${item.lat}` +
        `/${item.long}` +
        `/${item.zoneId}`,
      search
    });
  };
