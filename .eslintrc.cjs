module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'no-shadow': 'off',
    'no-undef': 'off',
    'react-native/no-inline-styles': 'off',
    radix: 'off',
    semi: [2, 'always'],
    'prefer-const': [
      'warn',
      { ignoreReadBeforeAssign: false, destructuring: 'any' },
    ],
    'no-duplicate-imports': ['error', { includeExports: false }],
    '@typescript-eslint/consistent-type-imports': 'off',
    'spaced-comment': 'off',
    'prettier/prettier': 'off',
  },
};
