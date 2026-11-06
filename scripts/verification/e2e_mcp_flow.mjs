import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/ ...');
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

  // Lock explore button
  console.log('Locking #explore-btn...');
  await page.click('#explore-btn');
  await page.waitForTimeout(1000);

  // Verify that bridge knows about active element
  const bridgeRes = await fetch('http://127.0.0.1:4999/health');
  const health = await bridgeRes.json();
  console.log('Bridge health hasActiveElement:', health.hasActiveElement);
  console.log('Active element tag:', health.activeElement?.tag);

  // Now simulate an MCP apply style call from Antigravity:
  console.log('Applying style from agent via bridge SSE patch...');
  await fetch('http://127.0.0.1:4999/api/patch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cssText: 'background: linear-gradient(135deg, #7c3aed 0%, #d946ef 100%); color: #ffffff; border-radius: 9999px; min-width: 250px; padding: 16px 36px; font-weight: 700; box-shadow: 0 0 24px rgba(217, 70, 239, 0.5); font-size: 1.15rem;',
      tailwindClasses: 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white rounded-full min-w-[250px] px-9 py-4 font-bold shadow-2xl text-lg'
    })
  });
  await page.waitForTimeout(1000);

  // Check if explore button updated in the browser
  const updatedStyle = await page.evaluate(() => document.querySelector('#explore-btn').style.cssText);
  console.log('Explore button style after agent patch:', updatedStyle);

  if (!updatedStyle.includes('linear-gradient') || !updatedStyle.includes('250px')) {
    console.error('FAIL: Element was not updated by agent patch');
    await browser.close();
    process.exit(1);
  }

  console.log('SUCCESS: Agent patch applied seamlessly into the live browser session!');
  await browser.close();
})();
