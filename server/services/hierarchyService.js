const { validateAndParse } = require("../utils/validator");
const {
  buildGraph,
  dfsCycle,
  buildTree,
  calculateDepth
} = require("../utils/graphUtils");

function processData(data) {
  const { validEdges, invalidEntries, duplicateEdges } =
    validateAndParse(data);

  const { adj, childSet } = buildGraph(validEdges);

  const visitedGlobal = new Set();
  const hierarchies = [];

  let totalTrees = 0;
  let totalCycles = 0;
  let largestTreeRoot = "";
  let maxDepth = 0;

  // 🔥 PROCESS ALL COMPONENTS (THIS FIXES YOUR BUG)
  for (let node of adj.keys()) {
    if (visitedGlobal.has(node)) continue;

    const component = [];

    function dfsCollect(n) {
      if (visitedGlobal.has(n)) return;
      visitedGlobal.add(n);
      component.push(n);

      for (let nei of adj.get(n)) {
        dfsCollect(nei);
      }
    }

    dfsCollect(node);

    // check cycle in this component
    const isCycle = dfsCycle(node, adj, new Set(), new Set());

    let root;

    if (isCycle) {
      root = component.sort()[0];

      hierarchies.push({
        root,
        tree: {},
        has_cycle: true
      });

      totalCycles++;
    } else {
      // find root in this component
      const possibleRoots = component.filter((n) => !childSet.has(n));
      root = possibleRoots[0];

      const tree = {};
      tree[root] = buildTree(root, adj);

      const depth = calculateDepth(root, adj);

      hierarchies.push({
        root,
        tree,
        depth
      });

      totalTrees++;

      if (
        depth > maxDepth ||
        (depth === maxDepth && root < largestTreeRoot)
      ) {
        maxDepth = depth;
        largestTreeRoot = root;
      }
    }
  }

  return {
    hierarchies,
    invalid_entries: invalidEntries,     // ✅ FIXED NAME
    duplicate_edges: duplicateEdges,     // ✅ FIXED NAME
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestTreeRoot
    }
  };
}

module.exports = { processData };