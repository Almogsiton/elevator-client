import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBuilding } from "../services/apiService";
import "../styles/buildings.css";

function AddBuildingPage() {
  const [name, setName] = useState("");
  const [floors, setFloors] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBuilding({
        name,
        numberOfFloors: parseInt(floors),
        userId: parseInt(userId),
      });
      navigate("/buildings");
    } catch (err) {
      alert("Failed to create building");
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Add New Building</h1>
      <form className="add-building-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Building name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Number of floors"
          value={floors}
          onChange={(e) => setFloors(e.target.value)}
          min="1"
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default AddBuildingPage;
