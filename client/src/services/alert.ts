import api from '../api/api'
import { type IAlert } from '../lib/types'

export interface AlertPayload {
    severity?: 'Info' | 'Warning' | 'Critical' | 'Emergency'
    scope?: 'System' | 'Household' | 'Infrastructure'
    reason?: string
    page?: number
    limit?: number
    isResolved?: boolean
}

export const alertsService = {
    getAlerts: async (payload: AlertPayload): Promise<any> => {
        const res = await api.get<{ data: any }>(
            `
            /alert?isResolved=${payload.isResolved}&severity=${payload.severity}&scope=${payload.scope}&page=${payload.page}&limit=${payload.limit}
            `
        )
        return res.data.data
    },

    resolveAlert: async (alertId: string): Promise<IAlert> => {
        const res = await api.patch<{ data: IAlert }>(
            `/alert/resolve/${alertId}`
        )
        return res.data.data
    },

    triggerELS: async (payload: AlertPayload): Promise<any> => {
        const reqData = JSON.stringify(payload)
        const res = await api.post<{ data: any }> (`/alert/els`, {reqData})
        return res.data.data
    },

    resolveELS: async (): Promise<any> => {
        const res = await api.get<{ data: any }> ('/alert/els/resolve')
        return res.data.data
    }
}