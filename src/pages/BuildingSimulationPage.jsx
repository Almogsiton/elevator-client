import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBuildingDetails } from "../services/apiService";
import axios from "axios";
import "../styles/simulation.css";
import * as signalR from "@microsoft/signalr";

export default function BuildingSimulationPage() {
  const { id } = useParams();
  const [numberOfFloors, setNumberOfFloors] = useState(0);
  const [requestedFloors, setRequestedFloors] = useState([]);
  const [elevator, setElevator] = useState({
    currentFloor: 0,
    status: "Idle",
    direction: "None",
    doorStatus: "Closed",
  });

  useEffect(() => {
    getBuildingDetails(id)
      .then((res) => {
        setNumberOfFloors(res.data.numberOfFloors);
      })
      .catch(() => {
        alert("Failed to load building details");
      });
  }, [id]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5145/elevatorHub")
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("SignalR connected");

connection.on("ReceiveElevatorUpdate", (data) => {
  if (data.buildingId !== parseInt(id)) return;

  console.log(
    `📡 Elevator Update => Elevator ID: ${data.elevatorId}, Building: ${data.buildingId}, Floor: ${data.currentFloor}, Status: ${data.status}, Direction: ${data.direction}, Door: ${data.doorStatus}`
  );

  setElevator({
    currentFloor: data.currentFloor,
    status: data.status,
    direction: data.direction,
    doorStatus: data.doorStatus,
  });

  setRequestedFloors((prev) =>
    data.doorStatus === "Open"
      ? prev.filter((f) => f !== data.currentFloor)
      : prev
  );
});

      })
      .catch((error) => {
        console.error("SignalR connection error:", error);
      });

    return () => {
      connection.stop();
    };
  }, [id]);

  const handleCallElevator = async (floor, direction) => {
    console.log("🔔 Elevator call sent for floor:", floor, "direction:", direction);
    try {
      await axios.post("http://localhost:5145/api/elevatorcall/create", {
        buildingId: parseInt(id),
        requestedFloor: floor,
        direction: direction,
      });

      setRequestedFloors((prev) =>
        [...new Set([...prev, floor])].sort((a, b) => b - a)
      );
    } catch (error) {
      alert("Failed to call elevator");
    }
  };

  return (
    <div className="simulation-container">
      <div className="requested-floors">
        <h3>Requested Floors</h3>
        {requestedFloors.length === 0 ? (
          <p>No active calls</p>
        ) : (
          <ul>
            {requestedFloors.map((f) => (
              <li key={f}>Floor {f}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="floors-container">
        <h2>Building #{id}</h2>

        {[...Array(numberOfFloors)].map((_, i) => {
          const floor = numberOfFloors - 1 - i;
          const showUp = floor < numberOfFloors - 1;
          const showDown = floor > 0;
          const isCurrentFloor = floor === elevator.currentFloor;

          return (
            <div
              key={floor}
              className={`floor-row ${isCurrentFloor ? "active-floor" : ""}`}
            >
              <span>Floor {floor}</span>
              <div>
                {showUp && (
                  <button onClick={() => handleCallElevator(floor, "Up")}>
                    ▲
                  </button>
                )}
                {showDown && (
                  <button onClick={() => handleCallElevator(floor, "Down")}>
                    ▼
                  </button>
                )}
              </div>
            </div>
          );
        })}

        <div className="elevator-status">
          <strong>Status:</strong> {elevator.status} |{" "}
          <strong>Direction:</strong> {elevator.direction} |{" "}
          <strong>Door:</strong> {elevator.doorStatus}
        </div>
      </div>
    </div>
  );
}
