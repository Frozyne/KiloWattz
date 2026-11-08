import api from "../api/api";
import { type IInfrastructure } from "../lib/types";

export interface AssetPayload {
    modelNumber: string
    notes: string
    performedBy: string
    healthPercent: number
}

export const infrastructureService = {
    getStats: async (): Promise<any> => {
        const res = await api.get<{ data: any }>('/infrastructure')
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