// Regression script for the duplicate-flower bug: spam-clicking (or Enter-key
// spamming) the "Plant in Garden" confirm button used to fire one POST per click,
// creating 10+ duplicate flowers from a single confirmation. This drives the real
// app with Playwright and asserts only one POST ever reaches the server per attempt.
//
// Usage:
//   1. Start the client dev server in another terminal: npm run dev
//   2. node scripts/test-no-duplicate-submit.js
//      (optionally: BASE_URL=http://localhost:5173 node scripts/test-no-duplicate-submit.js)
//
// Requires the `playwright` devDependency (and its browsers) to be installed:
//   npx playwright install chromium

import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

function fakeFlowerResponse() {
  const now = Date.now();
  return {
    id: now,
    message: 'spam-click regression test',
    author: 'Anonymous Gardener',
    location: '',
    plantedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString(),
    wateredCount: 0,
  };
}

async function mockSlowPlantEndpoint(page) {
  let postCount = 0;
  await page.route('**/api/flowers', async route => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
    postCount += 1;
    // Simulate the slow/cold-start network conditions that originally exposed the bug.
    await new Promise(resolve => setTimeout(resolve, 600));
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(fakeFlowerResponse()),
    });
  });
  return () => postCount;
}

async function drawAndOpenConfirmModal(page, message) {
  await page.goto(`${BASE_URL}/create`, { waitUntil: 'networkidle' });

  const canvas = page.locator('canvas');
  const box = await canvas.boundingBox();
  await page.mouse.move(box.x + 50, box.y + 50);
  await page.mouse.down();
  await page.mouse.move(box.x + 150, box.y + 120, { steps: 8 });
  await page.mouse.move(box.x + 250, box.y + 40, { steps: 8 });
  await page.mouse.up();

  await page.locator('textarea').fill(message);
  await page.getByText('🌼 Plant in the Garden').click();
  await page.waitForSelector('text=Ready to plant this flower?');
}

async function runSynchronousSpamClickScenario(browser) {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('pageerror', err => consoleErrors.push(err.message));

  const getPostCount = await mockSlowPlantEndpoint(page);
  await drawAndOpenConfirmModal(page, 'Synchronous spam-click regression test');

  const confirmButton = await page.waitForSelector('button:has-text("Plant in Garden")');
  // Fire 10 native click() calls synchronously, in the SAME browser task, before React
  // can re-render the disabled attribute. This is the exact race that caused 10+
  // duplicate posts: if the JS-level guard isn't synchronous, every one of these calls
  // would independently invoke handleConfirmPlant.
  await confirmButton.evaluate(btn => {
    for (let i = 0; i < 10; i++) btn.click();
  });

  await page.waitForSelector('text=Your Flower Has Bloomed!', { timeout: 8000 });
  const sessionCount = await page.evaluate(() => sessionStorage.getItem('bloomspaceSessionPlantCount'));
  const postCount = getPostCount();

  await page.close();
  return { scenario: 'synchronous spam-click (10x)', postCount, sessionCount, consoleErrors };
}

async function runEnterKeySpamScenario(browser) {
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('pageerror', err => consoleErrors.push(err.message));

  const getPostCount = await mockSlowPlantEndpoint(page);
  await drawAndOpenConfirmModal(page, 'Enter key spam regression test');

  const confirmButton = page.getByRole('button', { name: /Plant in Garden|Planting/ });
  await confirmButton.focus();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Enter');
  }

  await page.waitForSelector('text=Your Flower Has Bloomed!', { timeout: 8000 });
  const sessionCount = await page.evaluate(() => sessionStorage.getItem('bloomspaceSessionPlantCount'));
  const postCount = getPostCount();

  await page.close();
  return { scenario: 'Enter-key spam (6x)', postCount, sessionCount, consoleErrors };
}

async function main() {
  const browser = await chromium.launch();
  const results = [
    await runSynchronousSpamClickScenario(browser),
    await runEnterKeySpamScenario(browser),
  ];
  await browser.close();

  let allPassed = true;
  for (const r of results) {
    const pass = r.postCount === 1 && r.sessionCount === '1' && r.consoleErrors.length === 0;
    allPassed = allPassed && pass;
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${r.scenario}: postCount=${r.postCount} sessionCount=${r.sessionCount} consoleErrors=${r.consoleErrors.length}`);
    if (r.consoleErrors.length) console.log('  console errors:', r.consoleErrors.join('; '));
  }

  if (!allPassed) {
    console.error('\nFAIL: duplicate submission was not fully prevented.');
    process.exitCode = 1;
    return;
  }
  console.log('\nPASS: exactly one flower was created per attempt despite spam-clicking and Enter-key spam.');
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
