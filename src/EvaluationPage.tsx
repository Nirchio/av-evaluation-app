import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getSavedCategories = () => {
  const saved = localStorage.getItem("av-eval-categories");
  return saved ? JSON.parse(saved) : [];
};

export default function EvaluationPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const email = sessionStorage.getItem("av-eval-email") || "";
  const option = sessionStorage.getItem("av-eval-current-option") || "";

  useEffect(() => {
    const stored = getSavedCategories();
    setCategories(stored);
    const savedRole = sessionStorage.getItem("av-eval-role");
    if (savedRole) setRole(savedRole);
  }, []);

  const handleScore = (criterion: string, value: number) => {
    setScores((prev) => ({ ...prev, [criterion]: value }));
  };

  const handleComment = (criterion: string, text: string) => {
    setComments((prev) => ({ ...prev, [criterion]: text }));
  };

  const handleSubmit = () => {
    const entry = {
      option,
      email,
      role,
      scores,
      comments,
      timestamp: new Date().toISOString()
    };
    const history = JSON.parse(localStorage.getItem("av-eval-history") || "[]");
    history.push(entry);
    localStorage.setItem("av-eval-history", JSON.stringify(history));
    alert("Evaluation saved!");
    navigate("/benchmark");
  };

  if (!email || !option) {
    return (
      <div className="text-white min-h-screen flex items-center justify-center text-xl">
        Missing user info. Please return to the home page.
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white px-6 py-10 font-sans relative flex flex-col items-center"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-white hover:text-red-500"
      >
        <ArrowLeft />
      </button>

      <h1 className="text-3xl font-bold mb-4 text-center">AV Evaluation Framework</h1>
      <h2 className="text-xl mb-8 text-center">
        {option} — {email} ({role || "Unspecified"})
      </h2>

      <div className="w-full max-w-5xl space-y-10">
        {categories.map((section, i) => {
          if (role === "Project Contributor" && section.leadOnly) return null;
          return (
            <div key={i} className="border border-neutral-700 bg-neutral-900 rounded-xl p-4">
              <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
              {section.items.map((item: string, j: number) => (
                <div key={j} className="mb-4">
                  <label className="block text-sm mb-1">{item}</label>
                  <div className="flex gap-2 mb-2">
                    {[1, 2, 3].map((score) => (
                      <button
                        key={score}
                        onClick={() => handleScore(item, score)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                          scores[item] === score
                            ? "bg-red-600 border-red-400 text-white"
                            : "bg-neutral-800 border-neutral-600 text-neutral-300 hover:bg-red-700"
                        }`}
                      >
                        {section.scoreLabels?.[score - 1] || score}
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Add a comment..."
                    value={comments[item] || ""}
                    onChange={(e) => handleComment(item, e.target.value)}
                    className="w-full bg-neutral-800 text-white border border-neutral-600 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg font-bold shadow-lg"
        >
          ✅ Submit Evaluation
        </button>
      </div>
    </div>
  );
}
