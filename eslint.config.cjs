// require js from '@eslint/js'
// require typescript from '@typescript-eslint/eslint-plugin'
// require typescriptParser from '@typescript-eslint/parser'
// require svelte from 'eslint-plugin-svelte'
// require svelteParser from 'svelte-eslint-parser'

const js = require('@eslint/js')
const typescript = require('@typescript-eslint/eslint-plugin')
const typescriptParser = require('@typescript-eslint/parser')
const svelte = require('eslint-plugin-svelte')
const svelteParser = require('svelte-eslint-parser')

module.exports = [
  js.configs.recommended,
  {
    files: [`**/*.{js,ts,svelte}`],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: `module`,
      globals: {
        browser: `readonly`,
        node: `readonly`,
        window: `readonly`,
        document: `readonly`,
        console: `readonly`,
        fetch: `readonly`,
        localStorage: `readonly`,
        sessionStorage: `readonly`,
        location: `readonly`,
        process: `readonly`,
        setTimeout: `readonly`,
        clearTimeout: `readonly`,
        setInterval: `readonly`,
        clearInterval: `readonly`,
        URLSearchParams: `readonly`,
        FileReader: `readonly`,
        Buffer: `readonly`,
        Response: `readonly`,
        HTMLElement: `readonly`,
        HTMLDivElement: `readonly`,
        HTMLInputElement: `readonly`,
        HTMLLabelElement: `readonly`,
        KeyboardEvent: `readonly`,
        Event: `readonly`,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: `module`,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      svelte: svelte,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...svelte.configs.recommended.rules,
      indent: [`error`, 2, { SwitchCase: 1 }],
      quotes: [`error`, `backtick`, { avoidEscape: true }],
      semi: [`error`, `never`],
      'linebreak-style': [`error`, `unix`],
      'no-console': [`error`, { allow: [`warn`, `error`] }],
      'no-var': `error`,
      '@typescript-eslint/no-inferrable-types': `off`,
      '@typescript-eslint/no-unused-vars': [
        `error`,
        { argsIgnorePattern: `^_`, varsIgnorePattern: `^_` },
      ],
      'svelte/no-at-html-tags': `off`,
      'no-inner-declarations': `off`,
    },
  },
  {
    files: [`**/*.svelte`],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: typescriptParser,
      },
    },
  },
  {
    files: [`**/*.d.ts`],
    rules: {
      quotes: `off`,
    },
  },
  {
    files: [`tests/**/*`, `**/*.test.{js,ts}`],
    rules: {
      'no-console': `off`, // Allow console statements in test files
      '@typescript-eslint/no-explicit-any': `warn`, // Relax any usage in tests
    },
  },
  {
    ignores: [`build/`, `dist/`, `.svelte-kit/`, `node_modules/`, `*.config.*`],
  },
]
