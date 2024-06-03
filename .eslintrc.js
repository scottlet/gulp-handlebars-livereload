module.exports = {
  env: {
    node: true,
    mocha: true,
    es6: true
  },
  plugins: ['import', 'jsdoc', 'prettier'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx']
      },
      alias: {
        map: [['~', './src/js/modules/']]
      }
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'plugin:jsdoc/recommended'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: '2020'
  },
  rules: {
    'array-bracket-spacing': 1,
    'arrow-parens': [2, 'as-needed'],
    'block-scoped-var': 2,
    'block-spacing': 2,
    'brace-style': 2,
    camelcase: 2,
    'comma-dangle': 2,
    'comma-spacing': [
      1,
      {
        before: false,
        after: true
      }
    ],
    complexity: [1, 6],
    'consistent-return': 2,
    'dot-notation': 2,
    'eol-last': 2,
    'func-call-spacing': [2, 'never'],
    'func-style': [2, 'declaration'],
    indent: [2, 2],
    'lines-around-directive': 2,
    'max-len': [1, 120],
    'new-cap': 0,
    'newline-after-var': 2,
    'newline-before-return': 2,
    'newline-per-chained-call': [2, { ignoreChainWithDepth: 2 }],
    'no-alert': 1,
    'no-empty-function': 2,
    'no-else-return': 2,
    'no-eval': 2,
    'no-extend-native': 2,
    'no-loop-func': 2,
    'no-magic-numbers': [
      2,
      {
        enforceConst: true,
        ignoreArrayIndexes: true,
        ignore: [
          -1, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0, 1, 2, 3, 4, 5, 6,
          7, 8, 9, 10, 50, 100, 120, 255, 256, 500, 512, 1000
        ]
      }
    ],
    'no-multi-spaces': 2,
    'no-multiple-empty-lines': 2,
    'no-redeclare': 1,
    'no-trailing-spaces': 2,
    'no-underscore-dangle': 2,
    'no-unused-expressions': 2,
    'no-unused-vars': [
      2,
      {
        args: 'none'
      }
    ],
    'no-useless-return': 2,
    'object-curly-spacing': [2, 'always'],
    'object-shorthand': 2,
    'one-var': [2, 'never'],
    'padding-line-between-statements': [
      2,
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: '*', next: 'block-like' }
    ],
    'prefer-arrow-callback': 2,
    'prefer-const': 2,
    quotes: [2, 'single', 'avoid-escape'],
    radix: [2, 'as-needed'],
    'space-infix-ops': 2,
    'linebreak-style': [1, 'unix'],
    semi: [2, 'always'],
    'space-before-function-paren': [
      2,
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'keyword-spacing': 2,
    'space-before-blocks': 2,
    'no-var': 2,
    strict: [2, 'global'],
    'valid-jsdoc': 2,
    'vars-on-top': 1,
    'import/no-unresolved': [2],
    'jsdoc/no-undefined-types': [
      1,
      {
        definedTypes: ['NodeJS']
      }
    ]
  }
};
