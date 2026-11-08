import { type AlertPayload } from '../services/alert'

export const queryKeys = {
    // Household endpoints (/household)
    household: {
        all: ['household', 'all'] as const,
        mine: ['household', 'mine'] as const,
        detail: (id: string) => ['household', 'detail', id] as const,
    },

    // Telemetry endpoints (/telemetry)
    telemetry: {
        community: ['telemetry', 'community'] as const,
        household: (householdId: string) => ['telemetry', 'household', householdId] as const,
    },

    // Infrastructure endpoints (/infrastructure)
    infrastructure: {
        stats: ['infrastructure', 'stats'] as const,
        byType: (type: string) => ['infrastructure', 'type', type] as const,
    },

    // Quota endpoints (/quota)
    quota: {
        status: (householdId: string) => ['quota', householdId] as const,
    },

    // Alert & Emergency Load Shedding endpoints (/alert)
    alert: {
        list: (params?: AlertPayload) => ['alert', 'list', params] as const,
    },

    // Environmental metrics endpoints (/api/enviroment)
    environment: {
        latest: ['environment', 'latest'] as const,
    },

    // User management endpoints (/user)
    user: {
        current: ['user', 'current'] as const,
        detail: (id: string) => ['user', 'detail', id] as const,
        list: (page: number, limit: number) => ['user', 'list', page, limit] as const,
    },
}