module.exports = {
  token: {
    map: process.env.MAP_TOKEN || 'mapboxtokenhere'
  },
  FORECAST_API: process.env.FORECAST_API || 'http://localhost:8081',
  wunderground: process.env.WUNDERGROUND_KEY || 'wundergroundapikeyhere'
};
