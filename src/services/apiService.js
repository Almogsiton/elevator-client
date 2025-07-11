import axios from "axios";

export async function register(email, password, confirmPassword) {
  return axios.post("/api/user/register", {
    email,
    password,
    confirmPassword,
  });
}

export async function login(email, password) {
  return axios.post("/api/user/login", {
    email,
    password,
  });
}

export async function createBuilding(buildingData) {
  return axios.post("/api/building", buildingData);
}

export async function getFloorLimits() {
  return axios.get("/api/config/floor-limits");
}

export async function getBuildings(userId) {
  return axios.get(`/api/building/${userId}`);
}

export async function deleteBuilding(id) {
  return axios.delete(`/api/building/${id}`);
}



