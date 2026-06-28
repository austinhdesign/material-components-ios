/**
 * Converts a Chroma AI color analysis result into a Figma Plugin API script
 * that can be executed via figma.runScript() or returned to the Figma AI chat
 * as a code action.
 */
function buildPluginScript(analysis) {
  const assignmentLines = analysis.assignments
    .filter((a) => a.fill !== null || a.stroke !== null)
    .map((a) => {
      const lines = [`  // ${a.nodeName} — ${a.role}: ${a.reason}`];
      lines.push(`  const node_${sanitizeId(a.nodeId)} = figma.getNodeById("${a.nodeId}");`);
      lines.push(`  if (node_${sanitizeId(a.nodeId)}) {`);

      if (a.fill) {
        lines.push(
          `    applyFill(node_${sanitizeId(a.nodeId)}, ` +
            `${a.fill.r.toFixed(4)}, ${a.fill.g.toFixed(4)}, ` +
            `${a.fill.b.toFixed(4)}, ${a.fill.a.toFixed(4)});`
        );
      }
      if (a.stroke) {
        lines.push(
          `    applyStroke(node_${sanitizeId(a.nodeId)}, ` +
            `${a.stroke.r.toFixed(4)}, ${a.stroke.g.toFixed(4)}, ` +
            `${a.stroke.b.toFixed(4)}, ${a.stroke.a.toFixed(4)});`
        );
      }

      lines.push(`  }`);
      return lines.join("\n");
    })
    .join("\n\n");

  return `
// Chroma AI — "${analysis.palette_name}"
// ${analysis.rationale}

function applyFill(node, r, g, b, a) {
  if (!("fills" in node)) return;
  const fills = JSON.parse(JSON.stringify(node.fills));
  if (fills.length === 0) fills.push({ type: "SOLID", color: { r, g, b }, opacity: a });
  else { fills[0].type = "SOLID"; fills[0].color = { r, g, b }; fills[0].opacity = a; }
  node.fills = fills;
}

function applyStroke(node, r, g, b, a) {
  if (!("strokes" in node)) return;
  const strokes = JSON.parse(JSON.stringify(node.strokes));
  if (strokes.length === 0) strokes.push({ type: "SOLID", color: { r, g, b }, opacity: a });
  else { strokes[0].type = "SOLID"; strokes[0].color = { r, g, b }; strokes[0].opacity = a; }
  node.strokes = strokes;
}

${assignmentLines}

figma.notify("Chroma AI applied: ${analysis.palette_name.replace(/"/g, "'")}");
figma.closePlugin();
`.trim();
}

function sanitizeId(nodeId) {
  return nodeId.replace(/[^a-zA-Z0-9]/g, "_");
}

module.exports = { buildPluginScript };
