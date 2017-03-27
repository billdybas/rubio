'use strict'

/**
 * A Service manages state.
 * This could include managing configuration
 * variables, data models, algorithmic behavior, etc.
 */
class Service {
  constructor (opts) {
    const defaultOpts = {}
    this.config = {...defaultOpts, ...opts}
  }

  boot () {

  }
}

export default Service
