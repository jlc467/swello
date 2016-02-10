import {
  LOADING_FORECAST,
  GOT_LOCATION,
  GOT_CURRENT_FORECAST,
  LOADING_MARINE,
  GOT_MARINE,
  GOT_FULL_FORECAST,
  MOVE_CARD,
  GOT_STARRED,
  DISABLE_GET_LOCATION,
  FETCH_ERROR,
  GET_CURRENT_FORECAST_FAILED,
  GET_MARINE_FAILED
}
from '../actions';

import { combineReducers } from 'redux';
import formatFullForecast from './formatFullForecast';
import mergeMarine from './mergeMarine';
import update from 'react/lib/update';

const initialState = {
  location: null,
  currentForecast: null,
  fullForecast: null,
  marine: null,
  loadingForecast: false,
  loadingMarine: false,
  starredItems: [],
  starredEnabled: false,
  disableGetLocation: false,
  error: false
};

function appState(state = initialState, action) {
  switch (action.type) {
    case LOADING_FORECAST:
      return Object.assign({}, state, {
        loadingForecast: true,
        currentForecast: null,
        marine: action.clearMarine === true ? null : state.marine
      });
    case LOADING_MARINE:
      return Object.assign({}, state, {
        loadingMarine: true,
        marine: null,
        marineError: false
      });
    case GOT_LOCATION:
      return Object.assign({}, state, {
        location: action.location
      });
    case GOT_CURRENT_FORECAST:
      return Object.assign({}, state, {
        currentForecast: Object.assign(
          {},
          action.forecast,
          { coords: action.coords, expiration: action.expiration }
        ),
        loadingForecast: false
      });
    case GOT_FULL_FORECAST:
      let fullForecast = Object.assign(
        {},
        formatFullForecast(action.forecast),
        {
          fetchedTimestamp: action.fetchedTimestamp,
          coords: action.coords,
          expiration: action.expiration
        }
      );
      if (state.marine && state.marine.fetchedTimestamp === action.fetchedTimestamp) {
        fullForecast = mergeMarine(state.marine, fullForecast);
      }
      return Object.assign({}, state, {
        fullForecast,
        loadingForecast: false
      });
    case GOT_MARINE:
      const marine = Object.assign(
        {},
        action.marine,
        {
          fetchedTimestamp: action.fetchedTimestamp,
          zoneId: action.zoneId,
          expiration: action.expiration
        }
      );

      const fullForecastArrived = () =>
        state.fullForecast && state.fullForecast.timestamp === action.fetchedTimestamp;

      return Object.assign({}, state, {
        marineError: false,
        marine,
        fullForecast: fullForecastArrived === true
          ? mergeMarine(marine, state.fullForecast)
          : state.fullForecast,
        loadingMarine: false
      });
    case MOVE_CARD:
      return update(
        state, { starredItems: {
          $splice: [
            [action.dragIndex, 1],
            [action.hoverIndex, 0, action.dragCard]
          ]
        } }
      );
    case GOT_STARRED:
      return Object.assign({}, state, {
        starredItems: action.starredItems,
        starredEnabled: action.starredEnabled
      });
    case DISABLE_GET_LOCATION:
      return Object.assign({}, state, {
        disableGetLocation: true
      });
    case FETCH_ERROR:
      return Object.assign({}, state, {
        error: true
      });
    case GET_MARINE_FAILED:
      return Object.assign({}, state, {
        marineError: true,
        loadingMarine: false,
        marine: null
      });
    case GET_CURRENT_FORECAST_FAILED:
      return Object.assign({}, state, {
        currentForecastError: true,
        loadingForecast: false,
        currentForecast: null
      });
    default:
      return state;
  }
}

const reducer = combineReducers(Object.assign({}, { appState }, {}));

export default reducer;
