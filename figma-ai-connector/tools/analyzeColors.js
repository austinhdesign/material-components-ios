const Anthropic = require("@anthropic-ai/sdk");

const TIMEOUT_MS = 25_000;
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Chroma AI, an expert UI/UX designer specializing in color theory and Figma design systems.

When given a list of Figma elements (nodes) from a selected screen, you analyze:
- The semantic role of each element (button, background, heading, body text, icon, divider, card, etc.)
- The visual hierarchy implied by names, types, and nesting
- The user's stated intent (mood, brand, palette style)

You ALWAYS respond with a JSON object matching this exact schema — no markdown fences, no prose:
{
  "palette_name": "string — a short evocative name for the palette",
  "rationale": "string — 1–2 sentences explaining the color story",
  "assignments": [
    {
      "nodeId": "string",
      "nodeName": "string",
      "role": "string — semantic role (e.g. primary-bg, cta-button, body-text)",
      "fill": { "r": 0-1, "g": 0-1, "b": 0-1, "a": 0-1 } | null,
      "stroke": { "r": 0-1, "g": 0-1, "b": 0-1, "a": 0-1 } | null,
      "reason": "string — 1 sentence why this color"
    }
  ]
}

Color values use Figma's normalized 0–1 float range (not 0–255).
Only set fill or stroke if the element actually has that property type; use null otherwise.
Ensure WCAG AA contrast (≥4.5:1) for text on its background.`;

async function analyzeAndColor(elements, intent) {
  // Cap at 40 nodes to keep the prompt tight and the response fast
  const capped = elements.slice(0, 40);

  const elementSummary = capped
    .map(
      (el) =>
        `- nodeId: ${el.nodeId}, name: "${el.name}", type: ${el.type}, ` +
        `hasFill: ${el.hasFill}, hasStroke: ${el.hasStroke}, ` +
        `isText: ${el.isText}, depth: ${el.depth}`
    )
    .join("\n");

  const userMessage =
    `User intent: "${intent || "apply a clean, modern color palette"}"\n\n` +
    `Selected elements (${capped.length} total):\n${elementSummary}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let message;
  try {
    message = await client.messages.create(
      {
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      },
      { signal: controller.signal }
    );
  } finally {
    clearTimeout(timer);
  }

  const raw = message.content[0].text.trim();
  // Strip markdown fences if the model wraps the JSON anyway
  const json = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  return JSON.parse(json);
}

module.exports = { analyzeAndColor };
