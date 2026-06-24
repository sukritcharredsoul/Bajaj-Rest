const dotenv = require("dotenv") ;
const { validateAndParse } = require("../utils/validator");
const {
    buildGraph,
    findRoots,
    dfsCycle,
    buildTree,
    calculateDepth
} = require("../utils/graphUtils");

function processData(data) {
    const { validEdges, invalidEntries, duplicateEdges } = validateAndParse(data);

    const { adj, childSet } = buildGraph(validEdges);

    const visited = new Set();
    const hierarchies = [];

    let totalTrees = 0;
    let totalCycles = 0;
    let largestTreeRoot = "";
    let maxDepth = 0;

    let roots = findRoots(adj, childSet);

    // handle pure cycle case
    if (roots.length === 0 && adj.size > 0) {
        roots = [Array.from(adj.keys()).sort()[0]];
    }

    for (let root of roots) {
        const cycle = dfsCycle(root, adj, new Set(), new Set());

        if (cycle) {
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
            totalCycles++;
        } else {
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
        invalidEntries,
        duplicateEdges,
        summary: {
            total_trees: totalTrees,
            total_cycles: totalCycles,
            largest_tree_root: largestTreeRoot
        }
    };
}

module.exports = { processData };