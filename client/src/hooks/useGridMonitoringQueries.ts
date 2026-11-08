import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { quotaService } from '../services/quota'
import { alertsService, type AlertPayload } from '../services/alert'
import { environmentService } from '../services/environment'

export const useQuotaStatusQuery = (householdId: string) => {
    return useQuery({
        queryKey: queryKeys.quota.status(householdId),
        queryFn: () => quotaService.quotaStatus(householdId),
        enabled: Boolean(householdId),
    })
}

export const useAlertsQuery = (params?: AlertPayload) => {
    return useQuery({
        queryKey: queryKeys.alert.list(params),
        queryFn: () => alertsService.getAlerts(params || {}),
    })
}

export const useResolveAlertMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (alertId: string) => alertsService.resolveAlert(alertId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['alert'] })
        },
    })
}

export const useTriggerELSMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: AlertPayload) => alertsService.triggerELS(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['alert'] })
            await queryClient.invalidateQueries({ queryKey: ['household'] })
        },
    })
}

export const useResolveELSMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: alertsService.resolveELS,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['alert'] })
            await queryClient.invalidateQueries({ queryKey: ['household'] })
        },
    })
}

export const useLatestEnvironmentQuery = () => {
    return useQuery({
        queryKey: queryKeys.environment.latest,
        queryFn: environmentService.latest,
    })
}