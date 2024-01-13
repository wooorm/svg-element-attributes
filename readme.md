# svg-element-attributes

[![Build][badge-build-image]][badge-build-url]
[![Coverage][badge-coverage-image]][badge-coverage-url]
[![Downloads][badge-downloads-image]][badge-downloads-url]
[![Size][badge-size-image]][badge-size-url]

Map of SVG elements to allowed attributes.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`svgElementAttributes`](#svgelementattributes)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This is a map of tag names to lists of allowed attributes.
Global attributes are stored at the special tag name `*`.
All attributes from [SVG 1.1][w3-svg-1.1], [SVG Tiny 1.2][w3-svg-1.2], and
[SVG 2][w3-svg-2.0] are included.

> 👉 **Note**: Includes deprecated attributes.

> 👉 **Note**: ARIA (`role`, `aria-*`), event (`ev:event`, `on*`), or `xml:*`
> and `xlink:*` attributes are not included.

## When should I use this?

You can use this to figure out if certain attributes are allowed on certain
SVG elements.

## Install

This package is [ESM only][github-gist-esm].
In Node.js (version 16+),
install with [npm][npm-install]:

```sh
npm install svg-element-attributes
```

In Deno with [`esm.sh`][esm-sh]:

```js
import {svgElementAttributes} from 'https://esm.sh/svg-element-attributes@2'
```

In browsers with [`esm.sh`][esm-sh]:

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

This package exports the identifier
[`svgElementAttributes`][api-svg-element-attributes].
There is no default export.

It exports no [TypeScript][] types.

### `svgElementAttributes`

Map of SVG elements to allowed attributes (`Record<string, Array<string>>`).

## Compatibility

This projects is compatible with maintained versions of Node.js.

When we cut a new major release,
we drop support for unmaintained versions of Node.
This means we try to keep the current release line,
`svg-element-attributes@2`,
compatible with Node.js 12.

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
See [How to Contribute to Open Source][open-source-guide-contribute].

## License

[MIT][file-license] © [Titus Wormer][wooorm]

<!-- Definition -->

[api-svg-element-attributes]: #svgelementattributes

[badge-build-image]: https://github.com/wooorm/svg-element-attributes/workflows/main/badge.svg

[badge-build-url]: https://github.com/wooorm/svg-element-attributes/actions

[badge-coverage-image]: https://img.shields.io/codecov/c/github/wooorm/svg-element-attributes.svg

[badge-coverage-url]: https://codecov.io/github/wooorm/svg-element-attributes

[badge-downloads-image]: https://img.shields.io/npm/dm/svg-element-attributes.svg

[badge-downloads-url]: https://www.npmjs.com/package/svg-element-attributes

[badge-size-image]: https://img.shields.io/bundlejs/size/svg-element-attributes

[badge-size-url]: https://bundlejs.com/?q=svg-element-attributes

[esm-sh]: https://esm.sh

[file-license]: license

[github-gist-esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[npm-install]: https://docs.npmjs.com/cli/install

[open-source-guide-contribute]: https://opensource.guide/how-to-contribute/

[typescript]: https://www.typescriptlang.org

[w3-svg-1.1]: https://www.w3.org/TR/SVG/attindex.html

[w3-svg-1.2]: https://www.w3.org/TR/SVGTiny12/attributeTable.html

[w3-svg-2.0]: https://www.w3.org/TR/SVG2/attindex.html

[wooorm]: https://wooorm.com
