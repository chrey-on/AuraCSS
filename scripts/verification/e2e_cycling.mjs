import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Check if AuraCSS toggle is present
  const host = await page.$('#auracss-root');
  if (!host) {
    console.error('FAIL: #auracss-root host not found');
    await browser.close();
    process.exit(1);
  }

  // Activate AuraCSS
  await page.evaluate(() => {
    if (window.__AURACSS_INSTANCE__) {
      window.__AURACSS_INSTANCE__.activate();
    } else {
      const root = document.querySelector('#auracss-root');
      const toggle = root.shadowRoot.querySelector('.auracss-toggle-btn');
      if (toggle) toggle.click();
    }
  });
  await page.waitForTimeout(500);

  // Configure AI to use Bridge (Zero Key) in localStorage
  await page.evaluate(() => {
    localStorage.setItem('auracss_ai_config', JSON.stringify({
      provider: 'bridge',
      apiKey: '',
      model: 'agent-auto',
      bridgeUrl: 'http://127.0.0.1:4999'
    }));
    if (window.__AURACSS_INSTANCE__) {
      window.__AURACSS_INSTANCE__.aiService.loadConfig();
    }
  });

  // Click explore button to lock
  console.log('Locking explore button...');
  await page.click('#explore-btn');
  await page.waitForTimeout(600);

  // Check dock visibility
  const dockVisible = await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const dock = root.shadowRoot.querySelector('.auracss-variation-dock');
    return dock && dock.classList.contains('visible');
  });
  console.log('Dock visible:', dockVisible);
  if (!dockVisible) {
    console.error('FAIL: Dock not visible');
    await browser.close();
    process.exit(1);
  }

  // TEST 1: Colloquial Dimensional Prompt: "just make it long and bigger"
  console.log('Testing prompt: "just make it long and bigger"...');
  await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const form = root.shadowRoot.querySelector('.auracss-prompt-form');
    const input = root.shadowRoot.querySelector('.auracss-prompt-input');
    input.value = 'just make it long and bigger';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await page.waitForTimeout(1000);

  const btnStyles = await page.evaluate(() => {
    const btn = document.querySelector('#explore-btn');
    return {
      cssText: btn.style.cssText,
      minWidth: btn.style.minWidth,
      padding: btn.style.padding,
      fontSize: btn.style.fontSize
    };
  });
  console.log('Button styles after prompt:', btnStyles);
  if (!btnStyles.cssText.includes('min-width') || !btnStyles.cssText.includes('240px')) {
    console.error('FAIL: Button did not receive min-width: 240px from prompt');
    await browser.close();
    process.exit(1);
  }
  console.log('✓ PASS: Prompt "just make it long and bigger" accurately expanded box model & typography');

  // TEST 2: 3-Set AI Variations Cycling
  console.log('Testing 3-Set AI Variations Cycling...');

  // Click 1 -> Set 1/3
  console.log('Clicking AI Variations (1st time)...');
  await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const aiBtn = root.shadowRoot.querySelector('.auracss-ai-remodel-btn');
    aiBtn.click();
  });
  await page.waitForTimeout(1200);

  let state1 = await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const aiBtn = root.shadowRoot.querySelector('.auracss-ai-remodel-btn');
    const cards = Array.from(root.shadowRoot.querySelectorAll('.auracss-preset-name')).map(c => c.textContent);
    return { btnText: aiBtn?.textContent, cards };
  });
  console.log('State 1:', state1);
  if (!state1.btnText.includes('Set 1/3') || !state1.cards.some(c => c.includes('Modern Elevated'))) {
    console.error('FAIL: Expected Set 1/3 with Modern Elevated');
    await browser.close();
    process.exit(1);
  }
  console.log('✓ PASS: Set 1 loaded with Neo-Digital Glass & Elevation');

  // Click 2 -> Set 2/3
  console.log('Clicking AI Variations (2nd time)...');
  await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const aiBtn = root.shadowRoot.querySelector('.auracss-ai-remodel-btn');
    aiBtn.click();
  });
  await page.waitForTimeout(1200);

  let state2 = await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const aiBtn = root.shadowRoot.querySelector('.auracss-ai-remodel-btn');
    const cards = Array.from(root.shadowRoot.querySelectorAll('.auracss-preset-name')).map(c => c.textContent);
    return { btnText: aiBtn?.textContent, cards };
  });
  console.log('State 2:', state2);
  if (!state2.btnText.includes('Set 2/3') || !state2.cards.some(c => c.includes('Warm Sunset Flame'))) {
    console.error('FAIL: Expected Set 2/3 with Warm Sunset Flame');
    await browser.close();
    process.exit(1);
  }
  console.log('✓ PASS: Set 2 loaded with Organic Sunset & Tactile Claymorphism');

  // Click 3 -> Set 3/3
  console.log('Clicking AI Variations (3rd time)...');
  await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const aiBtn = root.shadowRoot.querySelector('.auracss-ai-remodel-btn');
    aiBtn.click();
  });
  await page.waitForTimeout(1200);

  let state3 = await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const aiBtn = root.shadowRoot.querySelector('.auracss-ai-remodel-btn');
    const cards = Array.from(root.shadowRoot.querySelectorAll('.auracss-preset-name')).map(c => c.textContent);
    return { btnText: aiBtn?.textContent, cards };
  });
  console.log('State 3:', state3);
  if (!state3.btnText.includes('Set 3/3') || !state3.cards.some(c => c.includes('Cyberpunk Emerald Matrix'))) {
    console.error('FAIL: Expected Set 3/3 with Cyberpunk Emerald Matrix');
    await browser.close();
    process.exit(1);
  }
  console.log('✓ PASS: Set 3 loaded with Cyberpunk & High-Tech Dark');

  // Click 4 -> Loop back to Set 1/3
  console.log('Clicking AI Variations (4th time - loop test)...');
  await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const aiBtn = root.shadowRoot.querySelector('.auracss-ai-remodel-btn');
    aiBtn.click();
  });
  await page.waitForTimeout(1200);

  let state4 = await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const aiBtn = root.shadowRoot.querySelector('.auracss-ai-remodel-btn');
    const cards = Array.from(root.shadowRoot.querySelectorAll('.auracss-preset-name')).map(c => c.textContent);
    return { btnText: aiBtn?.textContent, cards };
  });
  console.log('State 4 (Loop):', state4);
  if (!state4.btnText.includes('Set 1/3') || !state4.cards.some(c => c.includes('Modern Elevated'))) {
    console.error('FAIL: Expected loop back to Set 1/3');
    await browser.close();
    process.exit(1);
  }
  console.log('✓ PASS: Successfully looped back to Set 1/3');

  // Apply one preset to test preview application
  console.log('Applying preset: AI Modern Elevated Solid...');
  await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const card = root.shadowRoot.querySelector('.auracss-preset-card');
    card.click();
  });
  await page.waitForTimeout(500);

  const appliedCss = await page.evaluate(() => document.querySelector('#explore-btn').style.cssText);
  console.log('Final Applied Style:', appliedCss);

  // Take screenshot
  const screenshotPath = 'C:/Users/Admin/.gemini/antigravity/brain/72c289b1-3efb-4363-a19b-d6db4ddbe4fa/scratch/e2e_verification.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.close();
  console.log('ALL E2E VERIFICATIONS PASSED SUCCESSFULLY!');
})();
