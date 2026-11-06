import api from "./api";

export const getInfrastructure = async () => {
  const response = await api.get("/infrastructure");
  return response.data;
};