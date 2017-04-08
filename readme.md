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

var globals = svgElementAttributes['*'];
```

Yields:

```js
[ 'class',
  'content',
  'datatype',
  'id',
  'property',
  'rel',
  'resource',
  'rev',
  'typeof',
  'lang',
  'tabindex' ]
```

Attributes on the `circle` element:

```javascript
var circle = svgElementAttributes.circle;
```

Yields:

```js
[ 'cx',
  'cy',
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
  'r',
  'requiredExtensions',
  'requiredFeatures',
  'requiredFonts',
  'requiredFormats',
  'systemLanguage',
  'transform',
  'alignment-baseline',
  'externalResourcesRequired',
  'style',
  'pathLength' ]
```

## API

### `svgElementAttributes`

`Object.<Array.<string>>` — Map of lower-case tag-names to an array of
lower-case attribute names.

The object contains one special key: `'*'`, which contains global
attributes which apply to all SVG elements.

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
