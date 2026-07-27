/**
 @import {FlatXoConfig} from 'xo'
 */

/** @type {FlatXoConfig} */
const xoConfig = [
  {
    name: 'default',
    prettier: 'compat',
    rules: {
      'jsdoc/check-indentation': 'off',
      'jsdoc/check-line-alignment': 'off',
      'jsdoc/require-asterisk-prefix': 'off',
      'no-shadow': 'off',
      'prefer-arrow-callback': 'off',
      'require-unicode-regexp': 'off',
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/no-array-sort': 'off',
      'unicorn/no-break-in-nested-loop': 'off',
      'unicorn/prefer-includes-over-repeated-comparisons': 'off',
      'unicorn/require-array-sort-compare': 'off'
    },
    space: true
  },
  {
    name: 'generated',
    files: ['index.js'],
    rules: {'max-lines': 'off'}
  },
  {
    name: 'test',
    files: ['test.js'],
    rules: {
      'no-await-in-loop': 'off',
      'node-test/no-conditional-assertion': 'off',
      'prefer-arrow-callback': 'off'
    }
  }
]

export default xoConfig
