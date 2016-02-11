module.exports = {
  FORECASTIO_KEY: process.env.FORECASTIO_KEY || 'forecast.iokeyhere',
  FORECASTIO_TIMEOUT: parseInt(process.env.FORECASTIO_TIMEOUT, 10) || 20000
};
