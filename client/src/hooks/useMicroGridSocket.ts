import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../context/socketContext'

export interface QuotaBreachPayload {
    householdId: string
    householdName: string
    phaseConnection: string
    consumedKWh: number
    dailyQuotaKWh: number
    connectionStatus: 'Suspended'
}

export interface TelemetryPayload {
    householdId: string
    householdName: string
    phaseConnection: string
    telemetry: {
        powerConsumedKW: number
        powerConsumedKWh: number
        batteryLevelPercent: number
        solarGeneratedKW: number
        gridVoltage: number
        timestamp: string
    }
}

export interface InfrastructureUpdatedPayload {
    assetId: string
    serialNumber: string
    assetType: 'SolarArray' | 'Inverter' | 'BatteryBank' | 'Transformer'
    status: 'Operational' | 'Warning' | 'Critical' | 'Offline'
    diagnostics: {
        temperatureC: number
        efficiencyPercent: number
        lastCheck: string
    }
}

export interface EnvironmentUpdatedPayload {
    _id: string
    ambientTempC: number
    cloudCoverPercent: number
    solarIrradianceWM2: number
    timestamp: string
}

interface UseMicrogridSocketsProps {
    onQuotaBreached?: (data: QuotaBreachPayload) => void
    onTelemetryReceived?: (data: TelemetryPayload) => void
    onInfrastructureUpdated?: (data: InfrastructureUpdatedPayload) => void
    onEnvironmentUpdated?: (data: EnvironmentUpdatedPayload) => void
}

export const useMicrogridSocket = (options: UseMicrogridSocketsProps = {}) => {
    const { socket, isConnected } = useSocket()
    const queryClient = useQueryClient()

    useEffect(() => {
        if( !isConnected || !socket ) return

        const handleQuotaBreach = (data: QuotaBreachPayload) => {
            options.onQuotaBreached?.(data)
            void queryClient.invalidateQueries({queryKey: ['household']})
        }

        const handleTelemetry = (data: TelemetryPayload) => {
            options.onTelemetryReceived?.(data)
            void queryClient.invalidateQueries({queryKey: ['telemetry-overview']})
        }

        const handleInfrastructureUpdate = (data: InfrastructureUpdatedPayload) => {
            options.onInfrastructureUpdated?.(data)
            void queryClient.invalidateQueries({queryKey: ['infrastructure']})
        }

        const handleEnvironmentUpdate = (data: EnvironmentUpdatedPayload) => {
            options.onEnvironmentUpdated?.(data)
            void queryClient.setQueryData(['environment', 'current'], data)
        }

        socket.on('household:quota_breached', handleQuotaBreach)
        socket.on('telemetry:new', handleTelemetry)
        socket.on('infrastructure:updated', handleInfrastructureUpdate)
        socket.on('environment:updated', handleEnvironmentUpdate)

        return () => {
            socket.off('household:quota_breached', handleQuotaBreach)
            socket.off('telemetry:new', handleTelemetry)
            socket.off('infrastructure:updated', handleInfrastructureUpdate)
            socket.off('environment:updated', handleEnvironmentUpdate)
        }
    }, [socket, isConnected, options, queryClient])

    return { isConnected }
}