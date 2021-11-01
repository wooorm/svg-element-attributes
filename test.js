import assert from 'node:assert'
import test from 'tape'
import {svgElementAttributes} from './index.js'

const own = {}.hasOwnProperty

test('svgElementAttributes', function (t) {
  t.equal(typeof svgElementAttributes, 'object', 'should be an `object`')

  t.doesNotThrow(function () {
    /** @type {string} */
    let tagName

    for (tagName in svgElementAttributes) {
      if (own.call(svgElementAttributes, tagName)) {
        assert.ok(Array.isArray(svgElementAttributes[tagName]), tagName)
      }
    }
  }, 'values should be array')

  t.doesNotThrow(function () {
    /** @type {string} */
    let tagName

    for (tagName in svgElementAttributes) {
      if (own.call(svgElementAttributes, tagName)) {
        const attributes = svgElementAttributes[tagName]
        let index = -1

        while (++index < attributes.length) {
          const attribute = attributes[index]
          const label = attribute + ' in ' + tagName
          assert.strictEqual(
            typeof attribute,
            'string',
            label + ' should be string'
          )
          assert.strictEqual(
            attribute,
            attribute.trim(),
            label + ' should be trimmed'
          )
          assert.ok(
            /^[a-z][a-z\d-]*$/i.test(attribute),
            label + ' should be `a-z-`'
          )
        }
      }
    }
  }, 'name should be lowercase, alphabetical strings')

  t.end()
})
