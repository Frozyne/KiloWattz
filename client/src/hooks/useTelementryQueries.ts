import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { getCommunityTelemetry, getHouseholdTelemetry } from '../services/telemetry'

export const useCommunityTelemetryQuery = () => {
    return useQuery({
        queryKey: queryKeys.telemetry.community,
        queryFn: getCommunityTelemetry,
    })
}

export const useHouseholdTelemetryQuery = (householdId?: string) => {
    return useQuery({
        queryKey: queryKeys.telemetry.household(householdId),
        queryFn: () => getHouseholdTelemetry(householdId),
        enabled: Boolean(householdId),
    })
}