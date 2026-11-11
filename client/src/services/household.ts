import api from '../api/api'
import { type IHousehold } from '../lib/types'

export interface CreateHouseholdPayload {
    plotNumber: string
    street: string
    meterSerialNumber: string
    phaseConnection: 'Phase 1' | 'Phase 2' | 'Phase 3'
}

export type UpdateHouseholdPayload = Partial<CreateHouseholdPayload>

export interface ToggleTerminalPayload {
    terminalNumber: number // 1 to 6
    connectionStatus: 'On' | 'Off' | 'Fault'
}

export const householdsService = {
    getAllMine: async (): Promise<IHousehold[]> => {
        const res = await api.get<{ data: IHousehold[] }>('/household')
        return res.data.data
    },

    getAll: async (page: number, limit: number): Promise<IHousehold[]> => {
        const res = await api.get<{ data: IHousehold[] }>(`/household/all?page=${page}&limit=${limit}`)
        return res.data.data
    },

    getById: async (id?: string): Promise<IHousehold> => {
        const res = await api.get<{ data: IHousehold }>(`/household/${id}`)
        return res.data.data
    },

    create: async (payload: CreateHouseholdPayload): Promise<IHousehold> => {
        const reqData = JSON.stringify(payload)
        const res = await api.post<{ data: IHousehold }>('/household', {reqData})
        return res.data.data
    },

    update: async (id: string, payload: UpdateHouseholdPayload): Promise<IHousehold> => {
        const reqData = JSON.stringify(payload)
        const res = await api.post<{ data: IHousehold }>(`/household/${id}`, {reqData})
        return res.data.data
    },

    delete: async (id: string): Promise<any> => {
        const res = await api.delete(`/households/${id}`)
        return res
    },

    updateStatus: async (
        id: string,
        connectionStatus: 'Active' | 'Suspended' | 'Disconnected'
    ): Promise<IHousehold> => {
        const res = await api.patch<{ data: { household: IHousehold } }>(
            `/households/${id}/status`, 
            {connectionStatus}
        )
        return res.data.data.household
    },

    toggleTerminal: async (
        householdId: string,
        payload: ToggleTerminalPayload
    ): Promise<IHousehold> => {
        const reqData = JSON.stringify(payload)
        const res = await api.patch<{ data: { household: IHousehold } }>(
            `/households/${householdId}/toggle-terminal`,
            {reqData}
        )
        return res.data.data.household
    },
}