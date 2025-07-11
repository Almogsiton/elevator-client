import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBuilding, getFloorLimits } from "../services/apiService";
import "../styles/addBuilding.css";
import Header from "../components/Header";

export default function AddBuildingPage() {
  const [name, setName] = useState("");
  const [floors, setFloors] = useState("");
  const [minFloors, setMinFloors] = useState(2);
  const [maxFloors, setMaxFloors] = useState(20);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    getFloorLimits()
      .then((res) => {
        setMinFloors(res.data.minFloors);
        setMaxFloors(res.data.maxFloors);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numFloors = parseInt(floors);

    if (numFloors < minFloors || numFloors > maxFloors) {
      setError(`Number of floors must be between ${minFloors} and ${maxFloors}.`);
      return;
    }

    try {
      await createBuilding({
        name,
        numberOfFloors: numFloors,
        userId: parseInt(userId),
      });
      navigate("/buildings");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("You already have a building with this name.");
      } else {
        setError("Failed to create building");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="add-building-container">
        <h1 className="page-title">Add New Building</h1>
        <form className="add-building-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Building name"
            value={name}
            onChange={(e) => {
              setName(e.target.value.trimStart());
              setError("");
            }}
            required
          />
          <input
            type="number"
            placeholder={`Number of floors (${minFloors}–${maxFloors})`}
            value={floors}
            onChange={(e) => {
              setFloors(e.target.value);
              setError("");
            }}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit">Create Building</button>
        </form>
      </div>
    </>
  );
}
