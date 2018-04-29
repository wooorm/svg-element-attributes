'use strict'

var assert = require('assert')
var test = require('tape')
var svgElementAttributes = require('.')

test('svgElementAttributes', function(t) {
  t.equal(typeof svgElementAttributes, 'object', 'should be an `object`')

  t.doesNotThrow(function() {
    Object.keys(svgElementAttributes).forEach(function(name) {
      assert.ok(Array.isArray(svgElementAttributes[name]), name)
    })
  }, 'values should be array')

  t.doesNotThrow(function() {
    Object.keys(svgElementAttributes).forEach(function(name) {
      var props = svgElementAttributes[name]

      props.forEach(function(prop) {
        var label = prop + ' in ' + name
        assert.ok(typeof prop, 'string', label + ' should be string')
        assert.equal(prop, prop.trim(), label + ' should be trimmed')
        assert.ok(/^[a-z][a-z0-9-]*$/i.test(prop), label + ' should be `a-z-`')
      })
    })
  }, 'name should be lower-case, alphabetical strings')

  t.end()
})
