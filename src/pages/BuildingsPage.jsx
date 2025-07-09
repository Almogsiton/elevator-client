import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBuildings } from "../services/apiService";
import "../styles/buildings.css";

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState([]);
  const navigate = useNavigate();
  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    console.log("userId from localStorage (parsed):", userId);

    if (!userId || isNaN(userId)) {
      navigate("/");
      return;
    }

    console.log("Fetching buildings for userId:", userId);
    getBuildings(userId)
      .then((res) => {
        console.log("API response:", res);
        const data = Array.isArray(res.data) ? res.data : [];
        setBuildings(data);
      })
      .catch((err) => {
        console.error("Failed to load buildings:", err);
        alert("Failed to load buildings");
        navigate("/");
      });
  }, [userId, navigate]);

  return (
    <div className="container">
      <h1 className="page-title">Your Buildings</h1>

      <button
        className="toggle-form-button"
        onClick={() => navigate("/buildings/add")}
      >
        Add Building
      </button>

      {buildings.length === 0 ? (
        <p>No buildings found.</p>
      ) : (
        <div className="buildings-grid">
          {buildings.map((b) => (
            <div key={b.id} className="building-card">
              <h3>{b.name}</h3>
              <p>{b.numberOfFloors} floors</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
