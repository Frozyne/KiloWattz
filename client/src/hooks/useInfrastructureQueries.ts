import { useQuery } from '@tanstack/react-query'
import { infrastructureService  } from '../services/infrastructure'
import { queryKeys } from './queryKeys'

export const useInfrastructureStats = () => {
    return useQuery({
        queryKey: queryKeys.infrastructure.all,
        queryFn: infrastructureService.getAssetStats,
        staleTime: 1000 * 60 * 5
    })
}

export const useInfrastructureTypes = (type: string) => {
    return useQuery({
        queryKey: queryKeys.infrastructure.detail(type),
        queryFn: () => infrastructureService.getAssetByType(type),
        enabled: Boolean(type)
    })
}