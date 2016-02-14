# Swello

Marine weather forecast mashup powered by [NOAA](http://www.noaa.gov/) and [Forecast.io](https://forecast.io/)

![preview](preview.png?raw=true)
![preview2](preview2.png?raw=true)

## Implementation

- Marine zone forecasts from NOAA [found here](http://weather.noaa.gov/pub/data/forecasts/marine/) are crawled using [crawl-and-write-zone-links.js](https://github.com/jlc467/swello/blob/master/server/src/data/crawl-and-write-zone-links.js) to get an index of available forecast zones.
- Each available forecast is parsed through [parseForecastText.js](https://github.com/jlc467/swello/blob/master/server/src/app/parseForecastText.js). If a zone fails parsing, it is removed from the index of zones. This maintenance task is handled by [write-zone-links-good.js](https://github.com/jlc467/swello/blob/master/server/src/data/write-zone-links-good.js)
- Geo shape files [found here](http://www.nws.noaa.gov/geodata/catalog/wsom/html/marinezones.htm) representing each geographic forecast zone are converted to GeoJSON using [mapshaper.org](http://www.mapshaper.org/). This is required everytime NOAA updates their zones (very rare).
- GeoJSON is filtered down to forecast zones the parser can handle (there are a small amount that the parser can't handle). This is handled by [write-zones-geometry-good.js](https://github.com/jlc467/swello/blob/master/server/src/data/write-zones-geometry-good.js)
- Express API [`/api/marine`](https://github.com/jlc467/swello/blob/master/server/src/index.js#L43) takes zoneId
 - URL gets looked up from available zone forecast index
 - [parseForecastText.js](https://github.com/jlc467/swello/blob/master/server/src/app/parseForecastText.js) parses the forecast
 - timestamps are generated for each forecast day
- Express API [`/api/forecast`](https://github.com/jlc467/swello/blob/master/server/src/index.js#L18) takes geo coordinates
 - Calls Forecast.io DarkSky API and gets weather forecast
- [Redux reducer](https://github.com/jlc467/swello/blob/master/client/src/reducers/mergeMarine.js) takes timestamps from both forecasts (noaa and forecast.io) and mashes them together into one weather forecast object.
- ReactJS renders forecast with [react-collapse](https://github.com/nkbt/react-collapse) and [react-motion](https://github.com/chenglou/react-motion) to make it pretty.
- Also powering this project
 - [CSS Modules](http://glenmaddern.com/articles/css-modules)
 - [Mapbox GL JS](https://github.com/mapbox/mapbox-gl-js)
 - [Wunderground API](http://www.wunderground.com/weather/api/) for animated weather radar
 - [Climacons](http://adamwhitcroft.com/climacons/) by Adam Whitcroft 
 - [Codeship.com](http://codeship.com) for CI


##How to run it
 - see [server.js](https://github.com/jlc467/swello/blob/master/server/config/server.js) and [client.js](https://github.com/jlc467/swello/blob/master/client/config/client.js) config files
  - enter tokens/keys from [mapbox](http://mapbox.com/studio/), [forecast.io](https://developer.forecast.io/), and [wunderground](http://www.wunderground.com/weather/api/)
 - `cd client && npm install && npm run start`
 - `cd server && npm install && npm run serve`
 - Webpack dev server runs on `http://localhost:8080` by default

##Next Steps
 - Celsius option
 - Build React Native iOS/Android versions
 - Implement auth so favorites can persist beyond local storage
 - Get rid of inline functions ([react/jsx-no-bind](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md))  	

 


