import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { householdsService } from '../services/household'
import { queryKeys } from './queryKeys'

export const useHouseholds = () => {
    return useQuery({
        queryKey: queryKeys.household.all,
        queryFn: householdsService.getMyHouseholds,
        staleTime: 1000 * 60 * 5
    })
}

export const useAllHouseholds = () => {
    return useQuery({
        queryKey: queryKeys.household.all,
        queryFn: householdsService.getAllHouseholds,
        staleTime: 1000 * 60 * 5
    })
}

export const useHouseholdDetails = (id: string) => {
    return useQuery({
        queryKey: queryKeys.household.detail(id),
        queryFn: () => householdsService.getHouseholdById(id),
        enabled: Boolean(id)
    })
}

export const useToggleTerminal = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            householdId,
            terminalNumber,
            connectionStatus,
        }: {
            householdId: string
            terminalNumber: number
            connectionStatus: 'On' | 'Off' | 'Fault'
        }) => householdsService.toggleTerminal(householdId, terminalNumber, connectionStatus),
        
        onSuccess: async (updatedHousehold) => {
            // Update single household query cache
            queryClient.setQueryData(
                queryKeys.household.detail(updatedHousehold._id),
                updatedHousehold
            )
            // Invalidate directory cache to re-render UI badges
            await queryClient.invalidateQueries({ queryKey: queryKeys.household.all })
        },
    })
}