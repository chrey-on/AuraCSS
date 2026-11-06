import { chromium } from 'playwright';

(async () => {
  console.log('Launching browser for comprehensive E2E validation...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // Pre-seed localStorage with bridge provider
  await page.addInitScript(() => {
    localStorage.setItem('auracss_ai_config', JSON.stringify({
      provider: 'bridge',
      apiKey: '',
      model: 'agent-auto',
      bridgeUrl: 'http://127.0.0.1:4999'
    }));
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Activate AuraCSS
  await page.evaluate(() => {
    if (window.__AURACSS_INSTANCE__) {
      window.__AURACSS_INSTANCE__.activate();
      window.__AURACSS_INSTANCE__.aiService.loadConfig();
    }
  });
  await page.waitForTimeout(400);

  // Lock #explore-btn
  console.log('Locking #explore-btn...');
  await page.click('#explore-btn');
  await page.waitForTimeout(600);

  const host = page.locator('#auracss-root');
  await host.waitFor({ state: 'attached' });

  // 1. Verify dock layout: prompt input is REMOVED, and vertical stacks exist
  const promptInputCount = await host.locator('.auracss-prompt-input').count();
  console.log('1. Prompt input count in dock (must be 0):', promptInputCount);
  if (promptInputCount !== 0) throw new Error('Prompt input still present in dock!');

  const leftStack = host.locator('.auracss-dock-stack.left');
  const rightStack = host.locator('.auracss-dock-stack.right');
  const cardsTrack = host.locator('.auracss-cards-track');

  if (await leftStack.count() !== 1) throw new Error('Left vertical stack missing!');
  if (await rightStack.count() !== 1) throw new Error('Right vertical stack missing!');
  if (await cardsTrack.count() !== 1) throw new Error('Cards track missing!');

  console.log('Verified two-row vertical stacks on left and right with middle swipeable track.');

  // Check initial dock card titles
  const defaultTitles = await host.locator('.auracss-preset-name').allTextContents();
  console.log('Initial default suggester titles:', defaultTitles);

  // 2. Click "✨ AI Variations" (compact button)
  const aiBtn = host.locator('.auracss-ai-remodel-btn');
  console.log('2. Clicking AI Variations button (stacked above revert)...');
  await aiBtn.click();
  await page.waitForTimeout(800);

  const aiTitles = await host.locator('.auracss-preset-name').allTextContents();
  console.log('AI Variation Titles in dock:', aiTitles);
  if (!aiTitles.some(t => t.includes('AI'))) {
    throw new Error('Cards did not update to AI variations: ' + JSON.stringify(aiTitles));
  }

  // Verify swipeability via mouse drag
  const trackBox = await cardsTrack.boundingBox();
  if (trackBox) {
    console.log('Testing mouse drag-to-scroll swipe on cards track...');
    await page.mouse.move(trackBox.x + trackBox.width - 50, trackBox.y + trackBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(trackBox.x + 50, trackBox.y + trackBox.height / 2, { steps: 8 });
    await page.mouse.up();
    const scrollLeft = await cardsTrack.evaluate(el => el.scrollLeft);
    console.log('Cards track scrollLeft after drag:', scrollLeft);
  }

  // 3. Click first AI Variation card to select it
  console.log('3. Selecting first AI variation card:', aiTitles[0]);
  const firstCard = host.locator('.auracss-preset-card').first();
  await firstCard.click();
  await page.waitForTimeout(500);

  // Verify element style updated
  const styleAfterSelect = await page.locator('#explore-btn').getAttribute('style');
  console.log('Style applied to #explore-btn:', styleAfterSelect);
  if (!styleAfterSelect) throw new Error('Element did not receive style!');

  // CRITICAL CHECK: Verify dock presets did NOT reset to default suggester
  const titlesAfterSelect = await host.locator('.auracss-preset-name').allTextContents();
  console.log('Titles after select (MUST match AI variations):', titlesAfterSelect);
  if (titlesAfterSelect[0] !== aiTitles[0]) {
    throw new Error(`CRITICAL BUG: Dock reverted on selection! Expected ${aiTitles[0]}, got ${titlesAfterSelect[0]}`);
  }
  const isFirstActive = await firstCard.evaluate(el => el.classList.contains('active'));
  console.log('First card active state (must be true):', isFirstActive);
  if (!isFirstActive) throw new Error('First card does not have .active class!');

  // 4. Click first card again to deselect
  console.log('4. Deselecting first AI variation card...');
  await firstCard.click();
  await page.waitForTimeout(500);

  const styleAfterDeselect = await page.locator('#explore-btn').getAttribute('style');
  console.log('Style after deselect (must be empty/original):', styleAfterDeselect || '(empty)');

  const titlesAfterDeselect = await host.locator('.auracss-preset-name').allTextContents();
  console.log('Titles after deselect (MUST match AI variations):', titlesAfterDeselect);
  if (titlesAfterDeselect[0] !== aiTitles[0]) {
    throw new Error(`CRITICAL BUG: Dock reverted on deselect! Expected ${aiTitles[0]}, got ${titlesAfterDeselect[0]}`);
  }

  // 5. Test 🔤 Typography & Font Popover (Fonts, Sizes, Colors, Styles)
  console.log('5. Testing 🔤 Typography & Font Popover (Fonts, Sizes, Colors, Styles)...');
  const paletteBtn = host.locator('.auracss-dock-palette-btn');
  if (await paletteBtn.count() === 0) throw new Error('Typography button missing from dock!');
  await paletteBtn.click();
  await page.waitForTimeout(400);

  const palettePopover = host.locator('.auracss-palette-popover');
  const isPaletteVisible = await palettePopover.isVisible();
  console.log('Typography popover visible:', isPaletteVisible);
  if (!isPaletteVisible) throw new Error('Typography popover did not open!');

  // Verify 1. Font Families
  const fontPills = palettePopover.locator('.auracss-font-pill');
  const fontCount = await fontPills.count();
  console.log('Font family pills count (expected 4):', fontCount);
  if (fontCount !== 4) throw new Error('Expected 4 font family pills, found ' + fontCount);

  console.log('Applying Modern Mono font family...');
  await fontPills.nth(1).click(); // Modern Mono
  await page.waitForTimeout(300);
  const styleAfterFont = await page.locator('#explore-btn').getAttribute('style');
  console.log('Style after Modern Mono font:', styleAfterFont);
  if (!styleAfterFont || !styleAfterFont.includes('monospace')) {
    throw new Error('Font family was not applied correctly! Style: ' + styleAfterFont);
  }

  // Verify 2. Font Sizes
  const sizePills = palettePopover.locator('.auracss-size-pill');
  const sizeCount = await sizePills.count();
  console.log('Font size pills count (expected 6):', sizeCount);
  if (sizeCount !== 6) throw new Error('Expected 6 font size pills, found ' + sizeCount);

  console.log('Applying 18px (LG) font size...');
  await sizePills.nth(3).click(); // 18px
  await page.waitForTimeout(300);
  const styleAfterSize = await page.locator('#explore-btn').getAttribute('style');
  console.log('Style after 18px size:', styleAfterSize);
  if (!styleAfterSize || !styleAfterSize.includes('18px')) {
    throw new Error('Font size was not applied correctly! Style: ' + styleAfterSize);
  }

  // Verify 3. Font Colors
  const swatches = palettePopover.locator('.auracss-font-color-btn');
  const swatchesCount = await swatches.count();
  console.log('Font color swatches count (expected 9):', swatchesCount);
  if (swatchesCount !== 9) throw new Error('Expected 9 font color swatches, found ' + swatchesCount);

  console.log('Applying Sky Cyan font color (#38bdf8)...');
  await swatches.nth(3).click(); // Sky Cyan (#38bdf8)
  await page.waitForTimeout(300);
  const styleAfterColor = await page.locator('#explore-btn').getAttribute('style');
  console.log('Style after Sky Cyan color:', styleAfterColor);
  if (!styleAfterColor || (!styleAfterColor.includes('#38bdf8') && !styleAfterColor.includes('rgb(56, 189, 248)'))) {
    throw new Error('Font color was not applied correctly! Style: ' + styleAfterColor);
  }

  // Verify 4. Font Styles
  const stylePills = palettePopover.locator('.auracss-style-pill');
  const styleCount = await stylePills.count();
  console.log('Font style pills count (expected 7):', styleCount);
  if (styleCount !== 7) throw new Error('Expected 7 font style pills, found ' + styleCount);

  console.log('Applying Bold (700) font style...');
  await stylePills.nth(3).click(); // Bold (700)
  await page.waitForTimeout(300);
  const styleAfterWeight = await page.locator('#explore-btn').getAttribute('style');
  console.log('Style after Bold (700):', styleAfterWeight);
  if (!styleAfterWeight || !styleAfterWeight.includes('700')) {
    throw new Error('Font weight was not applied correctly! Style: ' + styleAfterWeight);
  }

  // Take screenshot of Typography Popover
  const paletteScreenshotPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\72c289b1-3efb-4363-a19b-d6db4ddbe4fa\\palette_popover_open.png';
  await page.screenshot({ path: paletteScreenshotPath });
  console.log('Typography popover screenshot saved to:', paletteScreenshotPath);

  // Close typography popover
  await host.locator('.auracss-palette-close').click();
  await page.waitForTimeout(300);

  // 6. Verify Zero-Key Antigravity Agent Diagnostics Modal
  console.log('6. Opening Antigravity Agent Diagnostics Modal...');
  const settingsBtn = host.locator('.auracss-ai-settings-btn');
  await settingsBtn.click();
  await page.waitForTimeout(400);

  const modalTitle = await host.locator('.auracss-ai-modal-title').textContent();
  console.log('Modal title:', modalTitle);
  if (!modalTitle || !modalTitle.includes('Antigravity Agent Diagnostics')) {
    throw new Error('Unexpected modal title: ' + modalTitle);
  }

  const bridgeCard = host.locator('.auracss-ai-bridge-card');
  const bridgeVisible = await bridgeCard.isVisible();
  const keyInputsCount = await host.locator('.auracss-ai-key-input').count();
  const selectCount = await host.locator('.auracss-ai-select').count();
  const passwordCount = await host.locator('input[type="password"]').count();
  const statusPillText = await host.locator('.auracss-ai-status').textContent();
  const targetLabel = await host.locator('#auracss-diag-target').textContent();

  console.log('Bridge info card visible:', bridgeVisible);
  console.log('Key inputs count (must be 0):', keyInputsCount);
  console.log('Select dropdowns count (must be 0):', selectCount);
  console.log('Password fields count (must be 0):', passwordCount);
  console.log('Inspected target in diagnostics:', targetLabel);
  console.log('Status pill text:', statusPillText);

  if (!bridgeVisible) throw new Error('Bridge info card is NOT visible!');
  if (keyInputsCount !== 0) throw new Error('Legacy API key input still present!');
  if (selectCount !== 0) throw new Error('Legacy select dropdown still present!');
  if (passwordCount !== 0) throw new Error('Legacy password inputs still present!');
  if (!targetLabel || !targetLabel.includes('explore-btn')) {
    throw new Error('Diagnostics target does not reflect inspected element: ' + targetLabel);
  }

  // Ping MCP bridge
  console.log('Clicking "Ping MCP Bridge"...');
  const pingBtn = host.locator('.auracss-ai-btn-secondary');
  await pingBtn.click();
  await page.waitForTimeout(500);
  const statusAfterPing = await host.locator('.auracss-ai-status').textContent();
  console.log('Status pill after ping:', statusAfterPing);
  if (!statusAfterPing || !statusAfterPing.includes('Connected')) {
    throw new Error('Ping did not return Connected! Text: ' + statusAfterPing);
  }

  // Save modal screenshot
  const modalScreenshotPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\72c289b1-3efb-4363-a19b-d6db4ddbe4fa\\modal_bridge_clean.png';
  await page.screenshot({ path: modalScreenshotPath });
  console.log('Modal screenshot saved to:', modalScreenshotPath);

  // Close modal
  const closeBtn = host.locator('.auracss-ai-modal-close');
  await closeBtn.click();
  await page.waitForTimeout(300);

  // 7. Test Saved Prompted Results
  console.log('7. Testing Saved Prompted Results feature...');
  await fetch('http://127.0.0.1:4999/api/patch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: 'gradient pill with emerald cyan and bold text',
      name: 'Emerald Cyan Gradient Pill',
      description: 'Prompt: "gradient pill with emerald cyan and bold text"',
      cssText: 'background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: #ffffff; border-radius: 9999px; padding: 12px 28px; font-weight: 700;',
      tailwindClasses: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full font-bold'
    })
  });
  await page.waitForTimeout(600);

  const savedBtn = host.locator('.auracss-saved-styles-btn');
  console.log('Saved button text:', await savedBtn.textContent());

  await savedBtn.click();
  await page.waitForTimeout(400);

  const popover = host.locator('.auracss-saved-popover');
  const isPopoverVisible = await popover.isVisible();
  console.log('Saved popover visible:', isPopoverVisible);
  if (!isPopoverVisible) throw new Error('Saved styles popover did not open!');

  const savedCardCount = await host.locator('.auracss-saved-card').count();
  console.log('Saved card count:', savedCardCount);
  if (savedCardCount < 1) throw new Error('Expected at least 1 saved style card!');

  const popoverScreenshotPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\72c289b1-3efb-4363-a19b-d6db4ddbe4fa\\saved_styles_popover.png';
  await page.screenshot({ path: popoverScreenshotPath });
  console.log('Saved popover screenshot saved to:', popoverScreenshotPath);

  await host.locator('.auracss-saved-popover-close').click();
  await page.waitForTimeout(300);

  const finalScreenshotPath = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\72c289b1-3efb-4363-a19b-d6db4ddbe4fa\\ai_variations_clean_dock.png';
  await page.screenshot({ path: finalScreenshotPath });
  console.log('Final screenshot saved to:', finalScreenshotPath);

  await browser.close();
  console.log('\n========================================');
  console.log('✓ ALL END-TO-END VERIFICATIONS PASSED!');
  console.log('========================================');
})();
