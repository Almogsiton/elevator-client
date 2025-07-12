import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5145", 
});

export default axiosInstance;
