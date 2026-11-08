import api from '../api/api'
import { type IEnvironment } from '@/lib/types'

export const environmentService = {
    latest: async (): Promise<IEnvironment> => {
        const res = await api.get<{data: IEnvironment}>(`/api/enviroment/latest`)
        return res.data.data
    }
}