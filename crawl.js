/**
 * @typedef {Record<string, Set<string>>} InfoMap
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import {ariaAttributes} from 'aria-attributes'
import {fromHtml} from 'hast-util-from-html'
import {isEventHandler} from 'hast-util-is-event-handler'
import {select, selectAll} from 'hast-util-select'
import {toString} from 'hast-util-to-string'
import {fetch} from 'undici'

const maps = await Promise.all([requestSvg1(), requestSvgTiny(), requestSvg2()])

// Missing from the spec, see: svg-element-attributes#4 <https://github.com/w3c/svgwg/issues/803>
maps[0].symbol.add('x').add('y').add('width').add('height')

/** @type {Set<string>} */
const globals = new Set()

// Figure out globals.
// We have to do this per map: the maps have different tag names.
for (const map of maps) {
  const tagNames = Object.keys(map)
  /** @type {Set<string>} */
  const all = new Set()

  // Track all attributes.
  for (const tagName of tagNames) {
    for (const attribute of map[tagName]) {
      if (!ignoreAttribute(attribute)) {
        all.add(attribute)
      }
    }
  }

  for (const attribute of all) {
    let global = true

    for (const tagName of tagNames) {
      if (!map[tagName].has(attribute)) {
        global = false
        break
      }
    }

    if (global) {
      globals.add(attribute)
    }
  }
}

/** @type {InfoMap} */
const merged = {}

for (const map of maps) {
  const tagNames = Object.keys(map)

  for (const tagName of tagNames) {
    const attributes = map[tagName]
    let mergedAttributes = merged[tagName]

    if (!mergedAttributes) {
      mergedAttributes = new Set()
      merged[tagName] = mergedAttributes
    }

    for (const attribute of attributes) {
      if (globals.has(attribute) || ignoreAttribute(attribute)) {
        continue
      }

      mergedAttributes.add(attribute)
    }
  }
}

/** @type {Record<string, ReadonlyArray<string>>} */
const result = {'*': [...globals].sort()}
const tagNames = Object.keys(merged).sort()

for (const tagName of tagNames) {
  result[tagName] = [...merged[tagName]].sort()
}

await fs.writeFile(
  'index.js',
  [
    '/**',
    ' * Map of SVG elements to allowed attributes.',
    ' *',
    ' * @type {Record<string, ReadonlyArray<string>>}',
    ' */',
    'export const svgElementAttributes = ' +
      JSON.stringify(result, undefined, 2),
    ''
  ].join('\n')
)

async function requestSvg1() {
  const response = await fetch('https://www.w3.org/TR/SVG11/attindex.html')
  const text = await response.text()

  /** @type {InfoMap} */
  const map = {}
  const rows = selectAll('.property-table tr', fromHtml(text))

  if (rows.length === 0) {
    throw new Error('Couldn’t find rows in SVG 1')
  }

  for (const row of rows) {
    const attributes = selectAll('.attr-name', row)
    const elements = selectAll('.element-name', row)

    for (const element of elements) {
      const value = toString(element).replaceAll(/[‘’]/g, '')
      let list = map[value]

      if (!list) {
        list = new Set()
        map[value] = list
      }

      for (const attribute of attributes) {
        list.add(toString(attribute).replaceAll(/[‘’]/g, ''))
      }
    }
  }

  return map
}

async function requestSvgTiny() {
  const response = await fetch(
    'https://www.w3.org/TR/SVGTiny12/attributeTable.html'
  )
  const text = await response.text()
  /** @type {InfoMap} */
  const map = {}
  const rows = selectAll('#attributes .attribute', fromHtml(text))

  if (rows.length === 0) {
    throw new Error('Couldn’t find nodes in SVG Tiny')
  }

  for (const row of rows) {
    const name = select('.attribute-name', row)
    assert(name, 'expected `name`')
    const attribute = toString(name)
    const elements = selectAll('.element', row)

    for (const element of elements) {
      const value = toString(element)

      if (!Object.hasOwn(map, value)) {
        map[value] = new Set()
      }

      map[value].add(attribute)
    }
  }

  return map
}

async function requestSvg2() {
  const response = await fetch('https://www.w3.org/TR/SVG2/attindex.html')
  const text = await response.text()
  /** @type {InfoMap} */
  const map = {}
  const rows = selectAll('tbody tr', fromHtml(text))

  if (rows.length === 0) {
    throw new Error('Couldn’t find rows in SVG 2')
  }

  for (const row of rows) {
    const name = select('.attr-name span', row)
    assert(name, 'expected `name`')
    const attribute = toString(name)
    const elements = selectAll('.element-name span', row)

    for (const element of elements) {
      const value = toString(element)

      if (!Object.hasOwn(map, value)) {
        map[value] = new Set()
      }

      map[value].add(attribute)
    }
  }

  return map
}

/**
 * @param {string} attribute
 *   Key.
 * @returns {boolean}
 *   Whether the attribute should be ignored.
 */
function ignoreAttribute(attribute) {
  if (ariaAttributes.includes(attribute) || isEventHandler(attribute)) {
    return true
  }

  const colonIndex = attribute.indexOf(':')
  const namespace =
    colonIndex === -1 ? undefined : attribute.slice(0, colonIndex)

  // Ignore some namespaces.
  if (namespace === 'ev' || namespace === 'xlink' || namespace === 'xml') {
    return true
  }

  return false
}
