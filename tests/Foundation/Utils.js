/* eslint-env mocha */

'use strict'

import assert from 'assert'
import moment from 'moment-timezone'

import * as Utils from '../../src/Foundation/Utils'

describe('Utils', function () {
  describe('isSubclassOf', function () {
    it('Correctly Recognizes Direct Subclasses', function () {
      class A {}
      class B extends A {}

      assert.deepEqual(Utils.isSubclassOf(B, A), true)
    })

    it('Correctly Recognizes Indirect Subclasses', function () {
      class A {}
      class B extends A {}
      class C extends B {}

      assert.deepEqual(Utils.isSubclassOf(C, A), true)
    })

    it('Correctly Recognizes Non-subclasses', function () {
      class A {}
      class B {}

      assert.deepEqual(Utils.isSubclassOf(B, A), false)
    })
  })

  describe('freshTimestamp', function () {
    it('Returns a Properly Formatted ISO 8601 Timestamp', function () {
      const t = Utils.freshTimestamp()
      assert.deepEqual(moment(t, moment.ISO_8601).isValid(), true)
    })

    it('Returns Later Times When Called Again', function (done) {
      const t = Utils.freshTimestamp()
      setTimeout(() => { // Moment tracks no finer than seconds, so we have to delay the test by a second
        const s = Utils.freshTimestamp()
        assert(moment(s).isAfter(moment(t)))
        done()
      }, 1000)
    })

    it('Supports More Than 1 Timezone', function () {
      const t = Utils.freshTimestamp()
      const s = Utils.freshTimestamp('EST')
      assert.deepEqual(t !== s, true) // These should have different offsets (Z and -05:00)
    })
  })

  describe('isValidISO8601', function () {
    // TODO
    it('', function () {
      assert(false)
    })
  })
})
