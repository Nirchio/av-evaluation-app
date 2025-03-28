import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const getSavedOptions = () => {
  const saved = localStorage.getItem("av-eval-options");
  return saved ? JSON.parse(saved) : ["Option 1", "Option 2", "Option 3"];
};

const getSavedCategories = () => {
  const saved = localStorage.getItem("av-eval-categories");
  return saved ? JSON.parse(saved) : [];
};

const scoreIcons = [
  { label: "Poor", score: 1 },
  { label: "Adequate", score: 2 },
  { label: "Excellent", score: 3 }
];

export default function AVTestingApp() {
  const navigate = useNavigate();
  const [options, setOptions] = useState<string[]>([]);
  const [testerEmail, setTesterEmail] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    setOptions(getSavedOptions());
    setCategories(getSavedCategories());
  }, []);

  const handleStart = () => {
    if (selectedOption && testerEmail) {
      sessionStorage.setItem("av-eval-email", testerEmail);
      sessionStorage.setItem("av-eval-current-option", selectedOption);
    } else {
      alert("Please enter your email and select a technology option.");
      return;
    }
    setRole(null);
  };

  const proceedWithRole = (selectedRole: string) => {
    sessionStorage.setItem("av-eval-role", selectedRole);
    sessionStorage.setItem(
      "av-eval-visible-sections",
      JSON.stringify(
        categories.filter((cat) => !cat.leadOnly || selectedRole === "Project Lead")
      )
    );
    navigate("/evaluate");
  };

  return (
    <div
      className="min-h-screen text-white px-6 py-10 font-sans relative flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <button
        onClick={() => navigate("/settings-login")}
        className="absolute top-4 right-4 text-white hover:text-red-500"
      >
        ⚙️
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">AV Evaluation Framework</h1>

      <div className="mb-8 w-full max-w-md text-center">
        <p className="mb-2 text-neutral-400">Enter your email to begin:</p>
        <input
          type="email"
          placeholder="you@example.com"
          value={testerEmail}
          onChange={(e) => setTesterEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-neutral-700"
        />
      </div>

      <div className="w-full max-w-4xl">
        <p className="mb-4 text-lg font-semibold text-center">Select a technology to evaluate:</p>
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedOption(opt)}
              className={`px-6 py-3 rounded-2xl shadow text-white transition-all font-semibold text-lg ${
                selectedOption === opt
                  ? "bg-red-700 ring-2 ring-red-400"
                  : "bg-neutral-800 hover:bg-red-600"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {!role && (
          <div className="flex justify-center">
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-lg font-bold shadow-lg"
            >
              🚀 Start Evaluation
            </button>
          </div>
        )}

        {selectedOption && testerEmail && role === null && (
          <div className="mt-6 text-center space-y-4">
            <p className="text-neutral-300">Choose your role to continue:</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => proceedWithRole("Project Lead")}
                className="px-5 py-2 bg-red-700 hover:bg-red-800 rounded-xl text-white font-semibold"
              >
                I'm a Project Lead
              </button>
              <button
                onClick={() => proceedWithRole("Project Contributor")}
                className="px-5 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-xl text-white font-semibold"
              >
                I'm a Project Contributor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
