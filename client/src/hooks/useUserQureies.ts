import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { userService, type UserData } from '../services/user'

export const useCurrentUserQuery = () => {
    return useQuery({
        queryKey: queryKeys.user.current,
        queryFn: userService.getUser,
    })
}

export const useUserByIdQuery = (id: string) => {
    return useQuery({
        queryKey: queryKeys.user.detail(id),
        queryFn: () => userService.getUserById(id),
        enabled: Boolean(id),
    })
}

export const useAllUsersQuery = (page: number = 1, limit: number = 10) => {
    return useQuery({
        queryKey: queryKeys.user.list(page, limit),
        queryFn: () => userService.getAllUsers(page, limit),
    })
}

export const useCreateUserMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userData: UserData) => userService.createUser(userData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['user'] })
        },
    })
}

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ user, id }: { user: UserData; id: string }) => userService.updateUser(user, id),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({ queryKey: ['user'] })
            await queryClient.invalidateQueries({ queryKey: queryKeys.user.detail(variables.id) })
        },
    })
}

export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => userService.deleteUser(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['user'] })
        },
    })
}