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
export function freshTimestamp (timezone) {
  return moment().tz(timezone).format()
}
