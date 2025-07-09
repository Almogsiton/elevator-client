import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BuildingsPage from "./pages/BuildingsPage";
import AddBuildingPage from "./pages/AddBuildingPage";
import BuildingSimulationPage from "./pages/BuildingSimulationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/buildings" element={<BuildingsPage />} />
        <Route path="/buildings/add" element={<AddBuildingPage />} />
        <Route path="/buildings/:id" element={<BuildingSimulationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
