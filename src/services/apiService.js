import axios from "axios";

const API_BASE_URL = "http://localhost:5145/api";

export const login = (email, password) =>
  axios.post(`${API_BASE_URL}/user/login`, { email, password });

export const register = (email, password) =>
  axios.post(`${API_BASE_URL}/user/register`, { email, password });

export const getBuildings = (userId) =>
  axios.get(`${API_BASE_URL}/building/byUser/${userId}`);

export const createBuilding = (buildingData) =>
  axios.post(`${API_BASE_URL}/building/create`, buildingData);

export const getBuildingDetails = (buildingId) =>
  axios.get(`${API_BASE_URL}/building/${buildingId}`);



