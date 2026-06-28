// Runs inside Figma's plugin sandbox — no network access here.
// All HTTP calls happen in ui.html (the iframe).

figma.showUI(__html__, { width: 380, height: 560, title: "Chroma AI" });

// ── Helpers ───────────────────────────────────────────────────────────────────

function nodeDepth(node) {
  let d = 0;
  let n = node;
  while (n.parent && n.parent.type !== "PAGE") { d++; n = n.parent; }
  return d;
}

function flattenSelection(nodes, depth) {
  const result = [];
  for (const node of nodes) {
    result.push({
      nodeId:    node.id,
      name:      node.name,
      type:      node.type,
      hasFill:   "fills"   in node && node.fills.length   > 0,
      hasStroke: "strokes" in node && node.strokes.length > 0,
      isText:    node.type === "TEXT",
      depth:     depth ?? nodeDepth(node),
    });
    // Include one level of children so the AI understands the hierarchy
    if ("children" in node) {
      for (const child of node.children) {
        result.push({
          nodeId:    child.id,
          name:      child.name,
          type:      child.type,
          hasFill:   "fills"   in child && child.fills.length   > 0,
          hasStroke: "strokes" in child && child.strokes.length > 0,
          isText:    child.type === "TEXT",
          depth:     (depth ?? nodeDepth(node)) + 1,
        });
      }
    }
  }
  return result;
}

function sendSelection() {
  const sel = figma.currentPage.selection;
  const elements = flattenSelection(sel);
  figma.ui.postMessage({ type: "SELECTION", elements, count: sel.length });
}

// ── Apply colors from AI response ────────────────────────────────────────────

function applyFill(node, { r, g, b, a }) {
  if (!("fills" in node)) return;
  const fills = JSON.parse(JSON.stringify(node.fills));
  if (fills.length === 0) {
    fills.push({ type: "SOLID", color: { r, g, b }, opacity: a ?? 1 });
  } else {
    fills[0] = { ...fills[0], type: "SOLID", color: { r, g, b }, opacity: a ?? 1 };
  }
  node.fills = fills;
}

function applyStroke(node, { r, g, b, a }) {
  if (!("strokes" in node)) return;
  const strokes = JSON.parse(JSON.stringify(node.strokes));
  if (strokes.length === 0) {
    strokes.push({ type: "SOLID", color: { r, g, b }, opacity: a ?? 1 });
  } else {
    strokes[0] = { ...strokes[0], type: "SOLID", color: { r, g, b }, opacity: a ?? 1 };
  }
  node.strokes = strokes;
}

function applyAssignments(assignments) {
  let applied = 0;
  for (const a of assignments) {
    const node = figma.getNodeById(a.nodeId);
    if (!node) continue;
    if (a.fill)   { applyFill(node, a.fill);     applied++; }
    if (a.stroke) { applyStroke(node, a.stroke); applied++; }
  }
  return applied;
}

// ── Message bus ───────────────────────────────────────────────────────────────

figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case "READY":
      sendSelection();
      break;

    case "REFRESH_SELECTION":
      sendSelection();
      break;

    case "APPLY_COLORS": {
      const count = applyAssignments(msg.assignments);
      figma.notify(`Chroma AI — "${msg.paletteName}" applied to ${count} element(s)`);
      figma.ui.postMessage({ type: "APPLY_DONE", count });
      break;
    }

    case "CLOSE":
      figma.closePlugin();
      break;
  }
};

// Notify UI when selection changes while plugin is open
figma.on("selectionchange", sendSelection);
