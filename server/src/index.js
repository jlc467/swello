/* eslint-env node */
'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const router = express.Router();
const bodyParser = require('body-parser');
const getForecastTextFromUrl = require('./app/process').getForecastTextFromUrl;
const getForecastUrl = require('./app/process').getForecastUrl;
const getForecastFromCoords = require('./app/getForecast').getForecastFromCoords;
const getDayForecastFromCoordsAndTime = require('./app/getForecast').getDayForecastFromCoordsAndTime;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', router);

router.route('/forecast')
.post((req, res) => {
  if (req.body.coords) {
    getForecastFromCoords(req.body.coords).then((json) => {
      res.json(json);
    }, (error) => {
      res.status(400).json(error);
    });
  }
});

router.route('/forecast/day')
.post((req, res) => {
  if (req.body.coords && req.body.time) {
    getDayForecastFromCoordsAndTime(req.body.coords, req.body.time).then((json) => {
      res.json(json);
    }, (error) => {
      if (error.code) {
        res.status(error.code).json(error);
      }
      res.status(400).json(error);
    });
  }
});

router.route('/marine')
.post((req, res) => {
  if (req.body.zoneId) {
    getForecastTextFromUrl(getForecastUrl(req.body.zoneId)).then((json) => {
      res.json(json);
    }, (error) => {
      res.status(400).json(error);
    });
  }
});

app.listen(process.env.PORT || 8081);
