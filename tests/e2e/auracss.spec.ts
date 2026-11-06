import { test, expect } from '@playwright/test';

test.describe('AuraCSS STD-REG-02 Heterogeneous Fixture Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Topology 1 (Semantic HTML): Standby -> Activate -> Lock -> Mutate', async ({ page }) => {
    // 1. Verify Shadow Root & Standby
    const shadowHost = page.locator('#auracss-root');
    await expect(shadowHost).toBeAttached();

    const toggleBtn = shadowHost.locator('.auracss-toggle-btn').first();
    await expect(toggleBtn).toHaveText(/AuraCSS: OFF/);

    // 2. Activate tool
    await toggleBtn.click();
    await expect(toggleBtn).toHaveText(/AuraCSS: ON/);

    // 3. Lock Semantic Button
    const exploreBtn = page.locator('#explore-btn');
    await exploreBtn.click();

    // 4. Verify Ring and Pill
    const ring = shadowHost.locator('.auracss-ring');
    await expect(ring).toBeVisible();
    await expect(ring).toHaveClass(/locked/);

    const pill = shadowHost.locator('.auracss-pill');
    await expect(pill).toHaveText('button#explore-btn.btn');

    // 5. Apply variation preset
    const presetCard = shadowHost.locator('.auracss-preset-card').first();
    await expect(presetCard).toBeVisible();
    await presetCard.click();

    // Verify button style mutated
    await expect(exploreBtn).toHaveAttribute('style', /background-color/);

    // Verify Export counter updated
    const exportBtn = shadowHost.locator('.auracss-toggle-btn').nth(1);
    await expect(exportBtn).toHaveText('Export (1)');
  });

  test('Topology 2 (Deeply Nested): Traversal & Breadcrumbs', async ({ page }) => {
    const shadowHost = page.locator('#auracss-root');
    await shadowHost.locator('.auracss-toggle-btn').first().click();

    // Lock deeply nested node
    const deepNode = page.locator('#deep-target-node');
    await deepNode.click();

    // Verify breadcrumb bar
    const breadcrumbBar = shadowHost.locator('.auracss-breadcrumb-bar');
    await expect(breadcrumbBar).toBeVisible();

    const items = breadcrumbBar.locator('.auracss-breadcrumb-item');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Test ArrowUp traversal
    await page.keyboard.press('ArrowUp');
    const pill = shadowHost.locator('.auracss-pill');
    await expect(pill).toHaveText(/div#nest-6/);

    // Test ArrowDown traversal
    await page.keyboard.press('ArrowDown');
    await expect(pill).toHaveText('span#deep-target-node.badge-accent');
  });

  test('Topology 3 (Transformed / Geometric Layout): Affine Alignment', async ({ page }) => {
    const shadowHost = page.locator('#auracss-root');
    await shadowHost.locator('.auracss-toggle-btn').first().click();

    const transformedCard = page.locator('#transformed-card');
    await transformedCard.click();

    const ring = shadowHost.locator('.auracss-ring');
    await expect(ring).toBeVisible();
    await expect(ring).toHaveClass(/locked/);

    // Verify transform translate3d is applied on the ring
    const transformStyle = await ring.getAttribute('style');
    expect(transformStyle).toContain('translate3d');
  });

  test('Topology 4 (Overflow-Scroll Context): Internal Scroll Positioning', async ({ page }) => {
    const shadowHost = page.locator('#auracss-root');
    await shadowHost.locator('.auracss-toggle-btn').first().click();

    // Scroll internal container
    await page.$eval('#scroll-container', (el) => {
      el.scrollTop = 50;
    });

    const scrollBtn = page.locator('#scroll-btn');
    await scrollBtn.click();

    const ring = shadowHost.locator('.auracss-ring');
    await expect(ring).toBeVisible();
    await expect(ring).toHaveClass(/locked/);
  });

  test('Quality & Fallbacks: Hold to Compare (Spacebar) & Revert', async ({ page }) => {
    const shadowHost = page.locator('#auracss-root');
    await shadowHost.locator('.auracss-toggle-btn').first().click();

    const exploreBtn = page.locator('#explore-btn');
    const originalStyle = await exploreBtn.getAttribute('style');

    await exploreBtn.click();
    await shadowHost.locator('.auracss-preset-card').first().click();

    // Hold Spacebar to compare
    await page.keyboard.down('Space');
    await expect(exploreBtn).toHaveAttribute('style', originalStyle ?? '');

    // Release Spacebar
    await page.keyboard.up('Space');
    const modifiedStyle = await exploreBtn.getAttribute('style');
    expect(modifiedStyle).not.toBe(originalStyle);

    // Click Revert button
    const revertBtn = shadowHost.locator('.auracss-preset-reset');
    await expect(revertBtn).toBeVisible();
    await revertBtn.click();

    // Element restored to original
    await expect(exploreBtn).toHaveAttribute('style', originalStyle ?? '');
    const exportBtn = shadowHost.locator('.auracss-toggle-btn').nth(1);
    await expect(exportBtn).toHaveText('Export (0)');
  });

  test('Sprint 6: Zero-Key Agent Bridge, Typography Controls & Variations', async ({ page }) => {
    const shadowHost = page.locator('#auracss-root');
    await shadowHost.locator('.auracss-toggle-btn').first().click();

    const exploreBtn = page.locator('#explore-btn');
    await exploreBtn.click();

    // 1. Typography Popover (Fonts, Sizes, Colors, Styles)
    const paletteBtn = shadowHost.locator('.auracss-dock-palette-btn');
    await expect(paletteBtn).toBeVisible();
    await paletteBtn.click();

    const palettePopover = shadowHost.locator('.auracss-palette-popover');
    await expect(palettePopover).toBeVisible();

    // Apply Modern Mono font family
    const monoPill = palettePopover.locator('.auracss-font-pill', { hasText: 'Modern Mono' });
    await monoPill.click();

    // Apply 18px font size
    const sizePill = palettePopover.locator('.auracss-size-pill', { hasText: 'LG (18px)' });
    await sizePill.click();

    await expect(exploreBtn).toHaveCSS('font-size', '18px');
    const exportBtn = shadowHost.locator('.auracss-toggle-btn').nth(1);
    await expect(exportBtn).toHaveText('Export (1)');

    // 2. AI Variations Cycling (Set 1/3 -> 2/3)
    const aiBtn = shadowHost.locator('.auracss-ai-remodel-btn');
    await expect(aiBtn).toBeVisible();
    await aiBtn.click();
    await expect(shadowHost.locator('.auracss-preset-card').first()).toBeVisible();

    // 3. Revert resets all changes cleanly
    const revertBtn = shadowHost.locator('.auracss-preset-reset');
    await revertBtn.click();
    await expect(exportBtn).toHaveText('Export (0)');
  });
});
