const Promise = require('bluebird')
require('isomorphic-fetch')
const ES_ENDPOINT_URL = require('../../config/server.js').ES_ENDPOINT_URL
const links = require('./zone-links-good.json')
const _ = require('lodash')

const fetchAndSaveForecast = zoneId =>
  new Promise((resolve, reject) => {
    console.log(zoneId);
    fetch(`http://localhost:8081/api/marine`, {
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
    }).then(json => saveForecast(json).then(
      result => resolve(result),
      reason => reject(reason)
    )).catch(error => reject(error))
  })

const saveForecast = forecast =>
  new Promise((resolve, reject) => {
    fetch(`${ES_ENDPOINT_URL}/forecasts/forecast/${forecast.issuedMoment}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(forecast)
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      }
      const error = new Error(response.statusText);
      throw error;
    }).then(json => resolve(json))
    .catch(error => reject(error))
  })

const saveAllZones = () => {
  const toResolve = _.map(links, (link, zoneId) => () => fetchAndSaveForecast(zoneId).reflect())
  Promise.mapSeries(toResolve, write => write()).then(
    result => console.log(result),
    reason => console.log(reason)
  )
}

setInterval(saveAllZones, 60000*20)
saveAllZones()
