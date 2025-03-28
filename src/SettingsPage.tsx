import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const getSavedCategories = () => {
  const saved = localStorage.getItem("av-eval-categories");
  return saved ? JSON.parse(saved) : [];
};

const saveCategories = (categories: any[]) => {
  localStorage.setItem("av-eval-categories", JSON.stringify(categories));
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("settings-auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      setCategories(getSavedCategories());
    } else {
      navigate("/settings-login");
    }
  }, [navigate]);

  if (!isAuthenticated) return null;

  const handleAddSection = () => {
    const title = prompt("Enter section title");
    if (!title) return;
    const newSection = {
      title,
      items: [],
      leadOnly: false,
      scoreLabels: ["1", "2", "3"]
    };
    const updated = [...categories, newSection];
    setCategories(updated);
    saveCategories(updated);
  };

  const handleRemoveSection = (index: number) => {
    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
    saveCategories(updated);
  };

  const handleAddItem = (index: number) => {
    const item = prompt("Enter new item");
    if (!item) return;
    const updated = [...categories];
    updated[index].items.push(item);
    setCategories(updated);
    saveCategories(updated);
  };

  const handleRemoveItem = (sectionIndex: number, itemIndex: number) => {
    const updated = [...categories];
    updated[sectionIndex].items.splice(itemIndex, 1);
    setCategories(updated);
    saveCategories(updated);
  };

  const toggleLeadOnly = (index: number) => {
    const updated = [...categories];
    updated[index].leadOnly = !updated[index].leadOnly;
    setCategories(updated);
    saveCategories(updated);
  };

  const updateScoreLabel = (sectionIndex: number, scoreIndex: number, value: string) => {
    const updated = [...categories];
    updated[sectionIndex].scoreLabels[scoreIndex] = value;
    setCategories(updated);
    saveCategories(updated);
  };

  return (
    <div
      className="min-h-screen text-white px-6 py-10 font-sans bg-neutral-950"
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
        className="mb-6 text-sm text-neutral-400 hover:text-white flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-8 text-white">🛠️ Configure Evaluation Sections</h1>

      {categories.map((section, i) => (
        <div key={i} className="mb-8 p-4 border border-neutral-700 bg-neutral-900 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <button
              onClick={() => handleRemoveSection(i)}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              ❌ Remove Section
            </button>
          </div>

          <div className="mb-2">
            <label className="flex items-center gap-2 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={section.leadOnly}
                onChange={() => toggleLeadOnly(i)}
              />
              Display section to Project Leads only
            </label>
          </div>

          <div className="mb-3 space-y-2">
            <h3 className="text-sm font-semibold text-neutral-400">Score Labels:</h3>
            {["1", "2", "3"].map((_, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span className="w-5">{idx + 1}:</span>
                <input
                  type="text"
                  value={section.scoreLabels?.[idx] || ""}
                  onChange={(e) => updateScoreLabel(i, idx, e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-600 rounded px-2 py-1 text-white text-sm"
                  placeholder={`Label for score ${idx + 1}`}
                />
              </div>
            ))}
          </div>

          <ul className="space-y-1 mb-3">
            {section.items.map((item: string, j: number) => (
              <li
                key={j}
                className="flex justify-between items-center bg-neutral-800 rounded px-3 py-1 text-sm"
              >
                <span>{item}</span>
                <button
                  onClick={() => handleRemoveItem(i, j)}
                  className="text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleAddItem(i)}
            className="text-green-400 hover:text-green-600 text-sm mt-2"
          >
            ➕ Add Item
          </button>
        </div>
      ))}

      <div className="text-center">
        <button
          onClick={handleAddSection}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow"
        >
          ➕ Add Section
        </button>
      </div>
    </div>
  );
}
