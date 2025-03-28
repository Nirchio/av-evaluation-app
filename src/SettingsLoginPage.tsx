import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SettingsLoginPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "xilfteN") {
      localStorage.setItem("settings-auth", "true");
      navigate("/settings");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white px-4"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 p-8 rounded-xl shadow-lg border border-neutral-700 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">🔒 Enter Settings Password</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password..."
          className="w-full px-4 py-2 mb-4 bg-neutral-800 border border-neutral-600 rounded text-white"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold"
        >
          Access Settings
        </button>
      </form>
    </div>
  );
};

export default SettingsLoginPage;
