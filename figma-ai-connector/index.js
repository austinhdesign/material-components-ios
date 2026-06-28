require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { SSEServerTransport } = require("@modelcontextprotocol/sdk/server/sse.js");
const { z } = require("zod");
const { analyzeAndColor } = require("./tools/analyzeColors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// ── MCP Server definition ────────────────────────────────────────────────────

const server = new McpServer({
  name: "Chroma AI",
  version: "1.0.0",
});

const ElementSchema = z.object({
  nodeId:    z.string().describe("Figma node ID, e.g. '123:456'"),
  name:      z.string().describe("Node name from the layers panel"),
  type:      z.string().describe("Node type: FRAME, RECTANGLE, TEXT, VECTOR, etc."),
  hasFill:   z.boolean().optional(),
  hasStroke: z.boolean().optional(),
  isText:    z.boolean().optional(),
  depth:     z.number().int().optional().describe("Nesting depth; 0 = top-level"),
});

server.tool(
  "analyze_and_color",
  "Analyze selected Figma elements and generate a harmonious AI color palette. " +
  "Pass the node list from the current canvas selection and describe the desired " +
  "mood, brand, or style. Returns fill/stroke color assignments for each element " +
  "along with a palette name and rationale.",
  {
    elements: z.array(ElementSchema).min(1).describe(
      "Array of Figma node descriptors from the current selection (include children for hierarchy context)."
    ),
    intent: z.string().optional().describe(
      "Natural language color direction, e.g. 'calm medical blue', 'bold fintech dark mode', 'warm earthy tones'."
    ),
  },
  async ({ elements, intent }) => {
    const analysis = await analyzeAndColor(elements, intent);

    const colored = analysis.assignments.filter((a) => a.fill || a.stroke).length;
    const summary =
      `Applied palette **${analysis.palette_name}** to ${colored} element(s). ` +
      `${analysis.rationale}`;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            palette_name: analysis.palette_name,
            rationale:    analysis.rationale,
            assignments:  analysis.assignments,
            summary,
          }, null, 2),
        },
      ],
    };
  }
);

// ── SSE transport (one session per client connection) ────────────────────────
// Figma connects to GET /sse and sends messages to POST /messages

const transports = {};

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;
  res.on("close", () => delete transports[transport.sessionId]);
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  if (!transport) {
    return res.status(400).json({ error: "Unknown sessionId" });
  }
  await transport.handlePostMessage(req, res, req.body);
});

// ── REST shim for the companion Figma plugin ──────────────────────────────────
// The plugin can't speak raw MCP/SSE, so it uses this simpler POST endpoint.
app.post("/invoke", async (req, res) => {
  const { elements, intent } = req.body || {};
  if (!Array.isArray(elements) || elements.length === 0) {
    return res.status(400).json({ error: "elements array is required and must be non-empty" });
  }
  try {
    const analysis = await analyzeAndColor(elements, intent);
    const colored = analysis.assignments.filter((a) => a.fill || a.stroke).length;
    res.json({
      palette_name: analysis.palette_name,
      rationale:    analysis.rationale,
      assignments:  analysis.assignments,
      summary:
        `Applied palette **${analysis.palette_name}** to ${colored} element(s). ` +
        analysis.rationale,
    });
  } catch (err) {
    console.error("invoke failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Health & info ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) =>
  res.json({ status: "ok", service: "chroma-ai", protocol: "MCP/SSE" })
);

app.get("/", (req, res) =>
  res.json({
    name: "Chroma AI",
    description: "MCP server — connect Figma to this URL: <your-host>/sse",
    endpoints: { mcp_sse: "/sse", messages: "/messages", health: "/health" },
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Chroma AI MCP server running on http://localhost:${PORT}`);
  console.log(`  Figma MCP URL:  /sse`);
  console.log(`  Messages:       POST /messages`);
  console.log(`  Health:         GET  /health`);
});
