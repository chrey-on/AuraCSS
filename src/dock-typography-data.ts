export interface FontDef {
  name: string;
  family: string;
  tailwind: string;
}

export const FONT_FAMILIES: readonly FontDef[] = [
  { name: 'System Sans', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', tailwind: 'font-sans' },
  { name: 'Inter / Sans', family: 'Inter, system-ui, sans-serif', tailwind: 'font-sans' },
  { name: 'Modern Mono', family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', tailwind: 'font-mono' },
  { name: 'Editorial Serif', family: 'Georgia, Cambria, "Times New Roman", serif', tailwind: 'font-serif' },
  { name: 'Display Heading', family: 'Impact, "Cabinet Grotesk", system-ui, sans-serif', tailwind: 'font-display' },
  { name: 'Rounded Friendly', family: '"Quicksand", "Nunito", system-ui, sans-serif', tailwind: 'font-sans' },
  { name: 'Geometric Clean', family: '"Poppins", "Montserrat", system-ui, sans-serif', tailwind: 'font-sans' },
];

export interface FontSizeDef {
  label: string;
  size: string;
  tailwind: string;
}

export const FONT_SIZES: readonly FontSizeDef[] = [
  { label: 'XS (12px)', size: '12px', tailwind: 'text-xs' },
  { label: 'SM (14px)', size: '14px', tailwind: 'text-sm' },
  { label: 'MD (16px)', size: '16px', tailwind: 'text-base' },
  { label: 'LG (18px)', size: '18px', tailwind: 'text-lg' },
  { label: 'XL (22px)', size: '22px', tailwind: 'text-xl' },
  { label: '2XL (28px)', size: '28px', tailwind: 'text-2xl' },
];

export interface FontColorDef {
  name: string;
  hex: string;
  tailwind: string;
}

export const FONT_COLORS: readonly FontColorDef[] = [
  { name: 'Pure White', hex: '#ffffff', tailwind: 'text-white' },
  { name: 'Slate 100', hex: '#f1f5f9', tailwind: 'text-slate-100' },
  { name: 'Muted Slate', hex: '#94a3b8', tailwind: 'text-slate-400' },
  { name: 'Sky Cyan', hex: '#38bdf8', tailwind: 'text-sky-400' },
  { name: 'Electric Violet', hex: '#a855f7', tailwind: 'text-purple-400' },
  { name: 'Emerald Neon', hex: '#34d399', tailwind: 'text-emerald-400' },
  { name: 'Warm Amber', hex: '#fbbf24', tailwind: 'text-amber-400' },
  { name: 'Rose Flame', hex: '#f87171', tailwind: 'text-rose-400' },
  { name: 'Deep Slate', hex: '#0f172a', tailwind: 'text-slate-900' },
];

export interface FontStyleDef {
  label: string;
  property: string;
  value: string;
  tailwind: string;
}

export const FONT_STYLES: readonly FontStyleDef[] = [
  { label: 'Regular (400)', property: 'font-weight', value: '400', tailwind: 'font-normal' },
  { label: 'Medium (500)', property: 'font-weight', value: '500', tailwind: 'font-medium' },
  { label: 'Semibold (600)', property: 'font-weight', value: '600', tailwind: 'font-semibold' },
  { label: 'Bold (700)', property: 'font-weight', value: '700', tailwind: 'font-bold' },
  { label: 'Extrabold (800)', property: 'font-weight', value: '800', tailwind: 'font-extrabold' },
  { label: 'Italic', property: 'font-style', value: 'italic', tailwind: 'italic' },
  { label: 'Uppercase', property: 'text-transform', value: 'uppercase', tailwind: 'uppercase tracking-wider' },
  { label: 'Underline', property: 'text-decoration', value: 'underline', tailwind: 'underline' },
  { label: 'Strike', property: 'text-decoration', value: 'line-through', tailwind: 'line-through' },
];

export const LETTER_SPACINGS: readonly FontStyleDef[] = [
  { label: 'Tighter', property: 'letter-spacing', value: '-0.05em', tailwind: 'tracking-tighter' },
  { label: 'Tight', property: 'letter-spacing', value: '-0.025em', tailwind: 'tracking-tight' },
  { label: 'Normal', property: 'letter-spacing', value: '0em', tailwind: 'tracking-normal' },
  { label: 'Wide', property: 'letter-spacing', value: '0.05em', tailwind: 'tracking-wide' },
  { label: 'Widest', property: 'letter-spacing', value: '0.1em', tailwind: 'tracking-widest' },
];

export const LINE_HEIGHTS: readonly FontStyleDef[] = [
  { label: 'Tight (1.2)', property: 'line-height', value: '1.2', tailwind: 'leading-tight' },
  { label: 'Snug (1.37)', property: 'line-height', value: '1.375', tailwind: 'leading-snug' },
  { label: 'Normal (1.5)', property: 'line-height', value: '1.5', tailwind: 'leading-normal' },
  { label: 'Relaxed (1.75)', property: 'line-height', value: '1.75', tailwind: 'leading-relaxed' },
];

export const TEXT_ALIGNS: readonly FontStyleDef[] = [
  { label: 'Left', property: 'text-align', value: 'left', tailwind: 'text-left' },
  { label: 'Center', property: 'text-align', value: 'center', tailwind: 'text-center' },
  { label: 'Right', property: 'text-align', value: 'right', tailwind: 'text-right' },
  { label: 'Justify', property: 'text-align', value: 'justify', tailwind: 'text-justify' },
];
