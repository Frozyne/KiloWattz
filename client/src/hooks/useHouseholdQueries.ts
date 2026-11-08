import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import {
    householdsService,
    type CreateHouseholdPayload,
    type ToggleTerminalPayload,
} from '../services/household'

export const useAllHouseholdsQuery = () => {
    return useQuery({
        queryKey: queryKeys.household.all,
        queryFn: householdsService.getAll,
    })
}

export const useMyHouseholdsQuery = () => {
    return useQuery({
        queryKey: queryKeys.household.mine,
        queryFn: householdsService.getAllMine,
    })
}

export const useHouseholdDetailQuery = (id: string) => {
    return useQuery({
        queryKey: queryKeys.household.detail(id),
        queryFn: () => householdsService.getById(id),
        enabled: Boolean(id),
    })
}

export const useCreateHouseholdMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateHouseholdPayload) => householdsService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.household.all })
        },
    })
}

export const useUpdateHouseholdMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: CreateHouseholdPayload }) =>
            householdsService.update(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.household.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.household.detail(variables.id) })
        },
    })
}

export const useDeleteHouseholdMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => householdsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.household.all })
        },
    })
}

export const useUpdateHouseholdStatusMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            status,
        }: {
            id: string
            status: 'Active' | 'Suspended' | 'Disconnected'
        }) => householdsService.updateStatus(id, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.household.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.household.detail(variables.id) })
        },
    })
}

export const useToggleTerminalMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            householdId,
            payload,
        }: {
            householdId: string
            payload: ToggleTerminalPayload
        }) => householdsService.toggleTerminal(householdId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.household.all })
            queryClient.invalidateQueries({
                queryKey: queryKeys.household.detail(variables.householdId),
            })
        },
    })
}