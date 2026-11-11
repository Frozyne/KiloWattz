import api from "../api/api";
import { type ITelemetry } from "@/lib/types";

interface CommunitySum {
  solarGeneratedKW: number,
  powerConsumedKW: number,
  batteryLevelPercent: number,
  gridVoltage: number
}

export interface CommunityTem {
  summary: CommunitySum
  hourly: ITelemetry[]
  activeHouseholds: number
}



export const getHouseholdTelemetry = async (householdId?: string): Promise<ITelemetry[]> => {
  const res = await api.get<{ data: ITelemetry[] }>(`/telemetry/household/${householdId}`);
  return res.data.data;
};

export const getCommunityTelemetry = async (): Promise<CommunityTem> => {
  const res = await api.get<{ data: CommunityTem }>("/telemetry/community");
  return res.data.data;
};