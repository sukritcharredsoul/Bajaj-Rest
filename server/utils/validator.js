const dotenv = require("dotenv") ;

const EDGE_REGEX = /^[A-Z]->[A-Z]$/;

function validateAndParse(data) {
    const validEdges = [];
    const invalidEntries = [];
    const seenEdges = new Set();
    const duplicateEdges = new Set();

    for (let entry of data) {
        if (!entry || typeof entry !== "string") {
            invalidEntries.push(entry);
            continue;
        }

        const trimmed = entry.trim();

        if (!EDGE_REGEX.test(trimmed)) {
            invalidEntries.push(entry);
            continue;
        }

        const [parent, child] = trimmed.split("->");

        // self loop invalid
        if (parent === child) {
            invalidEntries.push(entry);
            continue;
        }

        const key = `${parent}->${child}`;

        if (seenEdges.has(key)) {
            duplicateEdges.add(key);
            continue;
        }

        seenEdges.add(key);
        validEdges.push([parent, child]);
    }

    return {
        validEdges,
        invalidEntries,
        duplicateEdges: [...duplicateEdges]
    };
}

module.exports = { validateAndParse };