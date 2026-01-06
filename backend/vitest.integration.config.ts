import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/integration/**/*.test.ts'],
        setupFiles: ['tests/integration/setup.ts'],
        testTimeout: 30000,
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
