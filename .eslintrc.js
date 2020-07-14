module.exports = {
	root: true,

	parser: '@typescript-eslint/parser',
	parserOptions: {
		tsConfigRootDir: __dirname,
		project: ['./tsconfig.json']
	},

	plugins: [
		'@typescript-eslint',
		'prefer-let',
		'unicorn',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:unicorn/recommended',
	],
	rules: {
		'brace-style': 'off',
		'comma-spacing': 'off',
		'constructor-super': 'off',
		'prefer-const': 'off',

		'@typescript-eslint/brace-style': ['error', '1tbs'],
		'@typescript-eslint/comma-spacing': ['error'],
		'@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true, allowTypedFunctionExpressions: true }],
		'@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
		'@typescript-eslint/member-delimiter-style': ['error', { singleline: { delimiter: 'comma' } }],
		'@typescript-eslint/no-empty-function': ['error', { allow: ['constructors'] }],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
		'@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true, ignoreProperties: true }],
		'@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
		'@typescript-eslint/no-unsafe-assignment': 'warn',
		'@typescript-eslint/require-await': 'off',
		'@typescript-eslint/type-annotation-spacing': ['error', { before: true, after: true }],

		'prefer-let/prefer-let': 'error',

		'unicorn/filename-case': ['error', { cases: { camelCase: true, pascalCase: true } }],
		'unicorn/no-process-exit': 'off',
		'unicorn/prevent-abbreviations': ['error', { whitelist: { attr: true }}],
	},
};
