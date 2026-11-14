// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AIService } from '../../src/ai';
import { AISettingsModal } from '../../src/ai-modal';
import { synthesizeDesignPrompt } from '../../src/prompt';
import type { ExtractedTokens } from '../../src/types';

describe('AIService & AISettingsModal (Zero-Key Agent Bridge & Diagnostics)', () => {
  let aiService: AIService;
  let shadow: ShadowRoot;
  const mockTokens: ExtractedTokens = {
    isDarkMode: true,
    primaryColor: '#6366f1',
    fontFamily: 'sans-serif',
    baseRadius: '8px',
  };

  beforeEach(() => {
    localStorage.clear();
    aiService = new AIService();
    document.body.innerHTML = '';
    const host = document.createElement('div');
    shadow = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);
  });

  afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('config initializes to zero-key Agent Bridge mode by default', () => {
    expect(aiService.isConfigured()).toBe(true);
    expect(aiService.getConfig().provider).toBe('bridge');
    expect(aiService.getConfig().bridgeUrl).toBe('http://127.0.0.1:4999');

    // Saving config maintains bridge provider
    aiService.saveConfig({ bridgeUrl: 'http://localhost:4999' });
    expect(aiService.getConfig().provider).toBe('bridge');
    expect(aiService.getConfig().bridgeUrl).toBe('http://localhost:4999');
  });

  it('mounts Antigravity Agent Diagnostics Modal and displays bridge metadata', () => {
    const modal = new AISettingsModal(aiService);
    modal.mount(shadow);

    const backdrop = shadow.querySelector('.auracss-ai-modal-backdrop') as HTMLElement;
    expect(backdrop).not.toBeNull();
    expect(backdrop.classList.contains('visible')).toBe(false);

    modal.show({ tag: 'button', selector: '#explore-btn' });
    expect(backdrop.classList.contains('visible')).toBe(true);

    const title = shadow.querySelector('.auracss-ai-modal-title');
    expect(title?.textContent).toContain('MCP Agent Diagnostics');

    const badge = shadow.querySelector('.auracss-ai-bridge-badge');
    expect(badge?.textContent).toContain('Agent Bridge Active');

    const targetVal = shadow.querySelector('#auracss-diag-target');
    expect(targetVal?.textContent).toBe('#explore-btn');

    modal.hide();
    expect(backdrop.classList.contains('visible')).toBe(false);

    modal.destroy();
  });

  it('verifies zero-key architecture: no API key or model input fields exist', () => {
    const modal = new AISettingsModal(aiService);
    modal.mount(shadow);
    modal.show();

    // Verify all legacy direct API key and model select fields are eliminated
    expect(shadow.querySelector('.auracss-ai-key-input')).toBeNull();
    expect(shadow.querySelector('.auracss-ai-select')).toBeNull();
    expect(shadow.querySelectorAll('input[type="password"]').length).toBe(0);

    // Verify only diagnostic ping button and close action exist
    const buttons = shadow.querySelectorAll('.auracss-ai-btn');
    expect(buttons.length).toBe(2);
    expect(buttons[0]?.textContent).toBe('Ping MCP Bridge');
    expect(buttons[1]?.textContent).toBe('Close');

    modal.destroy();
  });

  it('pings MCP Bridge successfully and updates latency status', async () => {
    const modal = new AISettingsModal(aiService);
    modal.mount(shadow);

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ok', uptime: 100 }),
    });

    modal.show();

    const statusEl = shadow.querySelector('.auracss-ai-status') as HTMLDivElement;
    expect(statusEl).not.toBeNull();

    const pingBtn = shadow.querySelector('.auracss-ai-btn-secondary') as HTMLButtonElement;
    await (pingBtn.onclick as () => Promise<void>)();

    expect(statusEl.classList.contains('connected')).toBe(true);
    expect(statusEl.textContent).toContain('Connected to MCP Bridge');

    // Dynamically adapts title and status when /health reports a connected MCP client
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ready', clientName: 'Cursor' }),
    });
    await (pingBtn.onclick as () => Promise<void>)();
    expect(shadow.querySelector('.auracss-ai-modal-title')?.textContent).toContain('Cursor Diagnostics');
    expect(statusEl.textContent).toContain('Connected to Cursor MCP Bridge');

    modal.destroy();
  });

  it('handles unreachable bridge gracefully with clear error state', async () => {
    const modal = new AISettingsModal(aiService);
    modal.mount(shadow);

    global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

    modal.show();

    const statusEl = shadow.querySelector('.auracss-ai-status') as HTMLDivElement;
    const pingBtn = shadow.querySelector('.auracss-ai-btn-secondary') as HTMLButtonElement;
    await (pingBtn.onclick as () => Promise<void>)();

    expect(statusEl.classList.contains('error')).toBe(true);
    expect(statusEl.textContent).toContain('Bridge connection failed');

    modal.destroy();
  });

  it('synthesizes design prompt via MCP bridge endpoint', async () => {
    const mockBridgeResponse = {
      cssText: 'background-color: #2563eb; color: #ffffff; border-radius: 9999px;',
      tailwindClasses: 'bg-blue-600 text-white rounded-full',
      explanation: 'Vibrant blue pill button synthesized by agent',
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBridgeResponse,
    });

    const btn = document.createElement('button');
    const preset = await synthesizeDesignPrompt('make it blue and pill', btn, mockTokens, aiService);

    expect(preset.name).toContain('AI:');
    expect(preset.cssText).toBe('background-color: #2563eb; color: #ffffff; border-radius: 9999px;');
    expect(preset.tailwindClasses).toBe('bg-blue-600 text-white rounded-full');
    expect(preset.description).toBe('Vibrant blue pill button synthesized by agent');
  });

  it('gracefully falls back to local rule engine when MCP bridge is offline', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Bridge offline'));

    const btn = document.createElement('button');
    const fallbackPreset = await synthesizeDesignPrompt('glass cyan pill button with glow', btn, mockTokens, aiService);

    expect(fallbackPreset.cssText).toContain('backdrop-filter: blur(12px)');
    expect(fallbackPreset.name).toContain('Aura:');
  });

  it('notifies active element to bridge daemon', () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchSpy;

    aiService.notifyActiveElement({
      tag: 'button',
      htmlSnippet: '<button id="cta">Click</button>',
      siteTokens: mockTokens,
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://127.0.0.1:4999/api/active-element',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('destroys modal cleanly removing backdrop from shadow DOM', () => {
    const modal = new AISettingsModal(aiService);
    modal.mount(shadow);
    expect(shadow.querySelector('.auracss-ai-modal-backdrop')).not.toBeNull();

    modal.destroy();
    expect(shadow.querySelector('.auracss-ai-modal-backdrop')).toBeNull();
  });

  it('routes bridge requests through chrome.runtime.sendMessage when running inside extension to avoid PNA popups', async () => {
    const sendMessageSpy = vi.fn((msg: any, cb?: (res: any) => void) => {
      if (msg.type === 'AURACSS_BRIDGE_FETCH' && msg.path === '/api/synthesize') {
        cb?.({
          ok: true,
          status: 200,
          data: {
            cssText: 'background: #10b981;',
            tailwindClasses: 'bg-emerald-500',
            explanation: 'Proxied via background worker',
          },
        });
      }
    });
    const fetchSpy = vi.fn();
    global.fetch = fetchSpy;
    (globalThis as any).chrome = {
      runtime: {
        sendMessage: sendMessageSpy,
        onMessage: { addListener: vi.fn(), removeListener: vi.fn() },
      },
    };

    const res = await aiService.synthesize({
      prompt: 'emerald button',
      tag: 'button',
      htmlSnippet: '<button>Go</button>',
      computedStyles: {},
      siteTokens: mockTokens,
    });

    expect(res.cssText).toBe('background: #10b981;');
    expect(sendMessageSpy).toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();

    delete (globalThis as any).chrome;
  });
});
