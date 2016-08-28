/* eslint-env node */
const jsdom = require('jsdom');
const fs = require('fs');
const jquery = fs.readFileSync('./node_modules/jquery/dist/jquery.js', 'utf-8');
const RSVP = require('rsvp');
const _ = require('lodash');


const scrape = function scrape(url) {
  const promise = new RSVP.Promise(function promise(resolve, reject) {
    const done = function done(err, window) {
      const $ = window.$;

      const dirs = [];
      const save = [];

      $('a').map((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text();
        if (href.indexOf('.txt') > -1) {
          save.push(url + href);
        } else if (href.indexOf('/') > -1 && text !== 'Parent Directory') {
          dirs.push(url + href);
        }
      });

      resolve({dirs, save});
      reject();
    };

    jsdom.env({
      url,
      src: jquery,
      done
    });
  });

  return promise;
};


function getLinks(urls, saved) {
  const savedLinks = !saved ? [] : saved;
  const promises = urls.map(function getPromises(url) {
    const promise = scrape(url);
    const recusivePromise = promise.then(function urlPromise(scraped) {
      if (scraped.dirs.length > 0) {
        return getLinks(scraped.dirs, savedLinks.concat(scraped.save));
      }
      return savedLinks.concat(scraped.save);
    });

    return recusivePromise;
  });

  return RSVP.all(promises).then((links) => {
    return _.flattenDeep(links);
  });
}

function writeLinks(links) {
  fs.writeFile('zone-links.json', JSON.stringify(links), function errorWritingLinks(err) {
    if (err) throw err;
  });
}

getLinks(['http://tgftp.nws.noaa.gov/data/forecasts/marine/coastal/']).then(function getLinksCallback(links) {
  const linksObject = links.reduce(function reduceLink(map, url) {
    const zone = url.substring(url.lastIndexOf('/') + 1, url.length - 4);
    map[zone] = url;
    return map;
  }, {});

  writeLinks(linksObject);
});
