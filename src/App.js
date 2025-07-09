// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BuildingsPage from "./pages/BuildingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/buildings" element={<BuildingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
