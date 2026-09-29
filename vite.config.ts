import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'astro:middleware': fileURLToPath(
        new URL('./src/tests/stubs/astro-middleware.ts', import.meta.url)
      ),
    },
  },
  fmt: {
    useTabs: false,
    tabWidth: 2,
    printWidth: 100,
    singleQuote: true,
    jsxSingleQuote: false,
    quoteProps: 'as-needed',
    trailingComma: 'es5',
    semi: false,
    arrowParens: 'always',
    bracketSameLine: false,
    bracketSpacing: true,
    ignorePatterns: ['**/*.md', '**/*.mdx', '**/*.yml', '**/*.yaml', '**/*.toml'],
  },
  lint: {
    plugins: ['typescript', 'unicorn', 'oxc', 'react', 'jsx-a11y', 'import'],
    categories: {
      correctness: 'error',
      suspicious: 'warn',
      perf: 'warn',
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-async-promise-executor': 'error',
      'no-dupe-keys': 'error',
      'prefer-const': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react/no-array-index-key': 'warn',
      'react/button-has-type': 'warn',
      'react/no-danger': 'warn',
      'react/react-in-jsx-scope': 'off',
      'no-underscore-dangle': 'off',
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    env: {
      builtin: true,
      browser: true,
    },
    overrides: [
      {
        files: ['**/*.astro'],
        rules: {
          'import/no-unassigned-import': 'off',
        },
      },
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: 'vite-plus',
        specifier: 'vite-plus/oxlint-plugin',
      },
    ],
  },
  staged: {
    '*.{js,jsx,ts,tsx}': ['vp lint --fix', 'vp fmt'],
    '*.astro': 'vp lint --fix',
    'src/**/*.{json,css,scss}': 'vp fmt',
  },
})
