import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUserBuildings, deleteBuilding } from "../services/apiService";
import "../styles/buildings.css";
import Header from "../components/Header";

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleDelete = async (buildingId) => {
    if (!window.confirm("Are you sure you want to delete this building?")) return;

    try {
      await deleteBuilding(buildingId);
      setBuildings(buildings.filter((b) => b.id !== buildingId));
    } catch (err) {
      alert("Failed to delete building");
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    getUserBuildings(userId)
      .then((res) => {
        setBuildings(res.data);
      })
      .catch(() => {
        alert("Failed to load buildings");
      });
  }, [navigate, userId]);

  return (
    <>
      <Header />
      <h1 className="page-title">My Buildings</h1>

      <div className="add-button-container">
        <Link className="add-button" to="/buildings/add">
          + Add Building
        </Link>
      </div>

      <div className="building-list">
        {buildings.map((b) => (
          <div key={b.id} className="building-card">
            <h3>{b.name}</h3>
            <p>Floors: {b.numberOfFloors}</p>
            <button onClick={() => navigate(`/buildings/${b.id}`)}>
              View Building
            </button>
            <button
              className="delete-button"
              onClick={() => handleDelete(b.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
