export interface ExtractedTokens {
  isDarkMode: boolean;
  primaryColor: string;
  fontFamily: string;
  baseRadius: string;
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  cssText: string;
  tailwindClasses: string;
  contrastRatio?: string;
  contrastRating?: 'AAA' | 'AA' | 'FAIL';
  activeState?: string;
  hoverState?: string;
  keyframes?: string;
}

export interface StyleCommand {
  element: HTMLElement;
  selectorPath: string;
  previousCssText: string;
  appliedCssText: string;
  tailwindClasses: string;
  timestamp: number;
}

export interface ElementStrategy {
  supports(el: HTMLElement): boolean;
  generatePresets(el: HTMLElement, tokens: ExtractedTokens): StylePreset[];
}

export interface OverlayBoxMetrics {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface OverlayElements {
  rootHost: HTMLElement;
  shadowRoot: ShadowRoot;
  container: HTMLDivElement;
  ring: HTMLDivElement;
  pill: HTMLDivElement;
}

export interface BreadcrumbNode {
  element: HTMLElement;
  label: string;
  isCurrent: boolean;
}

export interface StylePatch {
  originalCssText: string;
  appliedCssText: string;
  tailwindClasses: string;
}

export interface SavedPromptedStyle {
  id: string;
  name: string;
  description: string;
  cssText: string;
  tailwindClasses: string;
  timestamp: number;
  contrastRating?: 'AAA' | 'AA' | 'FAIL';
  contrastRatio?: string;
}

export interface TypographyUpdate {
  property: string;
  value: string;
  tailwind: string;
  label?: string;
}
