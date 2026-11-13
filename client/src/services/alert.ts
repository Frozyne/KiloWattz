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

export interface Alerts {
    alerts: IAlert[];
    pagination: {
        totalAlerts: number;
        currentPage: number;
        totalPages: number;
    };
}

export interface ELSAlert {
    alert: IAlert;
    householdsSuspended: number;
}

export interface ResolveELSAlert {
    alert: IAlert;
    householdsReactivated: number;
}

export const alertsService = {
    getAlerts: async (payload: AlertPayload): Promise<Alerts> => {
        const res = await api.get<{ data: Alerts }>(
            `/alert?isResolved=${payload.isResolved}&severity=${payload.severity}&scope=${payload.scope}&page=${payload.page}&limit=${payload.limit}`
        )
        return res.data.data
    },

    resolveAlert: async (alertId: string): Promise<IAlert> => {
        const res = await api.patch<{ data: IAlert }>(
            `/alert/resolve/${alertId}`
        )
        return res.data.data
    },

    triggerELS: async (payload: AlertPayload): Promise<ELSAlert> => {
        const res = await api.post<{ data: ELSAlert }> (`/alert/els`, payload)
        return res.data.data
    },

    resolveELS: async (): Promise<ResolveELSAlert> => {
        const res = await api.get<{ data: ResolveELSAlert }> ('/alert/els/resolve')
        return res.data.data
    }
}