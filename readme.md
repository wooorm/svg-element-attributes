# svg-element-attributes

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Map of SVG elements to allowed attributes.
Also contains global attributes under `'*'`.

Includes attributes from [SVG 1.1][1.1], [SVG Tiny 1.2][1.2], and [SVG 2][2.0].

> **Note**: Does not include ARIA attributes (`role`, `aria-*`), `xml:*` or
> `xlink:*` attributes, event attributes (`on*`), or `ev:event`.

## Install

This package is ESM only: Node 12+ is needed to use it and it must be `import`ed
instead of `require`d.

[npm][]:

```sh
npm install svg-element-attributes
```

## Use

```js
import {svgElementAttributes} from 'svg-element-attributes'

console.log(svgElementAttributes['*'])
console.log(svgElementAttributes.circle)
```

Yields:

```js
[
  'about',
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
[
  'alignment-baseline',
  'baseline-shift',
  'clip',
  'clip-path',
  'clip-rule',
  // …
  'transform',
  'unicode-bidi',
  'visibility',
  'word-spacing',
  'writing-mode' ]
```

## API

This package exports the following identifiers: `svgElementAttributes`.
There is no default export.

### `svgElementAttributes`

`Object.<Array.<string>>` — Map of tag names to an array of attribute names.

The object contains one special key: `'*'`, which contains global attributes
that apply to all SVG elements.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://github.com/wooorm/svg-element-attributes/workflows/main/badge.svg

[build]: https://github.com/wooorm/svg-element-attributes/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/wooorm/svg-element-attributes.svg

[coverage]: https://codecov.io/github/wooorm/svg-element-attributes

[downloads-badge]: https://img.shields.io/npm/dm/svg-element-attributes.svg

[downloads]: https://www.npmjs.com/package/svg-element-attributes

[size-badge]: https://img.shields.io/bundlephobia/minzip/svg-element-attributes.svg

[size]: https://bundlephobia.com/result?p=svg-element-attributes

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[1.1]: https://www.w3.org/TR/SVG/attindex.html

[1.2]: https://www.w3.org/TR/SVGTiny12/attributeTable.html

[2.0]: https://www.w3.org/TR/SVG2/attindex.html
