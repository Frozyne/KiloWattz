import api from "./api";
import { type IHousehold } from "../lib/types";

export type TerminalConnectionStatus = 'On' | 'Off' | 'Fault';

export const householdsService = {
    getAllHouseholds: async (): Promise<IHousehold[]> => {
        const { data } = await api.get<{ data: IHousehold[] }>('/household/all')
        return data.data
    },

    getMyHouseholds: async (): Promise<IHousehold[]> => {
        const { data } = await api.get<{ data: IHousehold[] }>('/household')
        return data.data
    },

    getHouseholdById: async (id: string): Promise<IHousehold> => {
        const { data } = await api.get<{ data: IHousehold }>(`/household/${id}`)
        return data.data
    },

    toggleTerminal: async (
        householdId: string,
        terminalNumber: number,
        connectionStatus: TerminalConnectionStatus
    ): Promise<IHousehold> => {
        const { data } = await api.patch<{ data: IHousehold }>(
            `/households/${householdId}/toggle-terminal`,
            { terminalNumber, connectionStatus }
        )
        return data.data
    },
}