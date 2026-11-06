import api from "./api";

export const getHouseholdTelemetry = async (
  householdId: string
) => {
  const response = await api.get(
    `/telemetry/household/${householdId}`
  );

  return response.data;
};

export const getCommunityTelemetry = async () => {
  const response = await api.get("/telemetry/community");

  return response.data;
};