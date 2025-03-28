import React, { useEffect, useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BenchmarkPage() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<any[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [activeOptions, setActiveOptions] = useState<string[]>([]);
  const [rawData, setRawData] = useState<any>({});

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("av-eval-history") || "[]");
    const categories = JSON.parse(localStorage.getItem("av-eval-categories") || "[]");

    const grouped: Record<string, Record<string, number[]>> = {};

    for (const entry of history) {
      const option = entry.option;
      for (const [k, v] of Object.entries(entry.scores)) {
        const label = k.replace(`${option}-`, "");
        const category = categories.find((cat: any) =>
          cat.items.includes(label)
        )?.title;

        if (!category) continue;

        grouped[category] = grouped[category] || {};
        grouped[category][option] = grouped[category][option] || [];
        grouped[category][option].push(v as number);
      }
    }

    const finalChart: any[] = [];
    const allOptions = new Set<string>();
    const raw: any = {};

    for (const category in grouped) {
      const row: any = { category };
      raw[category] = {};
      for (const opt in grouped[category]) {
        const values = grouped[category][opt];
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        row[opt] = parseFloat(avg.toFixed(2));
        raw[category][opt] = values;
        allOptions.add(opt);
      }
      finalChart.push(row);
    }

    const optsArray = Array.from(allOptions);
    setChartData(finalChart);
    setOptions(optsArray);
    setActiveOptions(optsArray);
    setRawData(raw);
  }, []);

  const toggleOption = (opt: string) => {
    setActiveOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const colorPalette = [
    "#e50914", // Netflix Red
    "#1db954", // Spotify Green
    "#ff9900", // Amazon Orange
    "#0071eb", // Bright Blue
    "#a100ff", // Purple
    "#00c2ff", // Cyan
    "#ff4081", // Pink
    "#ffd700"  // Gold
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-6 py-10 font-sans">
      <button
        onClick={() => {
          navigate("/", { replace: true });
          window.location.reload(); // Clean refresh to home page
        }}
        className="text-sm mb-4 flex items-center gap-2 text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-4 text-center">📊 Benchmark Comparison</h1>

      <div className="mb-6 flex flex-wrap justify-center gap-4">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => toggleOption(opt)}
            className={`px-4 py-1 rounded-full font-medium text-sm border transition-all ${
              activeOptions.includes(opt)
                ? "bg-red-600 border-red-500 text-white"
                : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {chartData.length === 0 ? (
        <p className="text-center text-neutral-400">No evaluation data to show.</p>
      ) : (
        <ResponsiveContainer width="100%" height={500}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <PolarRadiusAxis angle={30} domain={[1, 3]} />
            <Tooltip />
            <Legend />
            {activeOptions.map((opt, i) => (
              <Radar
                key={i}
                name={opt}
                dataKey={opt}
                stroke={colorPalette[i % colorPalette.length]}
                fill={colorPalette[i % colorPalette.length]}
                fillOpacity={0.3}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      )}

      {Object.keys(rawData).length > 0 && (
        <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-bold">📋 Detailed Scores</h2>
          {Object.entries(rawData).map(([category, scoresByOption]: any, i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-2">{category}</h3>
              <ul className="text-sm space-y-1">
                {activeOptions.map((opt, j) => (
                  <li key={j}>
                    <span className="text-neutral-400">{opt}:</span>{" "}
                    {scoresByOption[opt]?.length
                      ? `${(
                          scoresByOption[opt].reduce((a: number, b: number) => a + b, 0) /
                          scoresByOption[opt].length
                        ).toFixed(2)} (n=${scoresByOption[opt].length})`
                      : "No data"}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
