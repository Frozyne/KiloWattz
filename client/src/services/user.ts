import api from "../api/api";
import { type IUser, type IHousehold } from "@/lib/types";

export interface UserData {
  fullName: string
  email: string
  password: string
  role: 'User' | 'Admin' | null
  households?: IHousehold[]
}

export const userService = {
  getUser: async (): Promise<IUser> => {
    const res = await api.get<{data: IUser}>(`/user`);
    return res.data.data;
  },

  getUserById: async (id: string): Promise<IUser> => {
    const res = await api.get<{data: IUser}>(`/user/${id}`)
    return res.data.data
  },

  getAllUsers: async (page: number, limit: number): Promise<IUser[]> => {
    const res = await api.get<{data: IUser[]}>(`/user/all?page=${page}&limit=${limit}`)
    return res.data.data
  },

  createUser: async (user: UserData): Promise<IUser> => {
    const res = await api.post<{data: IUser}>(`/user/add`, { ...user })
    return res.data.data
  },

  updateUser: async (user: UserData, id: string): Promise<IUser> => {
    const res = await api.patch<{data: IUser}>(`/user/${id}`, { ...user })
    return res.data.data
  },

  deleteUser: async (id: string): Promise<any> => {
    const res = await api.delete(`/user/${id}`)
    return res
  }
}
