import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AVTestingApp from "./AVTestingApp";
import EvaluationPage from "./EvaluationPage";
import SettingsPage from "./SettingsPage";
import BenchmarkPage from "./BenchmarkPage";
import HistoryPage from "./HistoryPage";
import SettingsLoginPage from "./SettingsLoginPage";

export default function App() {
  return (
    <BrowserRouter>
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
