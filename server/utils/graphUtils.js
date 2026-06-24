// src/utils/graphUtils.js

function buildGraph(edges) {
    const adj = new Map();
    const childSet = new Set();
    const parentCount = new Map();

    for (let [u, v] of edges) {
        if (!adj.has(u)) adj.set(u, []);
        if (!adj.has(v)) adj.set(v, []);

        // multi-parent handling
        if (parentCount.has(v)) continue;

        adj.get(u).push(v);
        childSet.add(v);
        parentCount.set(v, u);
    }

    return { adj, childSet };
}

function findRoots(adj, childSet) {
    const roots = [];
    for (let node of adj.keys()) {
        if (!childSet.has(node)) {
            roots.push(node);
        }
    }
    return roots;
}

function dfsCycle(node, adj, visited, recStack) {
    if (recStack.has(node)) return true;
    if (visited.has(node)) return false;

    visited.add(node);
    recStack.add(node);

    for (let nei of adj.get(node)) {
        if (dfsCycle(nei, adj, visited, recStack)) return true;
    }

    recStack.delete(node);
    return false;
}

function buildTree(node, adj) {
    const obj = {};
    for (let child of adj.get(node)) {
        obj[child] = buildTree(child, adj);
    }
    return obj;
}

function calculateDepth(node, adj) {
    let max = 0;
    for (let child of adj.get(node)) {
        max = Math.max(max, calculateDepth(child, adj));
    }
    return max + 1;
}

module.exports = {
    buildGraph,
    findRoots,
    dfsCycle,
    buildTree,
    calculateDepth
};