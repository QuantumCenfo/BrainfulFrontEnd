import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: 'tests/e2e',
    timeout: 60_000,
    use: {
        baseURL: 'http://localhost:4200',
        trace: 'on-first-retry',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        { name: 'setup', testMatch: /auth\.setup\.ts/ },

        { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], storageState: 'storage/state.json' }, dependencies: ['setup'] },
        { name: 'mobile-chrome',   use: { ...devices['Pixel 7'], storageState: 'storage/state.json' }, dependencies: ['setup'] },
    ],
    webServer: [
        {
        command: 'npm run start -- --host 0.0.0.0 --port 4200',
        url: 'http://localhost:4200',
        reuseExistingServer: true,
        timeout: 120_000
        }
    ],
    reporter: [['junit', { outputFile: 'test-results/junit.xml' }], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
});
