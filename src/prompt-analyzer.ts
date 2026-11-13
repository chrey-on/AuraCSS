export interface PromptAnalysis {
  colorHex: string;
  twColor: string;
  hasExplicitColor: boolean;
  hasBgIntent: boolean;
  hasTextIntent: boolean;
  hasBorderIntent: boolean;
  isGlass: boolean;
  isGlow: boolean;
  isGradient: boolean;
  isMinimal: boolean;
  radius: string;
  twRadius: string;
  padding: string;
  twPadding: string;
  isLonger: boolean;
  isBigger: boolean;
  isCompact: boolean;
  isPop: boolean;
  isSoften: boolean;
  isFading: boolean;
  isClick: boolean;
  isAnimation: boolean;
  // Lay-person intent flags – optional for backward compatibility
  isProfessional?: boolean;
  isLuxury?: boolean;
  isSpacious?: boolean;
  isUgly?: boolean;
  isFriendly?: boolean;
  isMatch?: boolean;
  fontSize?: string;
  twFontSize?: string;
  minWidth?: string;
}

export function isLightColor(hex: string): boolean {
  if (hex.startsWith('#') && hex.length >= 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160;
  }
  return false;
}

export function analyzePromptText(text: string, defaultColor: string): PromptAnalysis {
  const t = text.toLowerCase();

  const hasNegatedBg = /\b(remove|no|without|clear|transparent)\s+(?:the\s+)?(?:background|bg|fill)\b/i.test(t);
  const hasBgIntent = !hasNegatedBg && (t.includes('background') || t.includes('bg') || t.includes('fill'));
  const hasBorderIntent = t.includes('border') || t.includes('outline') || t.includes('stroke') || hasNegatedBg;
  const hasTextIntent = t.includes('text') || t.includes('font') || (!hasBgIntent && !hasBorderIntent && t.includes('color'));

  let colorHex = defaultColor;
  let twColor = 'indigo-500';
  let hasExplicitColor = false;

  const hexMatch = t.match(/#([0-9a-f]{6}|[0-9a-f]{3})/i);
  if (hexMatch) {
    colorHex = hexMatch[0];
    twColor = `[${hexMatch[0]}]`;
    hasExplicitColor = true;
  } else if (t.includes('ruby')) {
    colorHex = '#e11d48';
    twColor = 'rose-600';
    hasExplicitColor = true;
  } else if (t.includes('cyan') || t.includes('sky')) {
    colorHex = '#38bdf8';
    twColor = 'sky-400';
    hasExplicitColor = true;
  } else if (t.includes('blue')) {
    colorHex = '#2563eb';
    twColor = 'blue-600';
    hasExplicitColor = true;
  } else if (t.includes('purple') || t.includes('violet')) {
    colorHex = '#a855f7';
    twColor = 'purple-500';
    hasExplicitColor = true;
  } else if (t.includes('emerald') || t.includes('green')) {
    colorHex = '#10b981';
    twColor = 'emerald-500';
    hasExplicitColor = true;
  } else if (t.includes('crimson')) {
    colorHex = '#dc2626';
    twColor = 'red-600';
    hasExplicitColor = true;
  } else if (t.includes('red')) {
    colorHex = '#ef4444';
    twColor = 'red-500';
    hasExplicitColor = true;
  } else if (t.includes('rose') || t.includes('pink')) {
    colorHex = '#f43f5e';
    twColor = 'rose-500';
    hasExplicitColor = true;
  } else if (t.includes('yellow')) {
    colorHex = '#eab308';
    twColor = 'yellow-500';
    hasExplicitColor = true;
  } else if (t.includes('teal')) {
    colorHex = '#14b8a6';
    twColor = 'teal-500';
    hasExplicitColor = true;
  } else if (t.includes('amber') || t.includes('orange') || t.includes('gold')) {
    colorHex = '#f59e0b';
    twColor = 'amber-500';
    hasExplicitColor = true;
  } else if (t.includes('slate') || t.includes('dark') || t.includes('black')) {
    colorHex = '#0f172a';
    twColor = 'slate-900';
    hasExplicitColor = true;
  } else if (t.includes('white') || t.includes('light')) {
    colorHex = '#ffffff';
    twColor = 'white';
    hasExplicitColor = true;
  }

  const isGlass = t.includes('glass') || t.includes('frost') || t.includes('blur') || t.includes('translucent');
  const isGlow = t.includes('glow') || t.includes('neon') || t.includes('ambient') || t.includes('luminous') || t.includes('pulse') || t.includes('pulsing');
  const isGradient = t.includes('gradient') || t.includes('mesh') || t.includes('vibrant');
  const isMinimal = t.includes('minimal') || t.includes('flat') || t.includes('sharp') || t.includes('clean');

  const isLonger = Boolean(t.match(/\b(long|longer|wide|wider|broad|stretched|expand|lengthy)\b/i));
  const isBigger = Boolean(t.match(/\b(big|bigger|large|larger|huge|chunky|giant|spacious|breathing room|roomy|airiness)\b/i));
  const isCompact = Boolean(t.match(/\b(compact|small|smaller|tight|tiny|thin|slender)\b/i));
  const isPop = Boolean(t.match(/\b(pop|pops|standout|punchy|bold)\b/i));
  const isSoften = Boolean(t.match(/\b(soften|softer|smooth|smoothen)\b/i));
  const isFading = t.includes('fading') || t.includes('fade') || t.includes('pulse') || t.includes('pulsing');
  const isClick = t.includes('click') || t.includes('clicking') || t.includes('press') || t.includes('tap');
  const isAnimation = t.includes('animat') || t.includes('motion') || t.includes('bounce');

  // Lay-person intent flags
  const isProfessional = Boolean(t.match(/\b(professional|corporate|executive|sleek)\b/i));
  const isLuxury = Boolean(t.match(/\b(expensive|luxury|premium|high[- ]?end)\b/i));
  const isSpacious = Boolean(t.match(/\b(crowded|cramped|suffocating|tight)\b/i));
  const isUgly = Boolean(t.match(/\b(ugly|cheap|outdated|clunky)\b/i));
  const isFriendly = Boolean(t.match(/\b(friendly|approachable|playful|soft)\b/i));
  const isMatch = Boolean(t.match(/\b(match|blend in|fit in)\b/i));

  let radius = '8px';
  let twRadius = 'rounded-lg';
  if (t.includes('pill') || t.includes('round') || t.includes('oval')) {
    radius = '9999px';
    twRadius = 'rounded-full';
  } else if (t.includes('sharp') || t.includes('square') || t.includes('box') || t.includes('brutalist')) {
    radius = '0px';
    twRadius = 'rounded-none';
  } else if (t.includes('curved') || t.includes('card') || isSoften) {
    radius = '16px';
    twRadius = 'rounded-2xl';
  }

  let padding = '10px 20px';
  let twPadding = 'px-5 py-2.5';
  let fontSize: string | undefined;
  let twFontSize: string | undefined;
  let minWidth: string | undefined;

  if (isLonger && isBigger) {
    padding = '16px 36px';
    twPadding = 'px-9 py-4 text-lg';
    fontSize = '1.15rem';
    twFontSize = 'text-lg';
    minWidth = '240px';
  } else if (isLonger) {
    padding = '10px 32px';
    twPadding = 'px-8 py-2.5';
    minWidth = '200px';
  } else if (isBigger) {
    padding = '14px 28px';
    twPadding = 'px-7 py-3.5 text-base';
    fontSize = '1.1rem';
    twFontSize = 'text-base';
  } else if (isCompact) {
    padding = '6px 12px';
    twPadding = 'px-3 py-1.5 text-xs';
    fontSize = '0.85rem';
    twFontSize = 'text-xs';
  }

  return {
    colorHex,
    twColor,
    hasExplicitColor,
    hasBgIntent,
    hasTextIntent,
    hasBorderIntent,
    isGlass,
    isGlow,
    isGradient,
    isMinimal,
    radius,
    twRadius,
    padding,
    twPadding,
    isLonger,
    isBigger,
    isCompact,
    isPop,
    isSoften,
    isFading,
    isClick,
    isAnimation,
    isProfessional,
    isLuxury,
    isSpacious,
    isUgly,
    isFriendly,
    isMatch,
    fontSize,
    twFontSize,
    minWidth,
  };
}
