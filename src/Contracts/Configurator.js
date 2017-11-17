/**
 *
 * A Configurator is responsible for managing
 * application configuration parameters. This includes
 * things such as API keys and environment variables.
 * These values are stored as key-value pairs.
 *
 * See: https://12factor.net/config
 *
 * Since a Configurator acts as a single source of truth,
 * its configuration values must be immutable. These values
 * must be set in the constructor and not be changed while
 * the Configurator is in use.
 *
 * It is recommended to use only one Configurator in a system.
 * Since keys must be unique, one may elect to use a namespacing
 * scheme (eg. 'prefix:key', 'prefix:key2').
 *
 */
class Configurator {
  /**
   * This Class is Bootable
   */
  boot () {}
  /**
   * Retrieves every key-value pair stored
   * @return {Object}
   */
  all () {}
  /**
   * Retrieves the value at a particular key
   * @param  {String} [prop=''] - Key
   * @return {Any|undefined} - Value at the specified key or 'undefined' if the key doesn't exist
   */
  get (prop = '') {}
  /**
   * Returns whether a value exists at a particular key
   * @param  {String}  [prop=''] - Key
   * @return {Boolean} - True if the key is found, False if the key isn't found
   */
  has (prop = '') {}
}

export default Configurator
