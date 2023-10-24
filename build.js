/**
 * @typedef {Set<string>} InfoSet
 * @typedef {Record<string, InfoSet>} InfoMap
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import fetch from 'node-fetch'
import {ariaAttributes} from 'aria-attributes'
import {fromHtml} from 'hast-util-from-html'
import {select, selectAll} from 'hast-util-select'
import {toString} from 'hast-util-to-string'
import {isEventHandler} from 'hast-util-is-event-handler'

const own = {}.hasOwnProperty

/** @type {Array<InfoMap>} */
const maps = []

// SVG 1
const response1 = await fetch('https://www.w3.org/TR/SVG11/attindex.html')
const text1 = await response1.text()

/** @type {InfoMap} */
const map1 = {}
const row1 = selectAll('.property-table tr', fromHtml(text1))
let index = -1

if (row1.length === 0) {
  throw new Error('Couldn’t find rows in SVG 1')
}

while (++index < row1.length) {
  const row = row1[index]
  const attributes = selectAll('.attr-name', row)
  const elements = selectAll('.element-name', row)
  let elementIndex = -1

  while (++elementIndex < elements.length) {
    const element = toString(elements[elementIndex]).replace(/[‘’]/g, '')
    let attributeIndex = -1

    if (!own.call(map1, element)) {
      map1[element] = new Set()
    }

    while (++attributeIndex < attributes.length) {
      const attribute = toString(attributes[attributeIndex]).replace(
        /[‘’]/g,
        ''
      )

      map1[element].add(attribute)
    }
  }
}

maps.push(map1)

// SVG Tiny.
const responseTiny = await fetch(
  'https://www.w3.org/TR/SVGTiny12/attributeTable.html'
)
const textTiny = await responseTiny.text()

/** @type {InfoMap} */
const mapTiny = {}

const rowsTiny = selectAll('#attributes .attribute', fromHtml(textTiny))

if (rowsTiny.length === 0) {
  throw new Error('Couldn’t find nodes in SVG Tiny')
}

index = -1

while (++index < rowsTiny.length) {
  const row = rowsTiny[index]
  const name = select('.attribute-name', row)
  assert(name, 'expected `name`')
  const attribute = toString(name)
  const elements = selectAll('.element', row)
  let elementIndex = -1

  while (++elementIndex < elements.length) {
    const element = toString(elements[elementIndex])

    if (!own.call(mapTiny, element)) {
      mapTiny[element] = new Set()
    }

    mapTiny[element].add(attribute)
  }
}

maps.push(mapTiny)

// SVG 2.
const response2 = await fetch('https://www.w3.org/TR/SVG2/attindex.html')
const text2 = await response2.text()

/** @type {InfoMap} */
const map2 = {}

const rows2 = selectAll('tbody tr', fromHtml(text2))
index = -1

if (rows2.length === 0) {
  throw new Error('Couldn’t find rows in SVG 2')
}

while (++index < rows2.length) {
  const row = rows2[index]
  const name = select('.attr-name span', row)
  assert(name, 'expected `name`')
  const attribute = toString(name)
  const elements = selectAll('.element-name span', row)
  let elementIndex = -1

  while (++elementIndex < elements.length) {
    const element = toString(elements[elementIndex])

    if (!own.call(map2, element)) {
      map2[element] = new Set()
    }

    map2[element].add(attribute)
  }
}

// Missing from the spec, see: svg-element-attributes#4 <https://github.com/w3c/svgwg/issues/803>
map2.symbol.add('x').add('y').add('width').add('height')

maps.push(map2)

/** @type {Set<string>} */
const globals = new Set()

index = -1

while (++index < maps.length) {
  const map = maps[index]
  /** @type {Set<string>} */
  let all = new Set()
  /** @type {string} */
  let tagName

  // Track all attributes.
  for (tagName in map) {
    if (own.call(map, tagName)) {
      all = new Set([...all, ...map[tagName]])
    }
  }

  // Figure out globals.
  // We have to do this per map.
  /** @type {string} */
  let attribute

  for (attribute of all) {
    let global = true

    for (tagName in map) {
      if (own.call(map, tagName) && !map[tagName].has(attribute)) {
        global = false
        break
      }
    }

    if (global) {
      globals.add(attribute)
    }
  }
}

/** @type {Record<string, Set<string>>} */
const merged = {'*': globals}

index = -1

while (++index < maps.length) {
  const map = maps[index]
  /** @type {string} */
  let tagName

  for (tagName in map) {
    if (own.call(map, tagName)) {
      const existing = own.call(merged, tagName) ? [...merged[tagName]] : []
      const list = [...map[tagName]].filter((d) => !globals.has(d))

      merged[tagName] = new Set([...existing, ...list])
    }
  }
}

/** @type {Record<string, Array<string>>} */
const result = {}
const keys = Object.keys(merged).sort()
/** @type {string} */
let tagName

for (tagName of keys) {
  const list = [...merged[tagName]]
  result[tagName] = list.sort().filter((d) => {
    const pos = d.indexOf(':')
    const ns = pos === -1 ? null : d.slice(0, pos)

    return !(
      isEventHandler(d) ||
      ariaAttributes.includes(d) ||
      ns === 'ev' ||
      ns === 'xml' ||
      ns === 'xlink'
    )
  })
}

await fs.writeFile(
  'index.js',
  [
    '/**',
    ' * Map of SVG elements to allowed attributes.',
    ' *',
    ' * @type {Record<string, Array<string>>}',
    ' */',
    'export const svgElementAttributes = ' + JSON.stringify(result, null, 2),
    ''
  ].join('\n')
)
