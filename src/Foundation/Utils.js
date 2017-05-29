'use strict'

import moment from 'moment-timezone'

/**
 * Determines if Thing is an indirect subclass of class Klass
 * @param  {Object} Thing - Possible Subclass
 * @param  {Object} Klass - Possible Superclass
 * @return Boolean
 */
export function isSubclassOf (Thing, Klass) {
  return Thing.prototype instanceof Klass
}

/**
 * Get a timestamp of right now from the provided timezone
 * @param  {String} timezone - Timezone supported by Moment
 * @return {String}          - An ISO 8601 Timestamp
 */
export function freshTimestamp (timezone = 'UTC') {
  // When tz isn't provided an argument, it defaults to 'UTC',
  // but we include a default here so that it's more explicit and clear
  return moment().tz(timezone).format()
}

/**
 * Determines whether the provided string is a valid ISO 8601 Timestamp
 * @param  {String}  timeStr - String to test
 * @return {Boolean}
 */
export function isValidISO8601 (timeStr) {
  return moment(timeStr, moment.ISO_8601).isValid()
}
