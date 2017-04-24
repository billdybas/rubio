'use strict'

import _ from 'lodash'

/**
 * A Service manages state.
 * This could include managing configuration
 * variables, data models, algorithmic behavior, etc.
 */
class Service {
  constructor (opts) {
    const defaultOpts = {}
    this.config = _.merge({}, defaultOpts, opts)
  }

  boot () {

  }
}

export default Service
