import api from "./api";

export const getHouseholds = async () => {
  const response = await api.get("/household");
  return response.data;
};