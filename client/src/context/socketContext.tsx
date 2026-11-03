import React, { createContext, useContext, useEffect, useState , type ReactNode} from "react";
import { io, type Socket } from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_API_BASE_URL

export const socket: Socket = io(SOCKET_SERVER_URL, {
    autoConnect: false, // We control the connection inside the Provider
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
})

interface SocketContextState {
    socket: Socket
    isConnected: boolean
}

const SocketContext = createContext<SocketContextState | undefined>(undefined)

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        // Initiate connection when the app mounts
        socket.connect()

        const onConnect = () => setIsConnected(true)
        const onDisconnect = () => setIsConnected(false)

        socket.on('connect', onConnect)
        socket.on('disconnect', onDisconnect)

        // Cleanup listeners and disconnect when the app unmounts
        return () => {
            socket.off('connect', onConnect)
            socket.off('disconnect', onDisconnect)
            socket.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = (): SocketContextState => {
    const context = useContext(SocketContext)
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context
}