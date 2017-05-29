'use strict'

import _ from 'lodash'

import { Provider, freshTimestamp, isValidISO8601 } from '../Foundation'

class Model extends Provider {
  constructor (opts) {
    const defaultOpts = {
      defaultAdapter: '',
      strict: true, // TODO: True or False? This will influence additional properties of js-data. Should I even manage this?
      timestamps: true,
      timezone: 'UTC'
    }
    super(_.merge({}, defaultOpts, opts))

    const props = ['store', 'resource', 'schema', 'table', 'relations']

    if (!_.has(this.config, props)) { // TODO: Might also want to make sure their values aren't null
      // TODO: Throw Error
    }

    // TODO: Should the schema be validated as a correct json-schema first?
    this.config.schema = (this.config.timestamps
      ? _.merge({}, this.config.schema, {properties: {'created_at': {type: 'string', default: ''}, 'updated_at': {type: 'string', default: ''}}}) // TODO: Is there a 'date' type?
      : this.config.schema)

    props.forEach((prop) => {
      this[prop] = this.config[prop]
    })

    Object.freeze(this.config)
    Object.freeze(this)
  }

  /**
   * Creates and saves a new Record using the provided `props`
   * (Proxy for Mapper#create: http://api.js-data.io/js-data/latest/Mapper.html#create)
   * @param  {Object} props  - The properties for the new Record
   * @param  {Object} [opts] - Configuration options
   * @return {Promise}       - Promise which resolves with the created Record
   */
  create (props, opts) {
    return this.store.create(this.resource, props, opts)
  }

  /**
   * Given an Array of Records, batch create them
   * (Proxy for Mapper#createMany: http://api.js-data.io/js-data/latest/Mapper.html#createMany)
   * @param  {Array} records - Array of Records to be created in one batch
   * @param  {Object} [opts] - Configuration options
   * @return {Promise}       - Promise which resolves to an Array of the created Records
   */
  createMany (records, opts) {
    return this.store.createMany(this.resource, records, opts)
  }

  /**
   * Decrements the `property` of the Record with the provided primary key
   * @param  {String|Number} id  - The primary key of the Record to modify
   * @param  {String} property   - Property present in this resource's Schema with which to decrement
   * @param  {Number} [amount=1] - Amount by which to decrement
   * @param  {Object} [opts]     - Configuration options
   * @return {Promise}           - Promise which resolves to the updated Record or undefined if not found
   * @throws Error               - Property is not present in this resource's Schema or property is not numeric
   */
  decrement (id, property, amount = 1, opts) {
    if (!this._hasProperty(property) || !this._isNumeric(property)) {
      throw new Error(`${this.resource} either has no property '${property}' or that property is not numeric`)
    }

    return this._incrementOrDecrement('decrement', id, property, amount, opts)
  }

  /**
   * Destroy the Record with the given primary key
   * (Proxy for Mapper#destroy: http://api.js-data.io/js-data/latest/Mapper.html#destroy)
   * @param  {String|Number} id - The primary key of the Record to destroy
   * @param  {Object} [opts]    - Configuration options
   * @return {Promise}          - Promise which resolves when the Record has been destroyed. Resolves even if no Record was found to be destroyed
   */
  destroy (id, opts) {
    return this.store.destroy(this.resource, id, opts)
  }

  /**
   * Destroy the Records selected by `query`. If no `query` is provided, then all records will be destroyed
   * (Proxy for Mapper#destroyAll: http://api.js-data.io/js-data/latest/Mapper.html#destroyAll)
   * @param  {Object} [query] - Selection query
   * @param  {Object} [opts]  - Configuration options
   * @return {Promise}        - Promise which resolves when the Records have been destroyed. Resolves even if no Records were found to be destroyed
   */
  destroyAll (query, opts) {
    return this.store.destroyAll(this.resource, query, opts)
  }

  /**
   * Duplicate a given Record, giving the duplicated Record a new primary key
   * @param  {Record} record - Record to duplicate
   * @param  {Object} [opts] - Configuration options
   * @return {Promise}       - Promise which resolves with the created Record
   */
  duplicate (record, opts) {
    if (!this.store.is(this.resource, record)) {
      throw new Error(`${record} is not an instance of ${this.resource}`)
    }

    return '' // TODO: Return duplicated Record
  }

  /**
   * Retrieve the Record with the given primary key
   * (Proxy for Mapper#find: http://api.js-data.io/js-data/latest/Mapper.html#find)
   * @param  {String|Number} id - The primary key of the Record to retrieve
   * @param  {Object} [opts]    - Configuration options
   * @return {Promise}          - Promise which resolves to a Record or undefined if not found
   */
  find (id, opts) {
    return this.store.find(this.resource, id, opts)
  }

  /**
   * Using the `query` argument, select Records to retrive
   * (Proxy for Mapper#findAll: http://api.js-data.io/js-data/latest/Mapper.html#findAll)
   * @param  {Object} [query] - Selection query
   * @param  {Object} [opts]  - Configuration options
   * @return {Promise}        - Promise which resolves to an Array of Records (which will be empty if no Records are found)
   */
  findAll (query, opts) {
    return this.store.findAll(this.resource, query, opts)
  }

  /**
   * Finds all Resources based on the provided Property and Value
   * @param  {String} property - Property present in this resource's Schema to query on
   * @param  {Mixed}  value    - Value to match
   * @param  {Object} [opts]   - Configuration options
   * @return {Promise}         - Promise which resolves to an Array of Records (which will be empty if no Records are found)
   * @throws Error             - Property is not present in this resource's Schema
   */
  findWhere (property, value, opts) {
    if (!this._hasProperty(property)) {
      throw new Error(`${this.resource} has no property '${property}'`)
    }

    return this.findAll({where: {[property]: {'===': value}}}, opts)
  } // TODO: Should this also accept arrays and '&&' all the where's?

  // TODO?
  findOrCreate () {

  }

  /**
   * Gets the Schema associated with this Model
   * @param  {Boolean} asObject - Returns the Schema as a POJO
   * @return {Schema|Object}    - JS-Data Schema Object or that Schema Object as a POJO
   */
  getSchema (asObject = false) {
    // Return the schema at run-time so that any properties inherited
    // from mapperDefaults are accounted for
    const schema = this.store.getMapper(this.resource).schema

    if (asObject) {
      return JSON.parse(JSON.stringify(schema))
    }

    return schema
  }

  /**
   * Increments the `property` of the Record with the provided primary key
   * @param  {String|Number} id  - The primary key of the Record to modify
   * @param  {String} property   - Property present in this resource's Schema with which to increment
   * @param  {Number} [amount=1] - Amount by which to increment
   * @param  {Object} [opts]     - Configuration options
   * @return {Promise}           - Promise which resolves to the updated Record or undefined if not found
   * @throws Error               - Property is not present in this resource's Schema or property is not numeric
   */
  increment (id, property, amount = 1, opts) {
    if (!this._hasProperty(property) || !this._isNumeric(property)) {
      throw new Error(`${this.resource} either has no property '${property}' or that property is not numeric`)
    }

    return this._incrementOrDecrement('increment', id, property, amount, opts)
  }

  /**
   * Set's the 'created_at' property of the Record with the
   * provided primary key to the provided `time` or the current time
   * @param  {String|Number} id  - The primary key of the Record to modify
   * @param  {String} time       - ISO 8601 Datetime String
   * @param  {Object} [opts]     - Configuration options
   * @return {Promise}           - Promise which resolves with the updated Record or rejects if the Record could not be found
   */
  setCreatedAt (id, time = '', opts) {
    return this._setUpdatedOrCreatedAt('created_at', id, time, opts)
  }

  /**
   * Set's the 'updated_at' property of the Record with the
   * provided primary key to the provided `time` or the current time
   * @param  {String|Number} id  - The primary key of the Record to modify
   * @param  {String} time       - ISO 8601 Datetime String
   * @param  {Object} [opts]     - Configuration options
   * @return {Promise}           - Promise which resolves with the updated Record or rejects if the Record could not be found
   */
  setUpdatedAt (id, time = '', opts) {
    return this._setUpdatedOrCreatedAt('updated_at', id, time, opts)
  }

  /**
   * Select Records according to the `qurey` argument, and
   * aggregate the sum value of the property specified by `field`
   * (Proxy for Mapper#sum: http://api.js-data.io/js-data/latest/Mapper.html#sum)
   * @param  {String} field   - The field to sum
   * @param  {Object} [query] - Selection query
   * @param  {Object} [opts]  - Configuration options
   * @return {Promise}        - Promise which resolves with the aggregated sum
   */
  sum (field, query, opts) {
    return this.store.sum(this.resource, field, query, opts)
  }

  /**
   * Return a plain object representation of the given record.
   * Relations can be optionally included. Non-schema properties can be excluded.
   * (Proxy for Mapper#toJSON: http://api.js-data.io/js-data/latest/Mapper.html#toJSON)
   * @param {Record|Array.<Record>} records - Record or Records from which to create a POJO representation
   * @param  {Object} [opts]                - Configuration options
   * @return {Object|Array.<Object>}        - POJO representation of the Record or Records
   */
  toJSON (records, opts) {
    return this.store.toJSON(this.resource, records, opts)
  }

  /**
   * Updates the 'created_at' and 'updated_at' properties to the current time
   * @param  {String|Number} id  - The primary key of the Record to modify
   * @param  {Object} [opts]     - Configuration options
   * @return {Promise}           - Promise which resolves with the updated Record or rejects if the Record could not be found
   */
  touch (id, opts) {
    const time = freshTimestamp(this.config.timezone)
    return this.update(id, {'created_at': time, 'updated_at': time}, opts)
  }

  /**
   * Update the Record with the primary key provided
   * (Proxy for Mapper#update: http://api.js-data.io/js-data/latest/Mapper.html#update)
   * @param  {String|Number} id  - The primary key of the Record to update
   * @param  {Object} props      - The update to apply to the Record (the properties to modify)
   * @param  {Object} [opts]     - Configuration options
   * @return {Promise}           - Promise which resolves with the updated Record or rejects if the Record could not be found
   */
  update (id, props, opts) {
    return this.store.update(this.resource, id, props, opts)
  }

  /**
   * Using the `query`, perform a single update to the selected Records
   * (Proxy for Mapper#updateAll: http://api.js-data.io/js-data/latest/Mapper.html#updateAll)
   * @param  {Object} props   - Update to apply to selected Records
   * @param  {Object} [query] - Selection query
   * @param  {Object} [opts]  - Configuration options
   * @return {Promise}        - Promise which resolves to an Array of Records (which will be empty if no Records are found)
   */
  updateAll (props, query, opts) {
    return this.store.updateAll(this.resource, props, query, opts)
  }

  /**
   * Given an Array of updates, perform each of the updates.
   * Each 'update' is a hash of properties with which to update a Record.
   * Each update must contain the primary key of the Record to be updated.
   * (Proxy for Mapper#updateMany: http://api.js-data.io/js-data/latest/Mapper.html#updateMany)
   * @param  {Array.<Record>} records - Array of Record updates
   * @param  {Object} [opts]  - Configuration options
   * @return {Promise} - Promise which resolved to an Array of Records or rejects if any of the records could not be found
   */
  updateMany (records, opts) {
    return this.store.updateMany(this.resource, records, opts)
  }

  /**
   * Determines if `property` in in this Model's Schema
   * @param  {String} property - Property to check
   * @return {Boolean}         - Whether `property` is in the Schema
   */
  _hasProperty (property) {
    return _.has(this.getSchema().properties, property)
  }

  /**
   * Increments or decrements the `property` of the Record with the provided primary key
   * @param  {String} method    - Either 'increment' or 'decrement'
   * @param  {String|Number} id - The primary key of the Record to modify
   * @param  {String} property  - Property present in this resource's Schema with which to increment or decrement
   * @param  {Number} amount    - Amount by which to increment or decrement
   * @param  {Object} [opts]    - Configuration options
   * @return {Promise}          - Promise which resolves to the updated Record or undefined if not found
   */
  _incrementOrDecrement (method, id, property, amount, opts) {
    return this.find(id, opts)
      .then((record) => {
        if (record === undefined) { // 'record' will be undefined if not found
          return Promise.resolve(record) // resolve with undefined
        }

        let value = record[property]

        if (method === 'increment') {
          value += amount
        } else if (method === 'decrement') {
          value -= amount
        } // Unknown 'method' has no effect

        return this.update(id, {[property]: value}, opts)
      })
  }

  /**
   * Determines if `property` is defined to be a number or integer
   * @param  {String} property - Property to check
   * @return {Boolean}         - Whether `property` is numeric
   */
  _isNumeric (property) {
    const type = this.getSchema().properties[property].type
    return type === 'number' || type === 'integer'
  }

  /**
   * Set's the 'created_at' or 'updated_at' property of the Record with the
   * provided primary key to the provided `time` or the current time
   * @param {String} method    - Either 'created_at' or 'updated_at'
   * @param {String|Number} id - The primary key of the Record to modify
   * @param {String} [time=''] - ISO 8601 Datetime String
   * @param {[type]} opts      - Configuration options
   */
  _setUpdatedOrCreatedAt (method, id, time = '', opts) {
    if (time && !isValidISO8601(time)) {
      // TODO: Configuration value for time representation algo - either ISO8601 or Unix Timestamp or other custom
      throw new Error(`${time} is not a properly formatted ISO 8601 Datetime String`)
    } else {
      time = freshTimestamp(this.config.timezone)
    }

    if (method === 'created_at' || method === 'updated_at') {
      return this.update(id, {[method]: time}, opts)
    } else {
      return this.find(id, opts) // TODO: Change this to something with a similar signature to 'update'
    }
  }
}

export default Model
