// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { VariationDock } from '../../src/dock';
import { synthesizeWithGemini } from '../../src/bridge-gemini';

describe('In-Dock AI Prompt Bar & Gemini Synthesis', () => {
  let dock: VariationDock;
  let shadow: ShadowRoot;

  beforeEach(() => {
    document.body.innerHTML = '';
    const host = document.createElement('div');
    shadow = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);

    dock = new VariationDock();
    dock.mount(shadow);
  });

  afterEach(() => {
    dock.destroy();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('does not render deprecated in-dock prompt bar', () => {
    dock.render([], vi.fn());

    const promptBar = shadow.querySelector('.auracss-dock-prompt-bar');
    expect(promptBar).toBeNull();

    const input = shadow.querySelector('.auracss-dock-prompt-input');
    expect(input).toBeNull();
  });

  it('renders clean dock layout with track, typography and saved popovers', () => {
    dock.render([], vi.fn());

    const track = shadow.querySelector('.auracss-cards-track');
    expect(track).not.toBeNull();

    const typoBtn = shadow.querySelector('.auracss-dock-tune-btn');
    expect(typoBtn).not.toBeNull();

    const savedBtn = shadow.querySelector('.auracss-saved-styles-btn');
    expect(savedBtn).not.toBeNull();
  });

  it('synthesizeWithGemini parses JSON response correctly when API returns valid candidate', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    cssText: 'background-color: #0f172a; color: #38bdf8; border-radius: 9999px;',
                    tailwindClasses: 'bg-slate-900 text-sky-400 rounded-full',
                    explanation: 'Obsidian cyan capsule styling',
                  }),
                },
              ],
            },
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const result = await synthesizeWithGemini(
      {
        prompt: 'obsidian cyan capsule',
        tag: 'button',
        htmlSnippet: '<button>Click</button>',
        computedStyles: { color: 'rgb(255, 255, 255)' },
        siteTokens: { isDarkMode: true },
      },
      'test-api-key'
    );

    expect(result).not.toBeNull();
    expect(result?.cssText).toContain('border-radius: 9999px');
    expect(result?.tailwindClasses).toContain('rounded-full');
    expect(result?.explanation).toBe('Obsidian cyan capsule styling');
  });

  it('synthesizeWithGemini returns null when apiKey is missing or fetch fails', async () => {
    const noKey = await synthesizeWithGemini(
      { prompt: 'test', tag: 'div' },
      ''
    );
    expect(noKey).toBeNull();

    const mockFetchFail = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', mockFetchFail);

    const failed = await synthesizeWithGemini(
      { prompt: 'test', tag: 'div' },
      'invalid-key'
    );
    expect(failed).toBeNull();
  });
});
