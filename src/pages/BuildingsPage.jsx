import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBuildings } from "../services/apiService";

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    getBuildings(userId)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setBuildings(data);
      })
      .catch((err) => {
        alert("Failed to load buildings");
        navigate("/");
      });
  }, [userId, navigate]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Your Buildings</h1>
      {buildings.length === 0 ? (
        <p>No buildings found.</p>
      ) : (
        <ul>
          {buildings.map((b) => (
            <li key={b.id}>
              <strong>{b.name}</strong> — {b.numberOfFloors} floors
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
