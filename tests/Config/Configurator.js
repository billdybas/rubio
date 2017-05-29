/* eslint-env mocha */

'use strict'

import _ from 'lodash'
import assert from 'assert'
import envalid from 'envalid'
import path from 'path'

import Configurator from '../../src/Config/Configurator'

describe('Configurator', function () {
  describe('constructor', function () {
    it('Merges Internal Configuration Correctly', function () {
      const c = new Configurator({
        file: 'foo',
        validators: {
          TEST: envalid.str({default: 'bar'})
        }
      })

      const expected = {
        file: 'foo',
        strict: false,
        reporter: null,
        validators: {
          NODE_ENV: envalid.str({default: 'development'}),
          TEST: envalid.str({default: 'bar'})
        }
      }

      assert.deepStrictEqual(c.config, expected)
    })

    it('Empty Validators Object Does Not Exclude Default Properties', function () {
      const c = new Configurator({
        file: 'foo',
        validators: {}
      })

      const expected = {
        file: 'foo',
        strict: false,
        reporter: null,
        validators: {
          NODE_ENV: envalid.str({default: 'development'})
        }
      }

      assert.deepStrictEqual(c.config, expected)
    })
  })

  describe('boot', function () {
    let c

    beforeEach(function (done) {
      c = new Configurator({
        file: path.join(__dirname, './.env'),
        validators: {
          'BAR': envalid.str({default: 'BAZ'})
        }
      })
      c.boot()
      done()
    })

    it('Reads an Environment Variable Set Through the Command-line', function () {
      // Since tests will be run in 'test' mode, there should be a 'NODE_ENV' of 'test'
      assert(_.has(c._envalid, 'NODE_ENV') && c._envalid['NODE_ENV'] === 'test')
    })

    it('Reads an Environment Variable Set Through a File', function () {
      assert(_.has(c._envalid, 'FOO') && c._envalid['FOO'] === 'BAR')
    })

    it('Sets a Default Environment Variable', function () {
      assert(_.has(c._envalid, 'BAR') && c._envalid['BAR'] === 'BAZ')
    })

    it('Validates an Environment Variable is of the Correct Type', function () {
      // This test also tests that a custom reporter can be used
      const ERROR_STR = 'Invalid Environment Variable Type'

      const d = new Configurator({
        file: path.join(__dirname, './.env'),
        reporter () {
          throw new Error(ERROR_STR)
        },
        validators: {
          // Since this has already been defined and is a string ('test'), this should error
          NODE_ENV: envalid.num()
        }
      })
      assert.throws(() => { d.boot() }, new RegExp(ERROR_STR))
    })

    it('Ignores File Environment Variables in Strict Mode', function () {
      const e = new Configurator({
        // This could read in and add 'FOO=BAR' but because it's running in strict mode,
        // it ignores that variable since it's not specified in validators below
        file: path.join(__dirname, './.env'),
        strict: true,
        validators: {
          NODE_ENV: envalid.str()
        }
      })
      e.boot()

      const expected = {
        NODE_ENV: 'test'
      }

      assert.deepStrictEqual(e._envalid, expected)
    })
  })

  describe('all', function () {
    // We run these tests in 'strict' mode, so that we can
    // control the number of environment variables
    it('Returns All Default Environment Variables When None Specified in Validators', function () {
      const c = new Configurator({
        file: path.join(__dirname, './.env'),
        strict: true,
        validators: {}
      })
      c.boot()

      const e = c.all()
      assert(_.size(e) === 1 && _.has(e, 'NODE_ENV') && e['NODE_ENV'] === 'test')
    })

    it('Returns All Default and Specified Environment Variables', function () {
      const c = new Configurator({
        file: path.join(__dirname, './.env'),
        strict: true,
        validators: {
          FOO: envalid.str()
        }
      })
      c.boot()

      const e = c.all()
      assert(_.size(e) === 2 && _.has(e, 'NODE_ENV') && e['NODE_ENV'] === 'test' && _.has(e, 'FOO') && e['FOO'] === 'BAR')
    })
  })

  describe('get', function () {
    let c

    beforeEach(function (done) {
      c = new Configurator({
        file: path.join(__dirname, './.env'),
        strict: true,
        validators: {
          NODE_ENV: envalid.str(),
          FOO: envalid.str()
        }
      })
      c.boot()
      done()
    })

    it('Returns the Value of a Existing Environment Variable', function () {
      assert(c.get('NODE_ENV') === 'test')
    })

    it("Returns 'undefined' for Non-existant Environment Variables", function () {
      assert(c.get('BAZ') === undefined)
    })

    it('Returns the Default Property Value when No Property is Specified', function () {
      // Tests when '' is not assigned a value
      assert(c.get() === undefined)

      // Tests when '' is assigned a value
      const d = new Configurator({
        file: path.join(__dirname, './.env'),
        strict: true,
        validators: {
          '': envalid.str({default: 'BAN'})
        }
      })
      d.boot()
      assert(d.get() === 'BAN')
    })
  })

  describe('has', function () {
    let c

    beforeEach(function (done) {
      c = new Configurator({
        file: path.join(__dirname, './.env'),
        strict: true,
        validators: {
          NODE_ENV: envalid.str()
        }
      })
      c.boot()
      done()
    })

    it("Returns 'true' if Provided Environment Variable Exists", function () {
      assert(c.has('NODE_ENV'))
    })

    it("Returns 'false' if Provided Environment Variable Does Not Exist", function () {
      assert(c.has('BAZ') === false)
    })
  })
})
