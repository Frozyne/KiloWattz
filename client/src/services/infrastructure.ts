import api from "./api";
import { type IInfrastructure } from "../lib/types";

export const infrastructureService = {
    getAssetStats: async (): Promise<IInfrastructure[]> => {
        const { data } = await api.get<{ data: IInfrastructure[] }>('/infrastructure')
        return data.data
    },

    getAssetByType: async (type: string): Promise<IInfrastructure> => {
        const { data } = await api.get<{ data: IInfrastructure }>(`/infrastructure/type/${type}`)
        return data.data
    },
}