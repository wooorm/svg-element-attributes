import assert from 'node:assert/strict'
import test from 'node:test'
import {svgElementAttributes} from './index.js'

test('svgElementAttributes', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('./index.js')).sort(), [
      'svgElementAttributes'
    ])
  })

  await t.test('should be an `object`', async function () {
    assert.equal(typeof svgElementAttributes, 'object')
  })

  await t.test('values', async function (t) {
    const tagNames = Object.keys(svgElementAttributes)

    for (const tagName of tagNames) {
      await t.test(tagName, async function () {
        const attributes = svgElementAttributes[tagName]

        for (const attribute of attributes) {
          assert.equal(typeof attribute, 'string')
          assert.equal(attribute, attribute.trim())
          assert.match(attribute, /^[a-z][a-z\d-]*$/i)
        }

        assert.ok(Array.isArray(attributes))
      })
    }
  })
})
