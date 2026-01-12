import js from '@eslint/js';
import next from 'eslint-config-next';

export default [
  js.configs.recommended,
  {
    ignores: ['node_modules', '.next', 'out', 'dist', 'backend', 'archives']
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn'
    }
  }
];
