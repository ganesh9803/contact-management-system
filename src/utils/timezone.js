import moment from 'moment-timezone';

export const toUserTimezone = (date, timezone) => moment(date).tz(timezone).format();
