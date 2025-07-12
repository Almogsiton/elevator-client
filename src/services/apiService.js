import axios from "./axiosInstance";

// Authentication
export async function register(email, password, confirmPassword) {
  return axios.post("/users/register", {
    email,
    password,
    confirmPassword,
  });
}

export async function login(email, password) {
  return axios.post("/users/login", {
    email,
    password,
  });
}

// Building
export async function addBuilding(buildingData) {
  return axios.post("/buildings/add", buildingData);
}

export async function getUserBuildings(userId) {
  return axios.get(`/buildings/get/user/${userId}`);
}

export async function deleteBuilding(id) {
  return axios.delete(`/buildings/delete/${id}`);
}

export async function getBuilding(buildingId) {
  return axios.get(`/buildings/get/${buildingId}`);
}

// Elevator Simulation
export async function getElevatorStatus(buildingId) {
  return axios.get(`/elevators/get/status/building/${buildingId}`);
}

export async function callElevator(buildingId, requestedFloor, destinationFloor = null) {
  return axios.post("/elevatorcall", {
    buildingId,
    requestedFloor,
    destinationFloor
  });
}
