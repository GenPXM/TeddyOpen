import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettier,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },
  },
];
