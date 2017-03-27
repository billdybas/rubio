'use strict'

import Provider from './Provider'
import Service from './Service'
import { isSubclassOf } from './Utils'

/**
 * A Container manages a collection of Services, Providers, and other Containers
 */
class Container {
  constructor (prop = 'things') {
    // We make it so that the property cannot be deleted or changed
    // to be something other than an Object. We keep the property enumberable,
    // however, to preserve the behavior as if defined through 'this[prop] = {}'.
    // TODO: Should there be logic for preventing properties
    // being defined without using register (e.g. this.things.prop = 'value')
    Object.defineProperty(this, prop, {
      value: {},
      configurable: false,
      enumerable: true,
      writable: false
    })
    // We save the value of prop into a hidden property
    // so that we can reference 'prop' elsewhere in this class
    Object.defineProperty(this, '_prop', {
      value: prop,
      configurable: false,
      enumerable: false,
      writable: false
    })
  }

  register (Thing, opts) {
    // Make sure Thing is a subclass of Service, Provider, or Container
    if (!isSubclassOf(Thing, Service) || !isSubclassOf(Thing, Provider) || !isSubclassOf(Thing, Container)) {
      // TODO: Throw Error
    }

    // Make the key the Thing's class name.
    // This will help prevent duplicate Thing's
    // being managed by a single Container.
    this[this._prop][[Thing]] = new Thing(opts)
  }
}

export default Container
