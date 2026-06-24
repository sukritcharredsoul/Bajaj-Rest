import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("A->B, A->C, B->D");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setResponse(null);

    try {
      const dataArray = input
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const res = await fetch(
        "https://bajaj-rest-2n5x.onrender.com/bfhl",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataArray }),
        }
      );

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("❌ Failed to fetch API");
    }
  };

  const renderTree = (node) => {
    if (!node || typeof node !== "object") return null;

    return Object.entries(node).map(([key, value]) => (
      <div key={key} style={{ marginLeft: 15 }}>
        <div style={{ fontWeight: "bold", color: "#4ade80" }}>{key}</div>
        {renderTree(value)}
      </div>
    ));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        ⚡ BFHL Hierarchy Visualizer
      </h1>

      {/* INPUT */}
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <textarea
          rows={4}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            marginBottom: "10px",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          style={{
            background: "#22c55e",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Submit
        </button>
      </div>

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* RESPONSE */}
      {response && (
        <div>
          {/* SUMMARY */}
          <div
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <h2>📊 Summary</h2>
            <p>🌲 Trees: {response.summary?.total_trees}</p>
            <p>🔁 Cycles: {response.summary?.total_cycles}</p>
            <p>🏆 Largest Root: {response.summary?.largest_tree_root}</p>
          </div>

          {/* HIERARCHIES */}
          <div
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <h2>🌳 Hierarchies</h2>

            {response.hierarchies?.map((h, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  background: "#0f172a",
                  borderRadius: "6px",
                }}
              >
                <p>
                  <strong>Root:</strong> {h.root}
                </p>

                {h.has_cycle ? (
                  <p style={{ color: "red" }}>⚠ Cycle detected</p>
                ) : (
                  <div>{renderTree(h.tree)}</div>
                )}

                {h.depth && <p>Depth: {h.depth}</p>}
              </div>
            ))}
          </div>

          {/* INVALID */}
          <div
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <h2>❌ Invalid Entries</h2>
            <p>{response.invalid_entries?.join(", ") || "None"}</p>
          </div>

          {/* DUPLICATES */}
          <div
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h2>🔁 Duplicate Edges</h2>
            <p>{response.duplicate_edges?.join(", ") || "None"}</p>
          </div>
        </div>
      )}
    </div>
  );
}