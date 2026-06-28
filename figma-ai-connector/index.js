require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { analyzeAndColor } = require("./tools/analyzeColors");
const { buildPluginScript } = require("./tools/buildPluginScript");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// ── Connector manifest ────────────────────────────────────────────────────────
// Figma fetches this when the connector is registered.
app.get("/manifest", (req, res) => {
  res.json({
    schema_version: "v1",
    name: "Chroma AI",
    tagline: "Analyze and color your designs with AI",
    description:
      "Select elements on your canvas and describe your intent in natural language. " +
      "Chroma AI analyzes the selection's hierarchy and semantic context, then applies " +
      "a harmonious color palette across fills, strokes, and text.",
    auth: { type: "none" },
    tools: [
      {
        name: "analyze_and_color",
        description:
          "Analyzes the selected Figma elements and applies an AI-generated color palette " +
          "based on the user's described intent (mood, brand, style).",
        input_schema: {
          type: "object",
          required: ["elements"],
          properties: {
            elements: {
              type: "array",
              description: "Array of Figma node descriptors from the current selection.",
              items: {
                type: "object",
                required: ["nodeId", "name", "type"],
                properties: {
                  nodeId:    { type: "string", description: "Figma node ID (e.g. '123:456')" },
                  name:      { type: "string", description: "Node name from the layers panel" },
                  type:      { type: "string", description: "Node type: FRAME, RECTANGLE, TEXT, VECTOR, etc." },
                  hasFill:   { type: "boolean" },
                  hasStroke: { type: "boolean" },
                  isText:    { type: "boolean" },
                  depth:     { type: "integer", description: "Nesting depth (0 = top-level)" },
                },
              },
            },
            intent: {
              type: "string",
              description:
                "Natural language description of the desired color direction. " +
                "e.g. 'calm medical blue', 'bold fintech dark mode', 'warm earthy tones'",
            },
          },
        },
      },
    ],
  });
});

// ── Tool invocation ───────────────────────────────────────────────────────────
// Figma POSTs here when the AI chat decides to call a tool.
app.post("/invoke", async (req, res) => {
  const { tool, input } = req.body;

  if (tool !== "analyze_and_color") {
    return res.status(400).json({ error: `Unknown tool: ${tool}` });
  }

  const { elements, intent } = input || {};

  if (!elements || !Array.isArray(elements) || elements.length === 0) {
    return res.status(400).json({ error: "elements array is required and must be non-empty" });
  }

  try {
    const analysis = await analyzeAndColor(elements, intent);
    const pluginScript = buildPluginScript(analysis);

    res.json({
      type: "tool_result",
      palette_name: analysis.palette_name,
      rationale: analysis.rationale,
      assignments: analysis.assignments,
      // Figma AI can run this plugin script directly in the canvas
      plugin_script: pluginScript,
      // Human-readable summary for the chat response
      summary: buildSummary(analysis),
    });
  } catch (err) {
    console.error("analyze_and_color failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => res.json({ status: "ok", service: "chroma-ai" }));

// ── Root redirect ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.redirect("/manifest"));

function buildSummary(analysis) {
  const colored = analysis.assignments.filter((a) => a.fill || a.stroke).length;
  const roles = [...new Set(analysis.assignments.map((a) => a.role))].join(", ");
  return (
    `Applied palette **${analysis.palette_name}** to ${colored} element(s). ` +
    `${analysis.rationale} ` +
    `Roles covered: ${roles}.`
  );
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Chroma AI connector running on http://localhost:${PORT}`);
  console.log(`  Manifest:  GET  /manifest`);
  console.log(`  Invoke:    POST /invoke`);
  console.log(`  Health:    GET  /health`);
});
