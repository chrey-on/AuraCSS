// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HierarchyManager, formatElementLabel } from '../../src/hierarchy';
import { AuraCSSApp } from '../../src/main';

describe('HierarchyManager (Ancestor Breadcrumbs & Traversal)', () => {
  let hierarchy: HierarchyManager;
  let hostContainer: HTMLElement;
  let shadow: ShadowRoot;

  beforeEach(() => {
    document.body.innerHTML = '';
    hostContainer = document.createElement('div');
    hostContainer.id = 'auracss-root';
    shadow = hostContainer.attachShadow({ mode: 'open' });
    document.body.appendChild(hostContainer);

    hierarchy = new HierarchyManager();
    hierarchy.mount(shadow);
  });

  afterEach(() => {
    hierarchy.destroy();
    document.body.innerHTML = '';
  });

  it('formats element labels with tag, id, and primary class', () => {
    const el1 = document.createElement('button');
    el1.id = 'submit-btn';
    el1.className = 'primary large';
    expect(formatElementLabel(el1)).toBe('button#submit-btn.primary');

    const el2 = document.createElement('div');
    el2.className = 'container';
    expect(formatElementLabel(el2)).toBe('div.container');

    const el3 = document.createElement('span');
    expect(formatElementLabel(el3)).toBe('span');
  });

  it('builds ancestor path from target up to top landmark', () => {
    const section = document.createElement('section');
    section.id = 'hero';

    const card = document.createElement('div');
    card.className = 'card';

    const btn = document.createElement('button');
    btn.className = 'btn';

    card.appendChild(btn);
    section.appendChild(card);
    document.body.appendChild(section);

    const path = hierarchy.buildBreadcrumbPath(btn);
    expect(path.length).toBe(3);
    expect(path[0]?.label).toBe('section#hero');
    expect(path[0]?.isCurrent).toBe(false);
    expect(path[1]?.label).toBe('div.card');
    expect(path[1]?.isCurrent).toBe(false);
    expect(path[2]?.label).toBe('button.btn');
    expect(path[2]?.isCurrent).toBe(true);
  });

  it('renders interactive breadcrumb bar and fires onSelect on click', () => {
    const section = document.createElement('section');
    const btn = document.createElement('button');
    section.appendChild(btn);
    document.body.appendChild(section);

    const onSelect = vi.fn();
    hierarchy.render(btn, onSelect);

    const bar = shadow.querySelector('.auracss-breadcrumb-bar');
    expect(bar?.classList.contains('visible')).toBe(true);

    const items = shadow.querySelectorAll('.auracss-breadcrumb-item');
    expect(items.length).toBe(2);
    expect(items[0]?.textContent).toBe('section');
    expect(items[1]?.textContent).toBe('button');
    expect(items[1]?.classList.contains('current')).toBe(true);

    // Clicking section calls onSelect with section
    (items[0] as HTMLElement).click();
    expect(onSelect).toHaveBeenCalledWith(section);
  });

  it('navigates up and down through DOM tree and tracks selection stack', () => {
    const wrapper = document.createElement('div');
    wrapper.id = 'wrapper';

    const child = document.createElement('button');
    child.id = 'child-btn';

    wrapper.appendChild(child);
    document.body.appendChild(wrapper);

    // Navigate up
    const parent = hierarchy.navigateUp(child);
    expect(parent).toBe(wrapper);

    // Navigate up again from top element should return null
    const topParent = hierarchy.navigateUp(wrapper);
    expect(topParent).toBeNull();

    // Navigate down should pop the previous child
    const downChild = hierarchy.navigateDown(wrapper);
    expect(downChild).toBe(child);

    // Navigate down from child leaf returns null
    expect(hierarchy.navigateDown(child)).toBeNull();
  });
});

describe('AuraCSSApp Hierarchical Keyboard Navigation (ArrowUp/ArrowDown)', () => {
  let app: AuraCSSApp;

  beforeEach(() => {
    document.body.innerHTML = '';
    app = new AuraCSSApp();
    app.init();
    app.activate();
  });

  afterEach(() => {
    app.destroy();
    document.body.innerHTML = '';
  });

  it('traverses up on ArrowUp and back down on ArrowDown', async () => {
    const parent = document.createElement('div');
    parent.id = 'parent-box';

    const child = document.createElement('button');
    child.id = 'child-btn';

    parent.appendChild(child);
    document.body.appendChild(parent);

    // Lock child
    child.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const shadow = document.getElementById('auracss-root')?.shadowRoot;
    let pill = shadow?.querySelector('.auracss-pill');
    expect(pill?.textContent).toBe('button#child-btn');

    // ArrowUp -> locks parent
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    pill = shadow?.querySelector('.auracss-pill');
    expect(pill?.textContent).toBe('div#parent-box');

    // ArrowDown -> locks child
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    pill = shadow?.querySelector('.auracss-pill');
    expect(pill?.textContent).toBe('button#child-btn');
  });
});
