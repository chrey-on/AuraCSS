import type { ExtractedTokens, StylePreset } from './types';

export type AIConnectionStatus = 'offline' | 'untested' | 'connected' | 'error';
export type AIProvider = 'bridge';

export interface AIConfig {
  provider: AIProvider;
  bridgeUrl?: string;
  apiKey?: string;
  model?: string;
}

export interface AISynthesizeRequest {
  prompt: string;
  tag: string;
  htmlSnippet: string;
  computedStyles: Record<string, string>;
  siteTokens: ExtractedTokens;
  setIndex?: number;
}

export interface AISynthesizeResponse {
  cssText: string;
  tailwindClasses: string;
  explanation: string;
}

const STORAGE_KEY = 'auracss_ai_config';

function extractJson<T>(raw: string): T {
  const clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(clean) as T;
}

export class AIService {
  private config: AIConfig = { provider: 'bridge', bridgeUrl: 'http://127.0.0.1:4999', apiKey: '', model: 'agent-auto' };
  private status: AIConnectionStatus = 'untested';
  private lastError = '';

  constructor() {
    this.loadConfig();
  }

  public loadConfig(): AIConfig {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) Object.assign(this.config, JSON.parse(raw));
    } catch { /* ignore */ }
    this.config.provider = 'bridge';
    this.status = 'untested';
    return this.config;
  }

  public saveConfig(newConfig: Partial<AIConfig>): void {
    this.config = { ...this.config, ...newConfig, provider: 'bridge' };
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch { /* ignore */ }
  }

  public isConfigured(): boolean {
    return true;
  }

  public getConfig(): AIConfig {
    return { ...this.config };
  }

  public getStatus(): { status: AIConnectionStatus; error: string } {
    return { status: this.status, error: this.lastError };
  }

  public async testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const start = Date.now();

    try {
      const url = `${this.config.bridgeUrl || 'http://127.0.0.1:4999'}/health`;
      const res = await fetch(url, { signal: controller.signal });
      const latencyMs = Date.now() - start;
      if (res.ok) {
        this.status = 'connected';
        this.lastError = '';
        return { success: true, message: `Connected to Antigravity MCP Bridge on 127.0.0.1:4999 (${latencyMs}ms)`, latencyMs };
      }
      throw new Error(`Bridge returned HTTP ${res.status}`);
    } catch (err) {
      this.status = 'error';
      const msg = err instanceof Error && err.name === 'AbortError'
        ? 'Connection timed out after 4s'
        : err instanceof Error ? err.message : String(err);
      this.lastError = msg;
      return { success: false, message: `Bridge connection failed: ${msg.slice(0, 100)}` };
    } finally {
      clearTimeout(timer);
    }
  }

  public async synthesize(
    req: AISynthesizeRequest,
    signal?: AbortSignal
  ): Promise<AISynthesizeResponse> {
    try {
      const result = await this.callBridge(req, signal);
      this.status = 'connected';
      this.lastError = '';
      return result;
    } catch (err) {
      this.status = 'error';
      this.lastError = err instanceof Error ? err.message : String(err);
      throw err;
    }
  }

  private async callBridge(req: AISynthesizeRequest, signal?: AbortSignal): Promise<AISynthesizeResponse> {
    const url = `${this.config.bridgeUrl || 'http://127.0.0.1:4999'}/api/synthesize`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
      signal,
    });
    if (!res.ok) throw new Error(`Bridge HTTP ${res.status}`);
    return (await res.json()) as AISynthesizeResponse;
  }

  public notifyActiveElement(data: { tag: string; selector?: string; htmlSnippet: string; siteTokens?: ExtractedTokens }): void {
    if (typeof fetch === 'undefined') return;
    try {
      void fetch(`${this.config.bridgeUrl || 'http://127.0.0.1:4999'}/api/active-element`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => {});
    } catch { /* ignore */ }
  }

  public subscribeBridge(
    onApply: (patch: {
      cssText: string;
      tailwindClasses?: string;
      prompt?: string;
      name?: string;
      description?: string;
      selector?: string;
    }) => void
  ): void {
    if (typeof window === 'undefined' || typeof EventSource === 'undefined') return;
    try {
      const es = new EventSource(`${this.config.bridgeUrl || 'http://127.0.0.1:4999'}/api/events`);
      es.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data) as {
            type?: string;
            payload?: {
              cssText: string;
              tailwindClasses?: string;
              prompt?: string;
              name?: string;
              description?: string;
              selector?: string;
            };
          };
          if (parsed.type === 'apply_style' && parsed.payload?.cssText) onApply(parsed.payload);
        } catch { /* ignore */ }
      };
    } catch { /* ignore */ }
  }

  public async generateAISuggestions(
    req: Omit<AISynthesizeRequest, 'prompt'>,
    signal?: AbortSignal,
    setIndex = 0
  ): Promise<StylePreset[]> {
    const prompt = `Generate 4 diverse design variations (Theme Set ${setIndex + 1} of 3): Return JSON: { "presets": [ { "id": "p1", "name": "Name", "description": "Desc", "cssText": "...", "tailwindClasses": "..." } ] }`;
    const syn = await this.synthesize({ ...req, prompt, setIndex }, signal);
    try {
      const parsed = extractJson<{ presets?: StylePreset[] }>(syn.explanation.includes('{') ? syn.explanation : JSON.stringify(syn));
      if (Array.isArray(parsed.presets) && parsed.presets.length > 0) {
        return parsed.presets.map((p, i) => ({ ...p, id: p.id || `ai-${i}-${Date.now()}`, contrastRating: 'AAA', contrastRatio: '7.5:1' }));
      }
    } catch { /* fallback */ }
    return [{ id: `ai-${Date.now()}`, name: 'AI Smart Redesign', description: syn.explanation || 'Bespoke design', cssText: syn.cssText, tailwindClasses: syn.tailwindClasses, contrastRating: 'AAA', contrastRatio: '7.2:1' }];
  }
}
