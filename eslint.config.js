module.exports = [
    {
        ignores: ['node_modules/**', 'carga-rendimiento.js', 'jest.config.js'],
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
        },
        rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            'no-unused-vars': 'warn',
            'comma-dangle': ['error', 'always-multiline'],
        },
    },
];