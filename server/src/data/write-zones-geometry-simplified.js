var simplify = require('turf-simplify');
var zones = require('./zones-geometry.json');
var fs = require('fs');

var output = {};

for (var i = 0; i < zones.features.length; i++) {
  var simplified = simplify(zones.features[i], 0.001, true);
  if (simplified !== null) {
    output[zones.features[i].properties.ID] = simplified;
  } else {
    output[zones.features[i].properties.ID] = zones.features[i];
  }
}

fs.writeFile('zones-geometry-simplified.json', JSON.stringify(output), function errorWritingLinks(err) {
  if (err) throw err;
});
