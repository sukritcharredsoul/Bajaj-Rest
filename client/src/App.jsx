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
          headers: {
            "Content-Type": "application/json",
          },
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

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>BFHL Hierarchy Viewer</h1>

      <textarea
        rows={4}
        style={{ width: "100%", marginBottom: 10 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {response && (
        <pre
          style={{
            marginTop: 20,
            background: "#111",
            color: "#0f0",
            padding: 10,
          }}
        >
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}