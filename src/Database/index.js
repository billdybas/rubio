'use strict'

import { Container as DataContainer } from 'js-data'
import _ from 'lodash'
import moment from 'moment-timezone'

import Model from './Model'
import { Container, isSubclassOf } from '../Foundation'

class ModelContainer extends Container {
  /**
   * opts: {
   *    timezone?: string,
   *    mapperDefaults?: {
   *      afterCreate?(props: any, opts: any, result: any): any
   *      afterUpdate?(id: string|number, opts: any, result: any): any
   *    }
   * }
   * @param  {Object} [opts] See above
   * @return {void}
   */
  constructor (opts) {
    super('models')

    const defaultOpts = {
      timezone: 'UTC',
      mapperDefaults: {}
    }
    // Shallowly merge so that any function definitions in 'mapperDefaults' are recognized
    const config = {...defaultOpts, ...opts}

    // Keep a reference of any user-supplied 'afterCreate' and 'afterUpdate'
    // so that we can call them after our 'afterCreate' and 'afterUpdate'
    // No-op prevents having to check for 'null' below: we can just call the function
    const afterCreate = config.mapperDefaults.afterCreate || (() => {})
    const afterUpdate = config.mapperDefaults.afterUpdate || (() => {})
    // The merge below could overwrite our 'afterCreate' and 'afterUpdate' if a user
    // supplies their own, so we delete them to prevent conflict. Note we have a reference
    // to them right above, and 'delete' works even if the properties don't exist.
    delete config.mapperDefaults.afterCreate
    delete config.mapperDefaults.afterUpdate

    // Setup the JS Data Container Opts
    const dataContainerOpts = _.merge({}, {
      mapperDefaults: {
        afterCreate (props, opts, result) {
          // Add timestamp props
          if (this._hasTimestamps(props) && this._shouldModifyTimestamps()) {
            const timestamp = this._freshTimestamp(config.timezone)
            props['created_at'] = timestamp
            props['updated_at'] = timestamp
          }
          afterCreate(props, opts, result) // Pass through the args
        },
        afterUpdate (id, props, result) {
          // Add timestamp props
          if (this._hasTimestamps(props) && this._shouldModifyTimestamps()) {
            const timestamp = this._freshTimestamp(config.timezone)
            props['updated_at'] = timestamp
          }
          afterUpdate(id, props, result) // Pass through the args
        }
      }
    }, config.mapperDefaults) // See above

    this.store = new DataContainer(dataContainerOpts)
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

    let mdls
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

  _freshTimestamp (timezone) {
    return moment().tz(timezone).format()
  }

  _hasTimestamps (props) {
    // 'created_at' and 'updated_at' will be an empty string when first created,
    // so we must check for their existance in the object
    return (props['created_at'] !== undefined && props['updated_at'] !== undefined)
  }

  _shouldModifyTimestamps () {
    const env = process.env.NODE_ENV // TODO: Use a global config instead of individual 'process' statements
    return env !== 'test' || env !== 'migration'
  }
}

export default { ModelContainer, Model }
