import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import {
  getBuilding,
  getElevatorStatus,
  callElevator,
} from "../services/apiService";
import "../styles/simulation.css";
import * as signalR from "@microsoft/signalr";
import AppConfig from "../appConfig";

export default function BuildingSimulationPage() {
  const { id } = useParams();
  const [numberOfFloors, setNumberOfFloors] = useState(0);
  const [elevatorStatus, setElevatorStatus] = useState(null);
  const [targetFloors, setTargetFloors] = useState([]);

  useEffect(() => {
    getBuilding(id)
      .then((res) => {
        setNumberOfFloors(res.data.numberOfFloors);
      })
      .catch(() => {
        alert("Failed to load building details");
      });
  }, [id]);

  useEffect(() => {
    getElevatorStatus(id)
      .then((res) => {
        setElevatorStatus(res.data);
      })
      .catch(() => {
        alert("Failed to load elevator status");
      });
  }, [id]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${AppConfig.SERVER_BASE_URL}/elevatorHub`)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("Connected to SignalR"))
      .catch((err) => console.error("SignalR error:", err));

    connection.on("ReceiveElevatorUpdate", (data) => {
      setElevatorStatus(data);
    });

    return () => {
      connection.stop();
    };
  }, []);

  useEffect(() => {
    if (elevatorStatus) {
      setTargetFloors((prev) =>
        prev.filter((floor) => floor !== elevatorStatus.currentFloor)
      );
    }
  }, [elevatorStatus]);

  const handleCall = (requestedFloor, destinationFloor = null) => {
    callElevator(id, requestedFloor, destinationFloor)
      .then(() => console.log("Call sent"))
      .catch(() => alert("Failed to send elevator call"));
  };

  return (
    <>
      <Header />

      <div className="building-simulation">
        <h2>Building Simulation</h2>

        <div className="status-panel">
          {elevatorStatus ? (
            <>
              <p>Current Floor: {elevatorStatus.currentFloor}</p>
              <p>Status: {elevatorStatus.status}</p>
              <p>Direction: {elevatorStatus.direction}</p>
              <p>Door Status: {elevatorStatus.doorStatus}</p>
            </>
          ) : (
            <p>Loading elevator status...</p>
          )}
        </div>

        <div className="floors-container">
          {[...Array(numberOfFloors)].map((_, index) => {
            const floor = numberOfFloors - index - 1;
            const isTopFloor = floor === numberOfFloors - 1;
            const isBottomFloor = floor === 0;
            const isElevatorHere = elevatorStatus?.currentFloor === floor;
            const isTarget = targetFloors.includes(floor);

            return (
              <div
                key={floor}
                className={`floor ${isElevatorHere ? "active-floor" : ""}`}
              >
                <div className="floor-left">
                  <span className="floor-number">Floor {floor}</span>
                  {isElevatorHere && <div className="elevator-box"></div>}
                </div>

                <div className="call-buttons">
                  {!isTopFloor && (
                    <button
                      className="call-button up"
                      onClick={() => handleCall(floor, null)}

                    >
                      Up
                    </button>
                  )}
                  {!isBottomFloor && (
                    <button
                      className="call-button down"
                      onClick={() => handleCall(floor, null)}

                    >
                      Down
                    </button>
                  )}
                </div>

                <div className="floor-buttons">
                  <button
                    className={`target-button ${
                      isTarget ? "active-target" : ""
                    }`}
                    onClick={() => {
                      if (!isTarget && elevatorStatus) {
                        handleCall(elevatorStatus.currentFloor, floor);
                        setTargetFloors((prev) => [...prev, floor]);
                      }
                    }}
                  >
                    {floor}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="elevator-summary">
          {elevatorStatus ? (
            <p>
              Elevator is on floor {elevatorStatus.currentFloor}, status:{" "}
              {elevatorStatus.status}, direction: {elevatorStatus.direction},
              door: {elevatorStatus.doorStatus}
            </p>
          ) : (
            <p>Loading elevator summary...</p>
          )}
        </div>
      </div>
    </>
  );
}
