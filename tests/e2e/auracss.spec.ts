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

    // Hold Spacebar to compare (verify no page scroll occurs)
    const initialScrollY = await page.evaluate(() => window.scrollY);
    await page.keyboard.down('Space');
    await page.waitForTimeout(100);
    expect(await page.evaluate(() => window.scrollY)).toBe(initialScrollY);
    await expect(exploreBtn).toHaveAttribute('style', originalStyle ?? '');

    // Release Spacebar
    await page.keyboard.up('Space');
    expect(await page.evaluate(() => window.scrollY)).toBe(initialScrollY);
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

  test('Floating Controls Drag & Repositioning: Minimize to Right -> Drag Badge -> Re-expand', async ({ page }) => {
    const shadowHost = page.locator('#auracss-root');
    const stack = shadowHost.locator('.auracss-controls-stack');
    const badge = shadowHost.locator('.auracss-min-badge');
    const dragHandle = shadowHost.locator('.auracss-controls-drag-handle');
    const row = shadowHost.locator('.auracss-controls-row');

    // 1. Minimize controls to floating badge on the right side by clicking 6 dots
    await expect(dragHandle).toBeVisible();
    await dragHandle.click();
    await expect(stack).toHaveClass(/minimized/);
    await expect(badge).toBeVisible();

    // Verify it docked to right side (x > viewportWidth - 60)
    const viewportSize = page.viewportSize() || { width: 1280, height: 720 };
    const badgeBox = await badge.boundingBox();
    expect(badgeBox).not.toBeNull();
    if (badgeBox) {
      expect(badgeBox.x).toBeGreaterThan(viewportSize.width - 60);
    }

    // 2. Drag the minimized badge to a new coordinate
    const initialBox = badgeBox!;
    const targetX = Math.round(initialBox.x - 120);
    const targetY = Math.round(initialBox.y + 150);

    await badge.hover();
    await page.mouse.down();
    await page.mouse.move(targetX, targetY, { steps: 10 });
    await page.mouse.up();

    // 3. Verify badge moved and did NOT auto-expand on drag end
    const movedBox = await badge.boundingBox();
    expect(movedBox).not.toBeNull();
    if (!movedBox) return;

    expect(Math.abs(movedBox.x - (targetX - initialBox.width / 2))).toBeLessThan(25);
    expect(Math.abs(movedBox.y - (targetY - initialBox.height / 2))).toBeLessThan(25);
    await expect(stack).toHaveClass(/minimized/);

    // 4. Normal click on badge expands the toolbar
    await badge.click();
    await expect(stack).not.toHaveClass(/minimized/);
    await expect(shadowHost.locator('.auracss-toggle-btn').first()).toBeVisible();

    // 5. Drag expanded toolbar from anywhere on the pill row
    const rowBox = await row.boundingBox();
    expect(rowBox).not.toBeNull();
    if (!rowBox) return;

    const newTargetX = Math.round(rowBox.x - 80);
    const newTargetY = Math.round(rowBox.y + 80);

    await page.mouse.move(rowBox.x + rowBox.width / 2, rowBox.y + rowBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(newTargetX, newTargetY, { steps: 8 });
    await page.mouse.up();

    const finalStackBox = await stack.boundingBox();
    expect(finalStackBox).not.toBeNull();
  });

  test('Sprint 7: Reverted In-Dock Input, Variation Presets & Change Ledger Commit Action', async ({ page }) => {
    const shadowHost = page.locator('#auracss-root');

    // 1. Activate AuraCSS
    await shadowHost.locator('.auracss-toggle-btn').first().click();

    // 2. Lock explore button
    const exploreBtn = page.locator('#explore-btn');
    await exploreBtn.click();

    // 3. Verify in-dock prompt bar is removed
    const promptBar = shadowHost.locator('.auracss-dock-prompt-bar');
    await expect(promptBar).toHaveCount(0);

    // 4. Click a variation preset to mutate styles
    const presetCard = shadowHost.locator('.auracss-preset-card').first();
    await expect(presetCard).toBeVisible();
    await presetCard.click();

    // 5. Verify style mutated
    await expect(exploreBtn).toHaveAttribute('style', /border-radius/);

    // 6. Open Change Ledger modal
    const exportBtn = shadowHost.locator('.auracss-toggle-btn').nth(1);
    await exportBtn.click();

    const ledgerModal = shadowHost.locator('.auracss-ledger-modal');
    await expect(ledgerModal).toBeVisible();

    // 7. Verify Commit to Workspace button is visible
    const commitBtn = shadowHost.locator('.auracss-ledger-commit');
    await expect(commitBtn).toBeVisible();
    await expect(commitBtn).toHaveText(/Commit to Workspace/);
  });

  test('AI Variations Enhancements: Live Hover-Peek & Preset Bookmarking', async ({ page }) => {
    const shadowHost = page.locator('#auracss-root');
    await shadowHost.locator('.auracss-toggle-btn').first().click();

    const exploreBtn = page.locator('#explore-btn');
    const originalStyle = await exploreBtn.getAttribute('style');
    await exploreBtn.click();

    const firstCard = shadowHost.locator('.auracss-preset-card').first();
    const secondCard = shadowHost.locator('.auracss-preset-card').nth(1);
    await expect(firstCard).toBeVisible();

    // 1. Live Hover-Peek: Hovering second card temporarily updates element style
    await secondCard.hover();
    await page.waitForTimeout(50);
    const peekedStyle = await exploreBtn.getAttribute('style');
    expect(peekedStyle).not.toBe(originalStyle);

    // 2. Unpeek: Moving mouse away restores element style without committing to export
    await page.mouse.move(0, 0);
    await page.waitForTimeout(50);
    const unpeekedStyle = await exploreBtn.getAttribute('style');
    expect(unpeekedStyle ?? '').toBe(originalStyle ?? '');
    const exportBtn = shadowHost.locator('.auracss-toggle-btn').nth(1);
    await expect(exportBtn).toHaveText('Export (0)');

    // 3. Preset Bookmarking: Clicking star bookmarks the preset (turns to ★ and card gets .bookmarked)
    const bookmarkBtn = firstCard.locator('.auracss-preset-bookmark');
    await expect(bookmarkBtn).toBeVisible();
    await expect(bookmarkBtn).toHaveText('☆');
    await bookmarkBtn.click();
    await expect(bookmarkBtn).toHaveText('★');
    await expect(firstCard).toHaveClass(/bookmarked/);

    // Clicking star again un-bookmarks
    await bookmarkBtn.click();
    await expect(bookmarkBtn).toHaveText('☆');
    await expect(firstCard).not.toHaveClass(/bookmarked/);

    // Re-bookmark for persistence
    await bookmarkBtn.click();
    await expect(bookmarkBtn).toHaveText('★');

    // 4. Clicking the card commits it
    await firstCard.click();
    await expect(exportBtn).toHaveText('Export (1)');
  });

  test('AI Variations: Bookmark persistence across cycle sets and hover-peek after drag-scroll', async ({ page }) => {
    const shadowHost = page.locator('#auracss-root');
    await shadowHost.locator('.auracss-toggle-btn').first().click();

    const exploreBtn = page.locator('#explore-btn');
    await exploreBtn.click();

    // 1. Immediately starts on AI variations (Set 1/3)
    const cycleBtn = shadowHost.locator('.auracss-ai-remodel-btn');
    await expect(cycleBtn).toHaveText(/1\/3/);

    // Bookmark the first card in Set 1/3 ('AI Modern Elevated Solid')
    const firstCard = shadowHost.locator('.auracss-preset-card').first();
    await expect(firstCard).toContainText('AI Modern Elevated Solid');
    const bookmarkBtn = firstCard.locator('.auracss-preset-bookmark');
    await expect(bookmarkBtn).toBeVisible();
    await bookmarkBtn.click();
    await expect(bookmarkBtn).toHaveText('★');
    await expect(firstCard).toHaveClass(/bookmarked/);

    // 2. Cycle variations: Set 1/3 -> Set 2/3 -> Set 3/3 -> Set 1/3
    await cycleBtn.click();
    await expect(cycleBtn).toHaveText(/2\/3/);
    await cycleBtn.click();
    await expect(cycleBtn).toHaveText(/3\/3/);
    await cycleBtn.click();
    await expect(cycleBtn).toHaveText(/1\/3/);

    // Verify bookmark persisted!
    const returnedFirstCard = shadowHost.locator('.auracss-preset-card').first();
    const returnedBookmarkBtn = returnedFirstCard.locator('.auracss-preset-bookmark');
    await expect(returnedBookmarkBtn).toHaveText('★');
    await expect(returnedFirstCard).toHaveClass(/bookmarked/);

    // 3. Test drag-scroll on cards track does not lock out hover-peek
    const track = shadowHost.locator('.auracss-cards-track');
    const trackBox = await track.boundingBox();
    if (trackBox) {
      await page.mouse.move(trackBox.x + trackBox.width / 2, trackBox.y + trackBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(trackBox.x + trackBox.width / 2 - 80, trackBox.y + trackBox.height / 2);
      await page.mouse.up();
    }
    // Wait for the 50ms synthetic drag suppression window to clear
    await page.waitForTimeout(100);

    // Hover over a preset card: peek MUST function immediately without clicking any card
    const targetCard = shadowHost.locator('.auracss-preset-card').nth(1);
    await targetCard.hover();
    await page.waitForTimeout(50);
    const peekedStyle = await exploreBtn.getAttribute('style');
    expect(peekedStyle).toBeTruthy();

    // Mouse leave unpeeks
    await page.mouse.move(0, 0);
    await page.waitForTimeout(50);
  });

  test('Typography Popover: Tracking, leading, text-alignment, and in-popover revert', async ({ page }) => {
    const shadowHost = page.locator('#auracss-root');
    await shadowHost.locator('.auracss-toggle-btn').first().click();

    const exploreBtn = page.locator('#explore-btn');
    await exploreBtn.click();

    // Open typography popover
    const typographyBtn = shadowHost.locator('.auracss-dock-palette-btn');
    await typographyBtn.click();

    const popover = shadowHost.locator('.auracss-palette-popover');
    await expect(popover).toBeVisible();

    // Sections check (7 sections total)
    const sections = popover.locator('.auracss-palette-section');
    await expect(sections).toHaveCount(7);

    // Apply tracking (Wide: 0.05em)
    const trackingPill = sections.nth(4).locator('.auracss-style-pill').filter({ hasText: /^Wide$/ });
    await trackingPill.click();
    await expect(exploreBtn).toHaveAttribute('style', /letter-spacing:\s*0\.05em/);

    // Apply leading (Relaxed: 1.75)
    const leadingPill = sections.nth(5).locator('.auracss-style-pill').filter({ hasText: 'Relaxed' });
    await leadingPill.click();
    await expect(exploreBtn).toHaveAttribute('style', /line-height:\s*1\.75/);

    // Apply text-align (Center)
    const alignPill = sections.nth(6).locator('.auracss-style-pill').filter({ hasText: 'Center' });
    await alignPill.click();
    await expect(exploreBtn).toHaveAttribute('style', /text-align:\s*center/);

    // Click in-popover Reset button
    const revertBtn = popover.locator('.auracss-palette-revert');
    await expect(revertBtn).toBeVisible();
    await revertBtn.click();

    // Verify typography styles reverted back to baseline
    const revertedStyle = await exploreBtn.getAttribute('style');
    expect(revertedStyle ?? '').not.toContain('letter-spacing');
    expect(revertedStyle ?? '').not.toContain('line-height');
    expect(revertedStyle ?? '').not.toContain('text-align');
  });

  test('Shortcut Key Alt+A: Activates without lockup and allows immediate Minimize & Export interaction', async ({ page }) => {
    const shadowHost = page.locator('#auracss-root');
    const toggleBtn = shadowHost.locator('.auracss-toggle-btn').first();
    const stack = shadowHost.locator('.auracss-controls-stack');
    const badge = shadowHost.locator('.auracss-min-badge');
    const minBtn = shadowHost.locator('.auracss-min-btn');
    const exportBtn = shadowHost.locator('.auracss-export-btn');
    const ledgerModal = shadowHost.locator('.auracss-ledger-modal');
    const ledgerClose = shadowHost.locator('.auracss-ledger-close');

    // 1. Initial state: OFF
    await expect(toggleBtn).toBeVisible();
    await expect(toggleBtn).toHaveText('AuraCSS: OFF');
    await expect(exportBtn).toBeHidden();

    // 2. Press Alt+A to activate for the first time
    await page.keyboard.press('Alt+KeyA');
    await expect(toggleBtn).toHaveText('AuraCSS: ON');
    await expect(exportBtn).toBeVisible();
    await expect(minBtn).toBeVisible();

    // 3. Immediately click Export button
    await exportBtn.click();
    await expect(ledgerModal).toHaveClass(/visible/);

    // 4. Close the Change Ledger modal
    await ledgerClose.click();
    await expect(ledgerModal).not.toHaveClass(/visible/);

    // 5. Immediately click Minimize button
    await minBtn.click();
    await expect(stack).toHaveClass(/minimized/);
    await expect(badge).toBeVisible();

    // 6. Click badge to re-expand controls
    await badge.click();
    await expect(stack).not.toHaveClass(/minimized/);
    await expect(toggleBtn).toBeVisible();

    // 7. Press Alt+A again to deactivate cleanly
    await page.keyboard.press('Alt+KeyA');
    await expect(toggleBtn).toHaveText('AuraCSS: OFF');
    await expect(exportBtn).toBeHidden();
  });

  test('UI Responsiveness across narrow mobile and landscape viewports', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 375, height: 667 },
      { width: 667, height: 375 },
    ];
    const shadowHost = page.locator('#auracss-root');
    await shadowHost.locator('.auracss-toggle-btn').first().click();
    await page.locator('#explore-btn').click();

    const controls = shadowHost.locator('.auracss-controls-stack');
    const toast = shadowHost.locator('.auracss-hud-toast');
    const dock = shadowHost.locator('.auracss-variation-dock');
    const breadcrumb = shadowHost.locator('.auracss-breadcrumb-bar');
    await expect(dock).toBeVisible();
    await expect(breadcrumb).toBeVisible();

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(80);
      const isToastVisible = await toast.evaluate((el) => el.classList.contains('visible'));
      const controlsBox = await controls.boundingBox();
      const toastBox = await toast.boundingBox();
      if (isToastVisible && controlsBox && toastBox) {
        expect(toastBox.y).toBeGreaterThanOrEqual(controlsBox.y + controlsBox.height);
      }
      for (const loc of [controls, dock, breadcrumb]) {
        const box = await loc.evaluate((el) => {
          const r = el.getBoundingClientRect();
          return { cls: el.className, x: r.left, y: r.top, width: r.width, height: r.height, winH: window.innerHeight };
        });
        expect(box.width, `${box.cls} width`).toBeGreaterThan(0);
        expect(box.x, `${box.cls} left`).toBeGreaterThanOrEqual(-1);
        expect(box.y, `${box.cls} top`).toBeGreaterThanOrEqual(-1);
        expect(box.x + box.width, `${box.cls} right`).toBeLessThanOrEqual(vp.width + 1);
        expect(box.y + box.height, `${box.cls} bottom (winH=${box.winH})`).toBeLessThanOrEqual(vp.height + 1);
      }
    }

    // Open Change Ledger modal on 375x667 and verify card stays inside viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await shadowHost.locator('.auracss-export-btn').click();
    const ledgerCard = shadowHost.locator('.auracss-ledger-card');
    await expect(ledgerCard).toBeVisible();
    const cardBox = await ledgerCard.boundingBox();
    expect(cardBox).not.toBeNull();
    expect(cardBox!.width).toBeLessThanOrEqual(375);
    expect(cardBox!.height).toBeLessThanOrEqual(667);
  });
});
