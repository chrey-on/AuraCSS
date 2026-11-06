import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Activate AuraCSS
  await page.evaluate(() => {
    if (window.__AURACSS_INSTANCE__) {
      window.__AURACSS_INSTANCE__.activate();
    }
  });
  await page.waitForTimeout(500);

  // Lock explore button
  await page.click('#explore-btn');
  await page.waitForTimeout(500);

  const originalCss = await page.evaluate(() => document.querySelector('#explore-btn').style.cssText);
  console.log('Original element cssText:', originalCss);

  // 1. Select first preset card
  console.log('Clicking card 0 (Select)...');
  await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const cards = root.shadowRoot.querySelectorAll('.auracss-preset-card');
    cards[0].click();
  });
  await page.waitForTimeout(500);

  const selectedCss = await page.evaluate(() => document.querySelector('#explore-btn').style.cssText);
  const card0Active = await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const cards = root.shadowRoot.querySelectorAll('.auracss-preset-card');
    return cards[0].classList.contains('active');
  });
  console.log('After Select: Card 0 active:', card0Active, '| element cssText:', selectedCss);

  // 2. Click card 0 AGAIN (Deselect / Toggle Off)
  console.log('Clicking card 0 AGAIN (Deselect attempt)...');
  await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const cards = root.shadowRoot.querySelectorAll('.auracss-preset-card');
    cards[0].click();
  });
  await page.waitForTimeout(500);

  const afterDeselectCss = await page.evaluate(() => document.querySelector('#explore-btn').style.cssText);
  const card0ActiveAfterDeselect = await page.evaluate(() => {
    const root = document.querySelector('#auracss-root');
    const cards = root.shadowRoot.querySelectorAll('.auracss-preset-card');
    return cards[0].classList.contains('active');
  });
  console.log('After Deselect Click: Card 0 active:', card0ActiveAfterDeselect, '| element cssText:', afterDeselectCss);

  await browser.close();
})();
