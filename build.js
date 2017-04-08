'use strict';

var fs = require('fs');
var jsdom = require('jsdom');
var bail = require('bail');
var ev = require('hast-util-is-event-handler');

var actual = 0;
var expected = 3;

var all = {};

/* Crawl SVG 1.1. */
jsdom.env('https://www.w3.org/TR/SVG/attindex.html', function (err, win) {
  bail(err);

  var map = {};
  var rows = win.document.querySelectorAll('.property-table tr');
  var position = -1;
  var length = rows.length;
  var node;
  var name;
  var elements;

  while (++position < length) {
    node = rows[position];
    name = node.querySelector('.attr-name');
    elements = node.querySelectorAll('.element-name');

    if (!name || elements.length === 0) {
      continue;
    }

    elements = [].map.call(elements, clean).forEach(add(map, clean(name)));
  }

  done(map);

  function clean(node) {
    return node.textContent.replace(/[‘’]/g, '');
  }
});

/* Crawl SVG Tiny 1.2. */
jsdom.env('https://www.w3.org/TR/SVGTiny12/attributeTable.html', function (err, win) {
  bail(err);

  var map = {};
  var doc = win.document;
  var rows = doc.querySelectorAll('#attributes .attribute');
  var position = 0;
  var length = rows.length;
  var name;
  var elements;

  while (++position < length) {
    name = clean(rows[position].querySelector('.attribute-name'));
    elements = rows[position].querySelectorAll('.element');
    elements = [].map.call(elements, clean).forEach(add(map, name));
  }

  done(map);

  function clean(node) {
    return node.textContent;
  }
});

/* Crawl SVG 2. */
jsdom.env('https://www.w3.org/TR/SVG2/attindex.html', function (err, win) {
  bail(err);

  var map = {};
  var doc = win.document;
  var heading = doc.getElementById('RegularAttributes');
  var table = heading.nextElementSibling.nextElementSibling;
  var rows = table.querySelectorAll('tbody tr');
  var position = 0;
  var length = rows.length;
  var name;
  var elements;

  while (++position < length) {
    name = clean(rows[position].querySelector('.attr-name span'));
    elements = rows[position].querySelectorAll('.element-name span');
    elements = [].map.call(elements, clean).forEach(add(map, name));
  }

  done(map);

  function clean(node) {
    return node.textContent;
  }
});

/* Add a map. */
function done(map) {
  merge(all, clean(map));
  cleanAll(all);

  actual++;

  if (actual === expected) {
    fs.writeFile('index.json', JSON.stringify(all, 0, 2) + '\n', bail);
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
    return noop;
  }

  return fn;

  function fn(tagName) {
    var attributes = map[tagName] || (map[tagName] = []);

    if (attributes.indexOf(name) === -1) {
      attributes.push(name);
    }
  }

  function noop() {}
}

function clean(map) {
  var result = {};
  var list = [];
  var globals = [];

  /* Find all used attributes. */
  Object.keys(map).forEach(function (tagName) {
    map[tagName].forEach(function (attribute) {
      if (list.indexOf(attribute) === -1) {
        list.push(attribute);
      }
    });
  });

  /* Find global attributes. */
  list.forEach(function (attribute) {
    var global = true;
    var key;

    for (key in map) {
      if (map[key].indexOf(attribute) === -1) {
        global = false;
        break;
      }
    }

    if (global) {
      globals.push(attribute);
    }
  });

  /* Remove globals. */
  result = {
    '*': globals
  };

  Object.keys(map)
    .sort()
    .forEach(function (tagName) {
      var attributes = map[tagName]
        .filter(function (attribute) {
          return globals.indexOf(attribute) === -1;
        })
        .sort();

      if (attributes.length !== 0) {
        result[tagName] = attributes;
      }
    });

  return result;
}

function merge(left, right) {
  Object.keys(right)
    .forEach(function (tagName) {
      left[tagName] = (left[tagName] || [])
        .concat(right[tagName])
        .filter(function (attribute, index, list) {
          return list.indexOf(attribute) === index;
        })
        .sort();
    });
}

function cleanAll(map) {
  var globals = map['*'];

  Object.keys(map)
    .forEach(function (tagName) {
      if (tagName !== '*') {
        map[tagName] = map[tagName]
          .filter(function (attribute) {
            return globals.indexOf(attribute) === -1;
          });
      }
    });
}
