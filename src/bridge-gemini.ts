import type { ElementContextSnapshot, SynthesizeResponse } from './bridge-types';

export async function synthesizeWithGemini(
  context: ElementContextSnapshot,
  apiKey: string,
  model = 'gemini-2.0-flash'
): Promise<SynthesizeResponse | null> {
  if (!apiKey) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const systemPrompt = `You are AuraCSS, an Elite Principal UI/UX Product Designer for Non-Technical Stakeholders.
Your task is to translate vague, colloquial, or emotional design feedback into elegant, accessible, production-ready CSS and Tailwind utility classes.

You specialize in interpreting layman language:
- "make it pop" / "punchy" → bold elevation, stronger shadow, higher contrast
- "feels clunky" / "outdated" → modern rounded corners, refined shadows, cleaner spacing
- "too plain" / "boring" → subtle gradients, refined borders, micro-interactions
- "expensive look" / "luxury" → warm alabaster or deep dark base, generous letter-spacing, ultra-thin borders, restrained accents
- "crowded" / "cramped" → increase padding, line-height, and whitespace
- "friendly" / "approachable" → rounded-2xl, warm pastel tones, soft ambient glow
- "professional" / "corporate" → neutral palette, crisp 1px borders, subtle micro-shadows
- "match" / "blend in" → harmonize with provided site theme tokens

Rules:
1. Return ONLY a valid JSON object with keys "cssText", "tailwindClasses", and "explanation".
2. cssText MUST contain valid CSS property declarations (e.g. "background-color: #0f172a; color: #38bdf8; border-radius: 9999px; box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);").
3. tailwindClasses MUST contain equivalent Tailwind utility classes.
4. Ensure WCAG AA accessibility (contrast ratio >= 4.5:1) – auto-correct text/background pairs that fail contrast.
5. Adapt styling to element type: buttons get interactive states and shadows; cards get layered shadows and padding; headings get tight tracking and bold weights.
6. Provide a concise 1-sentence description in explanation.`;

    const userContent = `Target Element: <${context.tag}> (${context.role || 'element'})
HTML Snippet: ${context.htmlSnippet || `<${context.tag}></${context.tag}>`}
Inner Text: ${context.innerText || 'None'}
Size: ${context.rect ? `${context.rect.width}x${context.rect.height}px` : 'unknown'}
Parent Layout: ${context.parentLayout || 'normal flow'}
Contents: ${context.childSummary || 'unknown'}
Surface Background: ${context.effectiveBackground ? `${context.effectiveBackground.color} (${context.effectiveBackground.isDark ? 'dark surface' : 'light surface'})` : 'unknown'}
Computed Styles: ${JSON.stringify(context.computedStyles || {})}
Site Theme Tokens: ${JSON.stringify(context.siteTokens || {})}

User Design Intent: "${context.prompt}"`;

    let url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    let res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userContent}` }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      }),
      signal: controller.signal,
    });

    // Fallback to gemini-1.5-flash if model endpoint encounters a 404 or temporary failure
    if (!res.ok && model !== 'gemini-1.5-flash') {
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userContent}` }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
        }),
        signal: controller.signal,
      });
    }

    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) return null;

    const cleanedJson = rawJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanedJson) as Partial<SynthesizeResponse>;
    if (parsed.cssText) {
      return {
        cssText: parsed.cssText.trim(),
        tailwindClasses: parsed.tailwindClasses?.trim() || '',
        explanation: parsed.explanation?.trim() || `Styled <${context.tag}> with Gemini`,
      };
    }
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }

  return null;
}
