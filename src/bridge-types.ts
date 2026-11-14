export interface InspectedElement {
  tag: string;
  role?: string;
  selector?: string;
  htmlSnippet: string;
  innerText?: string;
  rect?: { width: number; height: number };
  computedStyles?: Record<string, string>;
  siteTokens?: Record<string, unknown>;
  parentLayout?: string;
  effectiveBackground?: { color: string; isDark: boolean };
  childSummary?: string;
  updatedAt: number;
  currentMutations?: {
    appliedCssText?: string;
    tailwindClasses?: string;
    lastPrompt?: string;
  };
}

export interface StyleInteraction {
  type: 'toggle-visibility' | 'toggle-class';
  className?: string;
}

export interface BridgePayload {
  cssText: string;
  mode?: 'replace' | 'patch';
  activeState?: string;
  hoverState?: string;
  keyframes?: string;
  interaction?: StyleInteraction;
  tailwindClasses?: string;
  prompt?: string;
  name?: string;
  description?: string;
  selector?: string;
}

export interface BridgeConfig {
  port: number;
  isMcp: boolean;
}

export interface ColorDef {
  hex: string;
  tw: string;
  isLight: boolean;
}

export interface ElementContextSnapshot {
  prompt: string;
  tag: string;
  role?: string;
  htmlSnippet?: string;
  innerText?: string;
  rect?: { width: number; height: number };
  computedStyles?: Record<string, string>;
  siteTokens?: Record<string, unknown>;
  parentLayout?: string;
  effectiveBackground?: { color: string; isDark: boolean };
  childSummary?: string;
  setIndex?: number;
}

export interface SynthesizeResponse {
  cssText: string;
  tailwindClasses: string;
  explanation: string;
}
