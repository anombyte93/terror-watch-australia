import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-plugin-prettier';
import svelte from 'eslint-plugin-svelte';
import tseslint from 'typescript-eslint';

const projectFiles = ['./tsconfig.json'];

export default [
	{
		ignores: ['.svelte-kit', 'build', 'drizzle', 'node_modules', 'eslint.config.js']
	},
	js.configs.recommended,
	...tseslint.configs.recommendedTypeChecked.map((config) => ({
		...config,
		languageOptions: {
			...config.languageOptions,
			parserOptions: {
				...config.languageOptions?.parserOptions,
				project: projectFiles,
				tsconfigRootDir: import.meta.dirname
			}
		}
	})),
	...svelte.configs['flat/recommended'],
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelte.parser,
			parserOptions: {
				project: projectFiles,
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.svelte'],
				parser: tseslint.parser
			}
		}
	},
	{
		files: ['**/*.{js,ts,svelte}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		plugins: { prettier },
		rules: {
			'prettier/prettier': 'error',
			'svelte/no-navigation-without-resolve': 'off'
		}
	}
];
