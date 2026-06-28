// Regression script for the wake-up banner bug: "🌱 Bloomspace is waking up…" stayed
// visible for 40+ minutes. Root cause: fetchFlowers() had no request timeout, so a
// hung connection to a sleeping backend never resolved or rejected the promise — the
// .finally() block that clears the banner never ran. This drives the real app with
// Playwright (mocking the network) and asserts the banner always clears within a
// bounded time, in every scenario.
//
// Usage:
//   1. Start the client dev server in another terminal: npm run dev
//   2. node scripts/test-wakeup-banner.js
//      (optionally: BASE_URL=http://localhost:5173 node scripts/test-wakeup-banner.js)
//
// Requires the `playwright` devDependency (and its browsers) to be installed:
//   npx playwright install chromium

import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

function emptyFlowersResponse() {
  return { status: 200, contentType: 'application/json', body: '[]' };
}

async function gotoGarden(page) {
  await page.goto(`${BASE_URL}/garden`, { waitUntil: 'domcontentloaded' });
}

async function bannerVisible(page) {
  return (await page.locator('body').innerText()).includes('Bloomspace is waking up');
}

async function retryNoticeVisible(page) {
  return (await page.locator('body').innerText()).includes('Try again');
}

async function runScenario({ name, routeHandler, checks }) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.route('**/api/flowers', routeHandler);
  await gotoGarden(page);

  const result = await checks(page);
  await browser.close();

  return { name, ...result, consoleErrors };
}

async function main() {
  const results = [];

  // 1. Fast, successful fetch — banner should never appear at all.
  results.push(await runScenario({
    name: 'fast success never shows banner',
    routeHandler: async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill(emptyFlowersResponse());
        return;
      }
      await route.continue();
    },
    checks: async page => {
      await page.waitForTimeout(1000);
      const bannerEarly = await bannerVisible(page);
      await page.waitForTimeout(6000); // past the 5s threshold, to be sure it never sneaks in late
      const bannerLate = await bannerVisible(page);
      return { pass: !bannerEarly && !bannerLate, detail: `bannerEarly=${bannerEarly} bannerLate=${bannerLate}` };
    },
  }));

  // 2. Slow (>5s) but eventually successful fetch — banner shows, then clears.
  results.push(await runScenario({
    name: 'slow fetch (>5s) shows banner, then clears on success',
    routeHandler: async route => {
      if (route.request().method() === 'GET') {
        await new Promise(r => setTimeout(r, 6500));
        await route.fulfill(emptyFlowersResponse());
        return;
      }
      await route.continue();
    },
    checks: async page => {
      await page.waitForTimeout(2000);
      const before5s = await bannerVisible(page);
      await page.waitForTimeout(4500);
      const after5s = await bannerVisible(page);
      await page.waitForTimeout(2000);
      const afterResolved = await bannerVisible(page);
      return {
        pass: !before5s && after5s && !afterResolved,
        detail: `before5s=${before5s} after5s=${after5s} afterResolved=${afterResolved}`,
      };
    },
  }));

  // 3. Fast failure — banner never shows; retry notice shows instead.
  results.push(await runScenario({
    name: 'fast failure shows retry notice, never the banner',
    routeHandler: async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({ status: 500, body: '{}' });
        return;
      }
      await route.continue();
    },
    checks: async page => {
      await page.waitForTimeout(1000);
      const banner = await bannerVisible(page);
      const retry = await retryNoticeVisible(page);
      return { pass: !banner && retry, detail: `banner=${banner} retry=${retry}` };
    },
  }));

  // 4. The actual reported bug: a connection that never resolves or rejects on its own.
  // fetchFlowers()'s 30s client-side timeout must kick in and settle the promise so the
  // banner clears — without it, this would hang indefinitely (the 40+ minute bug).
  results.push(await runScenario({
    name: 'hung connection — client timeout clears banner & shows retry (slow, ~30s)',
    routeHandler: async route => {
      if (route.request().method() === 'GET') {
        // Never call route.fulfill/continue — simulates a connection that hangs forever.
        await new Promise(() => {});
        return;
      }
      await route.continue();
    },
    checks: async page => {
      await page.waitForTimeout(6000);
      const bannerWhileHanging = await bannerVisible(page);
      // Wait past the 30s client-side timeout in fetchFlowers().
      await page.waitForTimeout(27000);
      const bannerAfterTimeout = await bannerVisible(page);
      const retryAfterTimeout = await retryNoticeVisible(page);
      return {
        pass: bannerWhileHanging && !bannerAfterTimeout && retryAfterTimeout,
        detail: `bannerWhileHanging=${bannerWhileHanging} bannerAfterTimeout=${bannerAfterTimeout} retryAfterTimeout=${retryAfterTimeout}`,
      };
    },
  }));

  let allPassed = true;
  for (const r of results) {
    allPassed = allPassed && r.pass && r.consoleErrors.length === 0;
    console.log(`[${r.pass ? 'PASS' : 'FAIL'}] ${r.name}: ${r.detail}`);
    if (r.consoleErrors.length) console.log('  console errors:', r.consoleErrors.join('; '));
  }

  if (!allPassed) {
    console.error('\nFAIL: the wake-up banner is not behaving correctly in every scenario.');
    process.exitCode = 1;
    return;
  }
  console.log('\nPASS: the wake-up banner always clears — on fast success, slow success, fast failure, and even a fully hung connection.');
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
