import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { infrastructureService, type AssetPayload } from '../services/infrastructure'

export const useInfrastructureStatsQuery = () => {
    return useQuery({
        queryKey: queryKeys.infrastructure.stats,
        queryFn: infrastructureService.getStats,
    })
}

export const useInfrastructureByTypeQuery = (type: string) => {
    return useQuery({
        queryKey: queryKeys.infrastructure.byType(type),
        queryFn: () => infrastructureService.getByType(type),
        enabled: Boolean(type),
    })
}

export const useAddAssetMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: AssetPayload) => infrastructureService.addAsset(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['infrastructure'] })
        },
    })
}

export const useUpdateMaintenanceMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: AssetPayload }) =>
            infrastructureService.updateMaintainance(id, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['infrastructure'] })
        },
    })
}