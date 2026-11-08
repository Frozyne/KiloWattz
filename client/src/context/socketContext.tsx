import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/storage/useAuthStorage'

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

interface SocketContextType {
    socket: Socket | null
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
})

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient()
    const token = useAuthStore((state) => state.token)
    const socketRef = useRef<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        console.log('[SOCKET PROVIDER EFFECT TRIGGERED] Token state:', {
            nhasToken: Boolean(token),
            tokenValue: token ? `${token.substring(0, 15)}...` : null
        })

        if (!token) {
            console.warn('[SOCKET PROVIDER] Aborting connection: No token in Zustand store.')
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
                setIsConnected(false)
            }
            return
        }

        console.log('[SOCKET PROVIDER] Attempting connection to:', SOCKET_URL)
        // Format token payload to match Bearer standard if required by backend
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`

        // 2. Initialize Socket Connection
        const socket = io(SOCKET_URL, {
            auth: { token: formattedToken },
            extraHeaders: {
                Authorization: formattedToken,
            },
            withCredentials: true,
            transports: ['websocket', 'polling'],
        })

        socketRef.current = socket

        socket.on('connect', () => {
            console.log('[SOCKET CONNECTED] Socket ID:', socket.id)
            setIsConnected(true)
        })

        // 3. Log handshake and server authentication errors explicitly
        socket.on('connect_error', (error) => {
            console.error('[SOCKET CONNECT ERROR]:', error.message)
            setIsConnected(false)
        })

        // Cache Invalidation Event Handlers
        socket.on('telemetry:new', async () => {
            await queryClient.invalidateQueries({ queryKey: ['telemetry'] })
            await queryClient.invalidateQueries({ queryKey: ['household'] })
        })

        socket.on('infrastructure:updated', async (payload: { assetId?: string }) => {
            await queryClient.invalidateQueries({ queryKey: ['infrastructure'] })
            if (payload?.assetId) {
                await queryClient.invalidateQueries({ queryKey: ['infrastructure', payload.assetId] })
            }
        })

        socket.on('household:quota_breached', async (payload: { householdId?: string }) => {
            await queryClient.invalidateQueries({ queryKey: ['household'] })
            await queryClient.invalidateQueries({ queryKey: ['quota'] })
            if (payload?.householdId) {
                await queryClient.invalidateQueries({ queryKey: ['quota', payload.householdId] })
            }
        })

        socket.on('alert:new', async () => {
            await queryClient.invalidateQueries({ queryKey: ['alert'] })
        })

        socket.on('environment:updated', async () => {
            await queryClient.invalidateQueries({ queryKey: ['environment'] })
        })

        socket.on('disconnect', (reason) => {
            console.warn('[SOCKET DISCONNECTED]:', reason)
            setIsConnected(false)
        })

        return () => {
            socket.disconnect()
            socketRef.current = null
            setIsConnected(false)
        }
    }, [token, queryClient])

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = (): SocketContextType => useContext(SocketContext)