import api from "../api/api";

export const getHouseholdTelemetry = async (householdId: string): Promise<any> => {
  const res = await api.get<{ data: any }>(`/telemetry/household/${householdId}`);
  return res.data.data;
};

export const getCommunityTelemetry = async (): Promise<any> => {
  const res = await api.get<{ data: any }>("/telemetry/community");
  return res.data.data;
};