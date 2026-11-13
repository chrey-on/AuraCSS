import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';
import { createBridgeServer, setActiveElement, getActiveElement } from '../../src/bridge';

describe('AuraCSS Bridge & MCP Server', () => {
  let server: http.Server;
  const testPort = 5999;

  beforeAll(async () => {
    server = createBridgeServer(testPort);
    await new Promise<void>((resolve) => {
      server.listen(testPort, '127.0.0.1', () => resolve());
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('responds with ready status and CORS on /health', async () => {
    const res = await fetch(`http://127.0.0.1:${testPort}/health`);
    expect(res.status).toBe(200);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');

    const json = (await res.json()) as { status: string; mcp: boolean };
    expect(json.status).toBe('ready');
    expect(json.mcp).toBe(true);
  });

  it('receives active element updates on /api/active-element', async () => {
    const payload = {
      tag: 'button',
      htmlSnippet: '<button class="btn">Submit</button>',
      siteTokens: { primaryColor: '#2563eb' },
    };

    const res = await fetch(`http://127.0.0.1:${testPort}/api/active-element`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    expect(res.status).toBe(200);
    const active = getActiveElement();
    expect(active).not.toBeNull();
    expect(active?.tag).toBe('button');
    expect(active?.htmlSnippet).toContain('Submit');
  });

  it('synthesizes design styles on /api/synthesize', async () => {
    const res = await fetch(`http://127.0.0.1:${testPort}/api/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'frosted glass neon glow', tag: 'button' }),
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as { cssText: string; tailwindClasses: string; explanation: string };
    expect(json.cssText).toContain('backdrop-filter');
    expect(json.tailwindClasses).toContain('backdrop-blur');
  });

  it('cycles through 3 distinct variation themes via setIndex', async () => {
    // Set 0
    const res0 = await fetch(`http://127.0.0.1:${testPort}/api/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Generate 4 diverse design variations', tag: 'button', setIndex: 0 }),
    });
    const json0 = (await res0.json()) as { explanation: string };
    const presets0 = JSON.parse(json0.explanation).presets;
    expect(presets0[0].name).toBe('AI Modern Elevated Solid');

    // Set 1
    const res1 = await fetch(`http://127.0.0.1:${testPort}/api/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Generate 4 diverse design variations', tag: 'button', setIndex: 1 }),
    });
    const json1 = (await res1.json()) as { explanation: string };
    const presets1 = JSON.parse(json1.explanation).presets;
    expect(presets1[0].name).toBe('AI Warm Sunset Flame');

    // Set 2
    const res2 = await fetch(`http://127.0.0.1:${testPort}/api/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Generate 4 diverse design variations', tag: 'button', setIndex: 2 }),
    });
    const json2 = (await res2.json()) as { explanation: string };
    const presets2 = JSON.parse(json2.explanation).presets;
    expect(presets2[0].name).toBe('AI Cyberpunk Emerald Matrix');

    // Loop back to Set 0 on setIndex 3
    const res3 = await fetch(`http://127.0.0.1:${testPort}/api/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Generate 4 diverse design variations', tag: 'button', setIndex: 3 }),
    });
    const json3 = (await res3.json()) as { explanation: string };
    const presets3 = JSON.parse(json3.explanation).presets;
    expect(presets3[0].name).toBe('AI Modern Elevated Solid');
  });

  it('synthesizes colloquial prompt "just make it long and bigger" via bridge', async () => {
    const res = await fetch(`http://127.0.0.1:${testPort}/api/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'just make it long and bigger', tag: 'button' }),
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { cssText: string; tailwindClasses: string; explanation: string };
    expect(json.cssText).toContain('min-width: 240px');
    expect(json.cssText).toContain('font-size: 1.15rem');
    expect(json.tailwindClasses).toContain('min-w-[240px]');
  });

  it('synthesizes fading glow effect and click animations', async () => {
    const res = await fetch(`http://127.0.0.1:${testPort}/api/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'add a fading glow effect, add animations when clicking', tag: 'article' }),
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as { cssText: string; tailwindClasses: string; explanation: string };
    expect(json.cssText).toContain('box-shadow: 0 0 24px');
    expect(json.cssText).toContain('cursor: pointer;');
    expect(json.cssText).toContain('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(json.tailwindClasses).toContain('cursor-pointer');
    expect(json.tailwindClasses).toContain('active:scale-95');
  });

  it('maintains active element state helper functions and rejects mutations when null', async () => {
    setActiveElement(null);
    expect(getActiveElement()).toBeNull();

    // Verify rejection when activeElement is null
    const res = await fetch(`http://127.0.0.1:${testPort}/api/patch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cssText: 'color: red;' }),
    });
    expect(res.status).toBe(400);
    const json = (await res.json()) as { success: boolean; reminder: string };
    expect(json.success).toBe(false);
    expect(json.reminder).toContain('AuraCSS is turned OFF or no element is currently selected');

    // Set element and verify success
    setActiveElement({
      tag: 'div',
      htmlSnippet: '<div>Hero</div>',
      updatedAt: Date.now(),
    });
    expect(getActiveElement()?.tag).toBe('div');

    const res2 = await fetch(`http://127.0.0.1:${testPort}/api/patch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cssText: 'color: red;' }),
    });
    expect(res2.status).toBe(200);
  });
});
