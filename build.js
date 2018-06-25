'use strict'

var fs = require('fs')
var https = require('https')
var bail = require('bail')
var concat = require('concat-stream')
var alphaSort = require('alpha-sort')
var unified = require('unified')
var parse = require('rehype-parse')
var q = require('hast-util-select')
var toString = require('hast-util-to-string')
var ev = require('hast-util-is-event-handler')

var proc = unified().use(parse)

var actual = 0
var expected = 3

var all = {}

https.get('https://www.w3.org/TR/SVG/attindex.html', onsvg1)
https.get('https://www.w3.org/TR/SVGTiny12/attributeTable.html', ontiny)
https.get('https://www.w3.org/TR/SVG2/attindex.html', onsvg2)

function onsvg1(res) {
  res.pipe(concat(onconcat)).on('error', bail)

  function onconcat(buf) {
    var tree = proc.parse(buf)
    var map = {}
    var nodes = q.selectAll('.property-table tr', tree)

    if (nodes.length === 0) {
      throw new Error('Couldn’t find rows in SVG 1')
    }

    nodes.forEach(each)

    done(map)

    function each(node) {
      var elements = q.selectAll('.element-name', node)

      q.selectAll('.attr-name', node).forEach(every)

      function every(name) {
        elements
          .map(toString)
          .map(clean)
          .forEach(add(map, clean(toString(name))))
      }
    }

    function clean(value) {
      return value.replace(/[‘’]/g, '')
    }
  }
}

function ontiny(res) {
  res.pipe(concat(onconcat)).on('error', bail)

  function onconcat(buf) {
    var tree = proc.parse(buf)
    var map = {}
    var nodes = q.selectAll('#attributes .attribute', tree)

    if (nodes.length === 0) {
      throw new Error('Couldn’t find nodes in SVG Tiny')
    }

    nodes.forEach(each)

    done(map)

    function each(node) {
      q.selectAll('.element', node)
        .map(toString)
        .forEach(add(map, toString(q.select('.attribute-name', node))))
    }
  }
}

function onsvg2(res) {
  res.pipe(concat(onconcat)).on('error', bail)

  function onconcat(buf) {
    var tree = proc.parse(buf)
    var map = {}
    var nodes = q.selectAll('tbody tr', tree)

    if (nodes.length === 0) {
      throw new Error('Couldn’t find nodes in SVG 2')
    }

    nodes.forEach(each)

    done(map)

    function each(node) {
      q.selectAll('.element-name span', node)
        .map(toString)
        .forEach(add(map, toString(q.select('.attr-name span', node))))
    }
  }
}

/* Add a map. */
function done(map) {
  merge(all, clean(map))
  cleanAll(all)

  actual++

  if (actual === expected) {
    fs.writeFile('index.json', JSON.stringify(sort(all), 0, 2) + '\n', bail)
  }
}

function add(map, name) {
  if (
    ev(name) ||
    name === 'role' ||
    name.slice(0, 5) === 'aria-' ||
    name.slice(0, 3) === 'ev:' ||
    name.slice(0, 4) === 'xml:' ||
    name.slice(0, 6) === 'xlink:'
  ) {
    return noop
  }

  return fn

  function fn(tagName) {
    var attributes = map[tagName] || (map[tagName] = [])

    if (attributes.indexOf(name) === -1) {
      attributes.push(name)
    }
  }

  function noop() {}
}

function clean(map) {
  var result = {}
  var list = []
  var globals = []

  /* Find all used attributes. */
  Object.keys(map).forEach(function(tagName) {
    map[tagName].forEach(function(attribute) {
      if (list.indexOf(attribute) === -1) {
        list.push(attribute)
      }
    })
  })

  /* Find global attributes. */
  list.forEach(function(attribute) {
    var global = true
    var key

    for (key in map) {
      if (map[key].indexOf(attribute) === -1) {
        global = false
        break
      }
    }

    if (global) {
      globals.push(attribute)
    }
  })

  /* Remove globals. */
  result = {
    '*': globals
  }

  Object.keys(map)
    .sort()
    .forEach(function(tagName) {
      var attributes = map[tagName]
        .filter(function(attribute) {
          return globals.indexOf(attribute) === -1
        })
        .sort()

      if (attributes.length !== 0) {
        result[tagName] = attributes
      }
    })

  return result
}

function merge(left, right) {
  Object.keys(right).forEach(each)

  function each(tagName) {
    left[tagName] = (left[tagName] || [])
      .concat(right[tagName])
      .filter(function(attribute, index, list) {
        return list.indexOf(attribute) === index
      })
      .sort()
  }
}

function cleanAll(map) {
  var globals = map['*']

  Object.keys(map).forEach(function(tagName) {
    if (tagName !== '*') {
      map[tagName] = map[tagName].filter(function(attribute) {
        return globals.indexOf(attribute) === -1
      })
    }
  })
}

function sort(map) {
  var result = {}

  Object.keys(map)
    .sort(alphaSort.asc)
    .forEach(function(key) {
      result[key] = map[key]
    })

  return result
}
