var zones = require('./zones-geometry.json');
var good = require('./zone-links-good.json');
var fs = require('fs');
var _ = require('lodash');


const goodZones = _.filter(zones.features, (feature) => {
  if (feature.properties.ID.toLowerCase() in good) {
    return true;
  }
  return false;
});

zones.features = goodZones;

fs.writeFile('zones-geometry-good.json', JSON.stringify(zones), function errorWritingLinks(err) {
  if (err) throw err;
});
