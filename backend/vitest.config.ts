import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/unit/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules', 'dist', 'tests'],
        },
    },
    resolve: {
        alias: {
            '@domain': './src/domain',
            '@application': './src/application',
            '@infrastructure': './src/infrastructure',
            '@presentation': './src/presentation',
        },
    },
});
