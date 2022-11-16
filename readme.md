# svg-element-attributes

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]

Map of SVG elements to allowed attributes.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`svgElementAttributes`](#svgelementattributes)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This is a map of tag names to lists of allowed attributes.
Global attributes are stored at the special tag name `*`.
All attributes from [SVG 1.1][1.1], [SVG Tiny 1.2][1.2], and [SVG 2][2.0] are
included.

> 👉 **Note**: Includes deprecated attributes.

> 👉 **Note**: ARIA (`role`, `aria-*`), event (`ev:event`, `on*`), or `xml:*`
> and `xlink:*` attributes are not included.

## When should I use this?

You can use this to figure out if certain attributes are allowed on certain
SVG elements.

## Install

This package is [ESM only][esm].
In Node.js (version 14.14+, 16.0+), install with [npm][]:

```sh
npm install svg-element-attributes
```

In Deno with [`esm.sh`][esmsh]:

```js
import {svgElementAttributes} from 'https://esm.sh/svg-element-attributes@2'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {svgElementAttributes} from 'https://esm.sh/svg-element-attributes@2?bundle'
</script>
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

This package exports the identifier `svgElementAttributes`.
There is no default export.

### `svgElementAttributes`

Map of lowercase SVG elements to allowed attributes
(`Record<string, Array<string>>`).

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

This package is at least compatible with all maintained versions of Node.js.
As of now, that is Node.js 14.14+ and 16.0+.
It also works in Deno and modern browsers.

## Security

This package is safe.

## Related

*   [`wooorm/web-namespaces`](https://github.com/wooorm/web-namespaces)
    — list of web namespaces
*   [`wooorm/html-tag-names`](https://github.com/wooorm/html-tag-names)
    — list of HTML tag names
*   [`wooorm/mathml-tag-names`](https://github.com/wooorm/mathml-tag-names)
    — list of MathML tag names
*   [`wooorm/svg-tag-names`](https://github.com/wooorm/svg-tag-names)
    — list of SVG tag names
*   [`wooorm/html-void-elements`](https://github.com/wooorm/html-void-elements)
    — list of void HTML tag names
*   [`wooorm/html-element-attributes`](https://github.com/wooorm/html-element-attributes)
    — map of HTML elements to attributes
*   [`wooorm/aria-attributes`](https://github.com/wooorm/aria-attributes)
    — list of ARIA attributes

## Contribute

Yes please!
See [How to Contribute to Open Source][contribute].

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

[esmsh]: https://esm.sh

[license]: license

[author]: https://wooorm.com

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[contribute]: https://opensource.guide/how-to-contribute/

[1.1]: https://www.w3.org/TR/SVG/attindex.html

[1.2]: https://www.w3.org/TR/SVGTiny12/attributeTable.html

[2.0]: https://www.w3.org/TR/SVG2/attindex.html
