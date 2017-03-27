'use strict'

/**
 * Determines if Thing is an indirect subclass of class Klass
 * @param  {Object} Thing - Possible Subclass
 * @param  {Object} Klass - Possible Superclass
 * @return Boolean
 */
export function isSubclassOf (Thing, Klass) {
  return Thing.prototype instanceof Klass
}
