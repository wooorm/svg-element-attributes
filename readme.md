# svg-element-attributes [![Build Status][build-badge]][build-page]

Map of SVG elements to allowed attributes.  Also contains global
attributes under `'*'`.

Includes attributes from [SVG 1.1][1.1], [SVG Tiny 1.2][1.2], and [SVG 2][2.0].

> **Note**: Does not include ARIA attributes (`role`, `aria-*`),
> `xml:*` or `xlink:*` attributes, event attributes (`on*`), or
> `ev:event`.

## Installation

[npm][]:

```bash
npm install svg-element-attributes
```

## Usage

```javascript
var svgElementAttributes = require('svg-element-attributes');

console.log(svgElementAttributes['*']);
console.log(svgElementAttributes.circle);
```

Yields:

```js
[ 'about',
  'class',
  'content',
  'datatype',
  'id',
  'lang',
  'property',
  'rel',
  'resource',
  'rev',
  'tabindex',
  'typeof' ]
[ 'alignment-baseline',
  'cx',
  'cy',
  'externalResourcesRequired',
  'focusHighlight',
  'focusable',
  'nav-down',
  'nav-down-left',
  'nav-down-right',
  'nav-left',
  'nav-next',
  'nav-prev',
  'nav-right',
  'nav-up',
  'nav-up-left',
  'nav-up-right',
  'pathLength',
  'r',
  'requiredExtensions',
  'requiredFeatures',
  'requiredFonts',
  'requiredFormats',
  'style',
  'systemLanguage',
  'transform' ]
```

## API

### `svgElementAttributes`

`Object.<Array.<string>>` — Map of lower-case tag-names to an array of
attribute names.

The object contains one special key: `'*'`, which contains global
attributes that apply to all SVG elements.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://img.shields.io/travis/wooorm/svg-element-attributes.svg

[build-page]: https://travis-ci.org/wooorm/svg-element-attributes

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[1.1]: https://www.w3.org/TR/SVG/attindex.html

[1.2]: https://www.w3.org/TR/SVGTiny12/attributeTable.html

[2.0]: https://www.w3.org/TR/SVG2/attindex.html
