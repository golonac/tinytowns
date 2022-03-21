module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  ignorePatterns: ['projects/**/*', 'polyfills.ts', 'test.ts'],
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:import/warnings',
      ],
      rules: {
        'import/order': ['error'],
        quotes: ['error', 'single'],
        'eol-last': ['error', 'never'],
        'no-trailing-spaces': 'error',
        'comma-dangle': ['error', 'always-multiline'],
        'spaced-comment': ['error', 'always', { line: { markers: ['/'] } }],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { vars: 'all', args: 'none' },
        ],
        semi: ['error', 'never'],
        'prefer-const': 'error',
        'object-curly-spacing': ['error', 'always'],
        'computed-property-spacing': ['error', 'never'],
        'array-bracket-spacing': ['error', 'never'],
        'comma-spacing': ['error', { before: false, after: true }],
        'space-in-parens': ['error', 'never'],
        'no-multi-spaces': 'error',
        'key-spacing': [
          'error',
          { beforeColon: false, afterColon: true, mode: 'strict' },
        ],
        'space-infix-ops': ['error', { int32Hint: false }],
        'space-unary-ops': ['error', { words: true, nonwords: false }],
        'keyword-spacing': ['error', { before: true, after: true }],
        '@angular-eslint/directive-selector': [
          'error',
          { type: 'attribute', prefix: 'app', style: 'camelCase' },
        ],
        '@angular-eslint/component-selector': [
          'error',
          { type: 'element', prefix: 'app', style: 'kebab-case' },
        ],
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {},
    },
  ],
}
