import { forEach } from 'lodash';
import moment from 'moment';

function timeAsKey(forecastArray, offset) {
  return forecastArray.reduce((toReturn, f) => {
    const time = moment.unix(f.time).utcOffset(offset).date();
    toReturn.order.push(time);
    toReturn[time] = Object.assign({}, f, { hourly: [] });
    return toReturn;
  }, { order: [] });
}

export default function formatFullForecast(full) {
  const fullDailyAsObject = timeAsKey(full.daily.data, full.offset);
  forEach(full.hourly.data, (h, _key) => {
    if (fullDailyAsObject[moment.unix(h.time).utcOffset(full.offset).date()]) {
      fullDailyAsObject[moment.unix(h.time).utcOffset(full.offset).date()].hourly.push(h);
    }
  });
  fullDailyAsObject.currently = full.currently;
  fullDailyAsObject.offset = full.offset;
  return fullDailyAsObject;
}
