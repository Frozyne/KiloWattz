import api from "../api/api"

export interface QuotaData {
    householdId: string
    connectionStatus: 'Active' | 'Suspended' | 'Disconnected'
    baseQuotaKWh: number
    currentUsageKWh: number
    remainingLimitKWh: number
    isQuotaBreached: boolean
}

export const quotaService = {
    quotaStatus: async (householdId: string): Promise<QuotaData> => {
        const res = await api.get<{data: QuotaData}>(`/quota/${householdId}`)
        return res.data.data
    }
}