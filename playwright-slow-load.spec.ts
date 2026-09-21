import { test, expect } from '@playwright/test';

// Slow-loading "has title" — the page load is throttled so the screencast's
// first frame appears late, leaving a big empty leading gap before the first
// thumbnail in the film strip. Tuned to load slowly but still SUCCEED, so the
// captured screenshots are real (not blank). Max timeout: 1 minute.
test('has title (slow load)', async ({ page }) => {
  test.setTimeout(60000); // 1 minute max

  // Throttle the network via CDP (Chromium only): delays first paint (late first
  // frame => leading gap) without pushing the load past the timeout.
  const client = await page.context().newCDPSession(page);
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 300,
    downloadThroughput: (1 * 1024 * 1024) / 8, // ~1 Mbps
    uploadThroughput: (1 * 1024 * 1024) / 8,
  });
  await client.send('Emulation.setCPUThrottlingRate', { rate: 2 });

  await page.goto('https://playwright.dev/', { waitUntil: 'load', timeout: 45000 });
  await expect(page).toHaveTitle(/Playwright/);
});
