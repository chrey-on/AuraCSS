import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Activate AuraCSS
  await page.evaluate(() => {
    if (window.__AURACSS_INSTANCE__) window.__AURACSS_INSTANCE__.activate();
  });
  await page.waitForTimeout(500);

  // Set AI to bridge
  await page.evaluate(() => {
    localStorage.setItem('auracss_ai_config', JSON.stringify({
      provider: 'bridge',
      apiKey: '',
      model: 'agent-auto',
      bridgeUrl: 'http://127.0.0.1:4999'
    }));
    if (window.__AURACSS_INSTANCE__) window.__AURACSS_INSTANCE__.aiService.loadConfig();
  });

  await page.click('#explore-btn');
  await page.waitForTimeout(500);

  // Click AI Variations to get Set 1/3
  console.log('Generating AI Variations...');
  await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const aiBtn = root.shadowRoot.querySelector('.auracss-ai-remodel-btn');
    aiBtn.click();
  });
  await page.waitForTimeout(1000);

  let cardsBeforeSelect = await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    return Array.from(root.shadowRoot.querySelectorAll('.auracss-preset-name')).map(c => c.textContent);
  });
  console.log('Cards before select:', cardsBeforeSelect);

  // Select card 0 (AI Modern Elevated Solid)
  console.log('Selecting card 0...');
  await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const cards = root.shadowRoot.querySelectorAll('.auracss-preset-card');
    cards[0].click();
  });
  await page.waitForTimeout(500);

  // Now click Revert
  console.log('Clicking ↺ Revert...');
  await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const revertBtn = root.shadowRoot.querySelector('.auracss-preset-reset');
    revertBtn.click();
  });
  await page.waitForTimeout(500);

  let cardsAfterRevert = await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    return Array.from(root.shadowRoot.querySelectorAll('.auracss-preset-name')).map(c => c.textContent);
  });
  console.log('Cards after Revert:', cardsAfterRevert);

  await browser.close();
})();
