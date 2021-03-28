import assert from 'assert'
import test from 'tape'
import {svgElementAttributes} from './index.js'

test('svgElementAttributes', function (t) {
  t.equal(typeof svgElementAttributes, 'object', 'should be an `object`')

  t.doesNotThrow(function () {
    for (const name of Object.keys(svgElementAttributes)) {
      assert.ok(Array.isArray(svgElementAttributes[name]), name)
    }
  }, 'values should be array')

  t.doesNotThrow(function () {
    for (const name of Object.keys(svgElementAttributes)) {
      var props = svgElementAttributes[name]

      for (const prop of props) {
        var label = prop + ' in ' + name
        assert.ok(typeof prop, 'string', label + ' should be string')
        assert.strictEqual(prop, prop.trim(), label + ' should be trimmed')
        assert.ok(/^[a-z][a-z\d-]*$/i.test(prop), label + ' should be `a-z-`')
      }
    }
  }, 'name should be lower-case, alphabetical strings')

  t.end()
})
