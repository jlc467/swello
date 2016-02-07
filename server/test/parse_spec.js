/* eslint-env node,mocha */
const parseForecastText = require('../parseForecastText');
const moment = require('moment');
const expect = require('chai').expect;


describe('parseForecastText.js', function parseTest() {
  describe('getForecastObject', function forecastObjectTest() {
    it('should return the appropriate forecastMoment for given dayString', function forecastMomentTest() {
      const dayByDayArray = [
        '.SUNDAY...EAST WINDS 7 TO 11 KNOTS INCREASING TO 10 TO 14 KNOTS IN THE LATE MORNING AND AFTERNOON. A LIGHT CHOP ON THE BAY BUILDING TO A MODERATE CHOP ON THE BAY IN THE LATE MORNING AND AFTERNOON.'
      ];
      const issuedMoment = moment();
      const testResult = parseForecastText.getForecastObject(dayByDayArray, issuedMoment, 'dummyUrl');
      const expected = new moment(issuedMoment).day(7);
      expected.hour(9);
      for (var prop in testResult) {
        expect(testResult[prop].forecastMoment.format()).to.equal(expected.format());
        console.log(testResult[prop].forecastMoment.format());
        console.log(expected.format());
        break;
      }
    });
  });
});
