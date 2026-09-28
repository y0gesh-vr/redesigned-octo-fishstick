import { defineConfig } from '@playwright/test';

export default defineConfig({
    timeout: 30_000,            // per-test timeout (also applies to hooks and fixtures)
    globalTimeout: 60 * 60_000, // whole run
    expect: {
        timeout: 8_000,           // auto-retrying assertions
    },
    use: {
        actionTimeout: 10_000,     // click, fill, etc.
        navigationTimeout: 30_000, // goto, waitForURL, reload, etc.
        launchOptions: {
            timeout: 30_000,         // browser launch
        },
    },
    // webServer: {
    //     command: 'npm run start',
    //     url: 'http://localhost:3000',
    //     timeout: 120_000,          // dev server startup
    // },
});
