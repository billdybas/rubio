'use strict'

import _ from 'lodash'
import envalid from 'envalid'

import { Service } from '../Foundation'

class Configurator extends Service {
  constructor (opts) {
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
      strict: false, // NOTE: Set to 'false' by default for easy on-boarding, but advised to be switched to 'true' once used environment variables are known
      // NOTE: envalid's default reporter kills node (process.exit(1)) in order
      // to prevent starting a system without the proper required environment
      // variables being defined. This is useful in a production setting,
      // but not necessarily convenient for testing. For example, what if you wanted
      // to test that the reporter works? Testing with the default reporter would kill node
      // and therefore the test suite. Therefore, when testing, it is recommended to
      // provide a custom reporter which will work with the test suite and avoid quitting node.
      reporter: null, // envalid expects a truthy value to override the default reporter
      validators: {
        // TODO: Determine a naming scheme for these config options; what is 'default', 'required', 'optional', etc.
        NODE_ENV: envalid.str({default: 'development'}) // Default to running in development mode
      }
    }

    // NOTE: 'validators' will always have the properties defined in 'defaultOpts'
    // This is done so that it can be assumed throughout the rest of the codebase
    // that these 'defaultOpts' are guaranteed to exist
    super(_.merge({}, defaultOpts, opts))
  }

  boot () {
    // This will manage environment variables. It will:
    // - read in environment variables set through the command-line
    // - read in environment variables set in a file (path defined above)
    // - define any additional environment variables and their defaults
    this._envalid = envalid.cleanEnv(process.env, this.config.validators, {
      dotEnvPath: this.config.file,
      reporter: this.config.reporter,
      strict: this.config.strict
    })
  }

  /**
   * Gets all configuration values
   * @return {Object} - All environment variables defined
   */
  all () {
    return this._envalid
  }

  /**
   * Gets a specific environment variable
   * @param  {String} [prop=''] - The name of the environment variable
   * @return {any|undefined}    - The environment variable value or undefined if it doesn't exist
   */
  get (prop = '') {
    return this._envalid[prop]
  }

  /**
   * Determines whether an environment variable has been set
   * @param  {[type]}  [prop=''] - The name of the environment variable
   * @return {Boolean}
   */
  has (prop = '') {
    return this._envalid[prop] !== undefined
  }
}

export default Configurator
