import api from "../api/api";
import { type IInfrastructure } from "../lib/types";

export interface AssetPayload {
    modelNumber: string
    notes: string
    performedBy: string
    healthPercent: number
}

export interface Summary {
    totalAssets: number;
    statusCounts: {
        operational: number;
        underMaintenance: number;
        maintenanceRequired: number;
        offline: number;
    };
    solarArrays: {
        count: number;
        totalCapacityKW: number;
    };
    batteryBanks: {
        count: number;
        totalCapacityKWh: number;
    };
    inverters: {
        count: number;
        totalCapacityKW: number;
    };
    transformers: {
        count: number;
        totalCapacityKW: number;
    };
}

export interface Stats {
    summary: Summary
    assets: IInfrastructure[]
}

export const infrastructureService = {
    getStats: async (): Promise<Stats> => {
        const res = await api.get<{ data: Stats }>('/infrastructure')
        return res.data.data
    },

    getByType: async (type: string): Promise<IInfrastructure[]> => {
        const res = await api.get<{ data: IInfrastructure[] }>(`/infrastructure/type/${type}`)
        return res.data.data
    },

    addAsset: async (payload: AssetPayload): Promise<IInfrastructure> => {
        const reqData = JSON.stringify(payload)
        const res = await api.post<{ data: { asset: IInfrastructure } }>(
            '/infrastructure', 
            { reqData }
        )
        return res.data.data.asset
    },

    updateMaintainance: async (id: string, payload: AssetPayload): Promise<IInfrastructure> => {
        const reqData = JSON.stringify(payload)
        const res = await api.patch<{ data: IInfrastructure }>(
            `/infrastructure/${id}`, 
            {reqData}
        )
        return res.data.data
    },
}