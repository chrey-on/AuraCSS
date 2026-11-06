import { chromium } from 'playwright';

(async () => {
  console.log('Starting E2E validation for Unified Floating Capsule HUD & Multi-Element Export...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Activate AuraCSS
  await page.evaluate(() => {
    if (window.__AURACSS_INSTANCE__) {
      window.__AURACSS_INSTANCE__.activate();
    }
  });
  await page.waitForTimeout(400);

  const host = page.locator('#auracss-root');
  await host.waitFor({ state: 'attached' });

  // 1. Verify Unified Floating Capsule HUD
  console.log('1. Verifying Unified Floating Capsule HUD layout...');
  const capsule = host.locator('.auracss-controls-row');
  await capsule.waitFor({ state: 'visible' });

  const capsuleBox = await capsule.boundingBox();
  console.log('Capsule bounding box:', capsuleBox);
  if (!capsuleBox) throw new Error('Capsule is not visible!');

  // Verify horizontal capsule height is compact (~32px) and contains toggle + export + min
  if (capsuleBox.height > 40) {
    throw new Error(`Capsule height is too large: ${capsuleBox.height}px`);
  }

  const toggleBtn = host.locator('.auracss-toggle-btn').first();
  const exportBtn = host.locator('.auracss-toggle-btn').nth(1);
  const minBtn = host.locator('.auracss-min-btn');

  console.log('Toggle text:', await toggleBtn.textContent());
  console.log('Export text:', await exportBtn.textContent());

  // 2. Test Minimize & Expand
  console.log('2. Testing minimize & expand...');
  await minBtn.click();
  await page.waitForTimeout(300);

  const badge = host.locator('.auracss-min-badge');
  if (!(await badge.isVisible())) throw new Error('Badge not visible when minimized!');
  if (await capsule.isVisible()) throw new Error('Capsule still visible when minimized!');

  // Expand
  await badge.click();
  await page.waitForTimeout(300);
  if (!(await capsule.isVisible())) throw new Error('Capsule did not restore on expand!');

  // 3. Style First Element: #explore-btn
  console.log('3. Styling first element (#explore-btn)...');
  await page.click('#explore-btn');
  await page.waitForTimeout(500);

  // Apply first variation
  const firstPreset = host.locator('.auracss-preset-card').first();
  await firstPreset.click();
  await page.waitForTimeout(400);

  console.log('Export button after element 1:', await exportBtn.textContent());
  if ((await exportBtn.textContent()) !== 'Export (1)') {
    throw new Error('Export count did not increment to 1!');
  }

  // 4. Style Second Element: deeply nested or second button
  console.log('4. Styling second element (#deep-target-node)...');
  await page.click('#deep-target-node');
  await page.waitForTimeout(500);

  // Apply theme via palette popover
  const paletteBtn = host.locator('.auracss-dock-palette-btn');
  await paletteBtn.click();
  await page.waitForTimeout(300);

  const themePills = host.locator('.auracss-theme-pill');
  await themePills.nth(1).click(); // Emerald Matrix
  await page.waitForTimeout(400);

  console.log('Export button after element 2:', await exportBtn.textContent());
  if ((await exportBtn.textContent()) !== 'Export (2)') {
    throw new Error('Export count did not increment to 2!');
  }

  // Take screenshot of sleek unified capsule in top right
  const capsuleScreenshotPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\72c289b1-3efb-4363-a19b-d6db4ddbe4fa\\capsule_hud_open.png';
  await page.screenshot({ path: capsuleScreenshotPath });
  console.log('Saved capsule HUD screenshot to:', capsuleScreenshotPath);

  // 5. Open Enhanced Change Ledger Modal
  console.log('5. Opening enhanced Change Ledger modal...');
  await exportBtn.click();
  await page.waitForTimeout(400);

  const ledgerModal = host.locator('.auracss-ledger-modal');
  if (!(await ledgerModal.isVisible())) throw new Error('Change ledger modal did not open!');

  // Verify subtitle reflects both elements
  const subtitle = await host.locator('.auracss-ledger-subtitle').textContent();
  console.log('Ledger subtitle:', subtitle);
  if (!subtitle || !subtitle.includes('2 elements modified')) {
    throw new Error('Subtitle does not show 2 elements modified! Text: ' + subtitle);
  }

  // Verify chips
  const chips = await host.locator('.auracss-ledger-chip').allTextContents();
  console.log('Element chips in ledger:', chips);
  if (chips.length !== 2) throw new Error('Expected 2 chips, got ' + chips.length);

  // Verify CSS diff textarea contains both elements
  const textarea = host.locator('.auracss-ledger-textarea');
  const cssValue = await textarea.inputValue();
  console.log('CSS Export Preview (first 180 chars):\n', cssValue.slice(0, 180));
  if (!cssValue.includes('explore-btn') || !cssValue.includes('deep-target-node')) {
    throw new Error('CSS Export missing one of the modified elements!');
  }

  // Switch to Tailwind Tab
  console.log('Testing Tailwind export tab...');
  const tabs = host.locator('.auracss-ledger-tab');
  await tabs.nth(1).click();
  await page.waitForTimeout(200);

  const twValue = await textarea.inputValue();
  console.log('Tailwind Export Preview (first 180 chars):\n', twValue.slice(0, 180));
  if (!twValue.includes('explore-btn') || !twValue.includes('deep-target-node')) {
    throw new Error('Tailwind Export missing one of the modified elements!');
  }

  // Switch to JSX Tab
  console.log('Testing JSX export tab...');
  await tabs.nth(2).click();
  await page.waitForTimeout(200);

  const jsxValue = await textarea.inputValue();
  console.log('JSX Export Preview (first 180 chars):\n', jsxValue.slice(0, 180));
  if (!jsxValue.includes('className=') || !jsxValue.includes('style={{')) {
    throw new Error('JSX Export format invalid!');
  }

  // Test Copy button
  console.log('Testing Copy to Clipboard button...');
  const copyBtn = host.locator('.auracss-ledger-copy');
  await copyBtn.click();
  await page.waitForTimeout(300);
  console.log('Copy button text after click:', await copyBtn.textContent());

  // Switch back to CSS Diff for clean screenshot
  await tabs.first().click();
  await page.waitForTimeout(200);

  const modalScreenshotPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\72c289b1-3efb-4363-a19b-d6db4ddbe4fa\\export_modal_multi_element.png';
  await page.screenshot({ path: modalScreenshotPath });
  console.log('Saved multi-element export modal screenshot to:', modalScreenshotPath);

  await browser.close();
  console.log('\n========================================');
  console.log('✓ ALL CAPSULE & EXPORT VERIFICATIONS PASSED!');
  console.log('========================================');
})();
