import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("av-eval-history");
    setHistory(stored ? JSON.parse(stored) : []);
  }, []);

  const downloadCSV = () => {
    const rows = [
      ["Email", "Option", "Criterion", "Score", "SubmittedAt"]
    ];
    history.forEach((entry) => {
      const { email, option, scores, submittedAt } = entry;
      Object.entries(scores).forEach(([criterion, score]) => {
        rows.push([email, option, criterion, score, submittedAt]);
      });
    });

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "av-evaluation-history.csv";
    link.click();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-6 py-10 font-sans">
      <button
        onClick={() => navigate("/")}
        className="text-sm mb-4 flex items-center gap-2 text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-6">📚 Evaluation History</h1>

      {history.length === 0 ? (
        <p className="text-neutral-400">No submissions found.</p>
      ) : (
        <>
          <button
            onClick={downloadCSV}
            className="mb-6 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            ⬇️ Download CSV
          </button>

          <ul className="space-y-4">
            {history.map((entry, i) => (
              <li key={i} className="bg-neutral-900 p-4 rounded-xl border border-neutral-700">
                <div className="mb-1 text-sm text-neutral-400">
                  <strong>{entry.email}</strong> evaluated <strong>{entry.option}</strong> on{" "}
                  {new Date(entry.submittedAt).toLocaleString()}
                </div>
                <ul className="text-sm pl-4 mt-2 list-disc">
                  {Object.entries(entry.scores).map(([k, v]: any, j) => (
                    <li key={j}>
                      {k.split(`${entry.option}-`)[1]}: <strong>{v}</strong>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
