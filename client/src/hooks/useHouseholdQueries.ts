import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import {
    householdsService,
    type CreateHouseholdPayload,
    type ToggleTerminalPayload,
    type UpdateHouseholdPayload
} from '../services/household'

export const useAllHouseholdsQuery = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: queryKeys.household.list(page, limit),
        queryFn: () => householdsService.getAll(page, limit),
    })
}

export const useMyHouseholdsQuery = () => {
    return useQuery({
        queryKey: queryKeys.household.mine,
        queryFn: householdsService.getAllMine,
    })
}

export const useHouseholdDetailQuery = (id?: string) => {
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
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['household'] })
        },
    })
}

export const useUpdateHouseholdMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateHouseholdPayload }) =>
            householdsService.update(id, payload),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ['household'] })
            await queryClient.invalidateQueries({ queryKey: queryKeys.household.detail(variables.id) })
        },
    })
}

export const useDeleteHouseholdMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => householdsService.delete(id),
        onSuccess: async() => {
            await queryClient.invalidateQueries({ queryKey: ['household'] })
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
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ['household'] })
            await queryClient.invalidateQueries({ queryKey: queryKeys.household.detail(variables.id) })
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
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ['household'] })
            await queryClient.invalidateQueries({
                queryKey: queryKeys.household.detail(variables.householdId),
            })
        },
    })
}