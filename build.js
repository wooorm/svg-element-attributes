import assert from 'node:assert/strict'
import fs from 'node:fs'
import https from 'node:https'
import {bail} from 'bail'
import concatStream from 'concat-stream'
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import {ariaAttributes} from 'aria-attributes'
import {select, selectAll} from 'hast-util-select'
import {toString} from 'hast-util-to-string'
import {isEventHandler} from 'hast-util-is-event-handler'

const processor = unified().use(rehypeParse)

const own = {}.hasOwnProperty

const expected = 3

/** @type {Array<Record<string, Set<string>>>} */
const maps = []

https.get('https://www.w3.org/TR/SVG11/attindex.html', (response) => {
  response
    .pipe(
      concatStream((buf) => {
        /** @type {Record<string, Set<string>>} */
        const map = {}
        const tree = processor.parse(buf)
        const rows = selectAll('.property-table tr', tree)
        let index = -1

        if (rows.length === 0) {
          throw new Error('Couldn’t find rows in SVG 1')
        }

        while (++index < rows.length) {
          const row = rows[index]
          const attributes = selectAll('.attr-name', row)
          const elements = selectAll('.element-name', row)
          let elementIndex = -1

          while (++elementIndex < elements.length) {
            const element = toString(elements[elementIndex]).replace(
              /[‘’]/g,
              ''
            )
            let attributeIndex = -1

            if (!own.call(map, element)) {
              map[element] = new Set()
            }

            while (++attributeIndex < attributes.length) {
              const attribute = toString(attributes[attributeIndex]).replace(
                /[‘’]/g,
                ''
              )
              map[element].add(attribute)
            }
          }
        }

        maps.push(map)
        done()
      })
    )
    .on('error', bail)
})

https.get('https://www.w3.org/TR/SVGTiny12/attributeTable.html', (response) => {
  response
    .pipe(
      concatStream((buf) => {
        /** @type {Record<string, Set<string>>} */
        const map = {}
        const tree = processor.parse(buf)
        const rows = selectAll('#attributes .attribute', tree)
        let index = -1

        if (rows.length === 0) {
          throw new Error('Couldn’t find nodes in SVG Tiny')
        }

        while (++index < rows.length) {
          const row = rows[index]
          const name = select('.attribute-name', row)
          assert(name, 'expected `name`')
          const attribute = toString(name)
          const elements = selectAll('.element', row)
          let elementIndex = -1

          while (++elementIndex < elements.length) {
            const element = toString(elements[elementIndex])

            if (!own.call(map, element)) {
              map[element] = new Set()
            }

            map[element].add(attribute)
          }
        }

        maps.push(map)
        done()
      })
    )
    .on('error', bail)
})

https.get('https://www.w3.org/TR/SVG2/attindex.html', (response) => {
  response
    .pipe(
      concatStream((buf) => {
        /** @type {Record<string, Set<string>>} */
        const map = {}
        const tree = processor.parse(buf)
        const rows = selectAll('tbody tr', tree)
        let index = -1

        if (rows.length === 0) {
          throw new Error('Couldn’t find rows in SVG 2')
        }

        while (++index < rows.length) {
          const row = rows[index]
          const name = select('.attr-name span', row)
          assert(name, 'expected `name`')
          const attribute = toString(name)
          const elements = selectAll('.element-name span', row)
          let elementIndex = -1

          while (++elementIndex < elements.length) {
            const element = toString(elements[elementIndex])

            if (!own.call(map, element)) {
              map[element] = new Set()
            }

            map[element].add(attribute)
          }
        }

        maps.push(map)
        done()
      })
    )
    .on('error', bail)
})

/**
 * Add a map.
 */
function done() {
  if (maps.length !== expected) {
    return
  }

  /** @type {Set<string>} */
  const globals = new Set()

  let index = -1
  while (++index < maps.length) {
    const map = maps[index]
    /** @type {Set<string>} */
    let all = new Set()
    /** @type {string} */
    let tagName

    // Ttrack all attributes.
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
        ns === 'ev:' ||
        ns === 'xml:' ||
        ns === 'xlink:'
      )
    })
  }

  fs.writeFile(
    'index.js',
    [
      '/**',
      ' * Map of SVG elements to allowed attributes.',
      ' *',
      ' * @type {Record<string, Array<string>>}',
      ' */',
      'export const svgElementAttributes = ' + JSON.stringify(result, null, 2),
      ''
    ].join('\n'),
    bail
  )
}
