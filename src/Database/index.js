'use strict'

import Promise from 'bluebird'
import { Container as DataContainer, utils } from 'js-data'

import Model from './Model'
import User from './User'
import { Container, isSubclassOf } from '../Foundation'

// Make js-data use bluebird internally
utils.Promise = Promise

class ModelContainer extends Container {
  /**
   * @param  {Object} [opts]
   * @return {void}
   */
  constructor (opts) {
    super('models')

    this.store = new DataContainer(opts)
  }

  /**
   * Defines default and required options and provides
   * the ability to register Models individually or as an Array,
   * since multiple Models may have the same configuration
   *
   * opts: {
   *    defaultAdapter?: string TODO: Test how 'defaultAdapter' works
   * }
   * @override
   * @param  {Object|Array} Models - Individual Model or Array of Models
   * @param  {Object} [opts]       - Configuration options
   */
  register (Models, opts) {
    const defaultOpts = {
      defaultAdapter: null // TODO: Test 'null'
    }
    const requiredOpts = {
      store: this.store
    }
    const config = {...defaultOpts, ...opts, ...requiredOpts}

    let mdls = Models
    // If only 1 element is provided, make it an Array
    if (!Array.isArray(Models)) {
      mdls = [Models]
    }
    mdls.forEach((M) => {
      if (!isSubclassOf(M, Model)) {
        console.error(`${[M]} is not an instance of 'Model'`) // TODO: Figure out debug logging
        console.error(`Skipping adding ${[M]} to ModelContainer`)
        return
      }

      // Register each Model and set them as top-level properties,
      // so that you can do this:
      // const Models = new ModelContainer()
      // Models.register(User)
      // Models.User === Models.models.User // 'true'
      super.register(M, config, true)
    })
  }
}

export { ModelContainer, Model, User }
