import { defineConfig } from '@playwright/test';

export default defineConfig({
    timeout: 120_000,            // per-test timeout (also applies to hooks and fixtures)
    globalTimeout: 2 * 60_000, // whole run
    // expect: {
    //     timeout: 5_000,           // auto-retrying assertions
    // },
    use: {
        actionTimeout: 3_000,     // click, fill, etc.
        navigationTimeout: 10_000, // goto, waitForURL, reload, etc.
        launchOptions: {
            timeout: 30_000,         // browser launch
        },
    }
});
