// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AVTestingApp from "./AVTestingApp";
import EvaluationPage from "./EvaluationPage";
import SettingsPage from "./SettingsPage";
import SettingsLoginPage from "./SettingsLoginPage";
import BenchmarkPage from "./BenchmarkPage";
import HistoryPage from "./HistoryPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<AVTestingApp />} />
        <Route path="/evaluate" element={<EvaluationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings-login" element={<SettingsLoginPage />} />
        <Route path="/benchmark" element={<BenchmarkPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
