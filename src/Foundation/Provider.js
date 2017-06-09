'use strict'

import _ from 'lodash'

/**
 * A Provider manages access to data.
 * This could include managing the transmission and
 * acquisition of data (e.g. across a network, through another API),
 * access control to the data, authentication & authorization, etc.
 */
class Provider {
  constructor (opts) {
    const defaultOpts = {}
    this.config = _.merge({}, defaultOpts, opts)
  }
}

export default Provider
