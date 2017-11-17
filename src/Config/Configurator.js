import Contract from '../Contracts/Configurator'

import _ from 'lodash'
import envalid from 'envalid'

class Configurator extends Contract {
  constructor (opts) {
    super() // no-op

    const defaultOpts = {
      // NOTE: 'file' is the path relative to where node is being run.
      // This is an example file hierarchy:
      //
      // foo/
      //  |__bar/
      //     |__example.js
      //     |__.env
      //  |__app.js
      //  |__.env
      //
      // If we're in 'foo' and run 'node app.js', envalid would find foo's '.env'.
      // If we're in 'foo' and run 'node bar/example.js', envalid would find foo's '.env'.
      // If we're in 'bar' and run 'node ../app.js', envalid would find bar's '.env'.
      // If we're in 'bar' and run 'node example.js', envalid would find bar's '.env'.
      file: '.env',
      // NOTE: In strict mode, only the validators explicitly listed will be present in the envalid object
      // NOTE: We set to 'false' by default for easy on-boarding, as you likely don't know all your
      // environment variables yet, but we recommend to switch to 'true' once they are known
      strict: false,
      // NOTE: envalid's default reporter kills node (process.exit(1)) in order
      // to prevent starting a system without the proper required environment
      // variables being defined. This is useful in a production setting,
      // but not necessarily convenient for testing. For example, what if you wanted
      // to test that the reporter works? Testing with the default reporter would kill node
      // and therefore the test suite. Therefore, when testing, it is recommended to
      // provide a custom reporter which will work with the test suite and avoid quitting node.
      reporter: null, // envalid expects a truthy value to override the default reporter
      validators: {
        NODE_ENV: envalid.str({default: 'development'}) // Default to running in development mode
      }
    }

    this._config = _.merge({}, defaultOpts, opts)
  }

  boot () {
    this._envalid = envalid.cleanEnv(process.env, this._config.validators, {
      dotEnvPath: this._config.file,
      reporter: this._config.reporter,
      strict: this._config.strict
    })
  }

  /**
   * Retrieves every key-value pair stored
   * @return {Object}
   */
  all () {
    return this._envalid
  }

  /**
   * Retrieves the value at a particular key
   * @param  {String} [prop=''] - Key
   * @return {Any|undefined} - Value at the specified key or 'undefined' if the key doesn't exist
   */
  get (prop = '') {
    return this._envalid[prop]
  }

  /**
   * Returns whether a value exists at a particular key
   * @param  {String}  [prop=''] - Key
   * @return {Boolean} - True if the key is found, False if the key isn't found
   */
  has (prop = '') {
    return this._envalid[prop] !== undefined
  }
}

export default Configurator
