export interface IAlert extends Document {
    title: string
    message: string
    severity: 'Info' | 'Warning' | 'Critical' | 'Emergency'
    scope: 'System' | 'Household' | 'Infrastructure'
    household?: string
    infrastructure?: string
    isResolved: boolean
    resolvedAt?: Date
    resolvedBy?: string
    metadata?: Record<string, any>
    createdAt: Date
    updatedAt: Date
}

export interface IDailyReport extends Document {
    date: Date
    totalSolarGeneratedKWh: number
    totalEnergyConsumedKWh: number
    peakPowerDemandKW: number
    totalQuotaBreaches: number
    averageBatterySoCPercent: number
}

export interface IEnvironment extends Document {
    cloudCoverPercent: number
    temperatureC: number
    solarIrradiance: number // W/m²
    expectedYieldKW: number
    timestamp: Date
    createdAt: Date
    updatedAt: Date
}

export interface IQuotaBreach {
    breachedAt: Date
    consumedKWh: number
    dailyQuotaKWh: number
}

export interface IHousehold extends Document {
  plotNumber: string;
  street: string;
  consumedKWh: number
  dailyKWHQuota: number;
  connectionStatus: 'Active' | 'Suspended' | 'Disconnected';
  quotaBreaches: IQuotaBreach[]; // Array of quota breach records
  meterSerialNumber?: string; // Optional since it has no required: true validator
  phaseConnection: 'Phase 1' | 'Phase 2' | 'Phase 3';
  user: string; // Reference to User model
  createdAt: Date;
  updatedAt: Date;
}

export interface IMaintenanceLog {
    performedAt: Date
    performedBy: string
    notes: string
    statusAfter: 'Operational' | 'MaintenanceRequired' | 'UnderMaintenance' | 'Offline'
}

export interface IInfrastructure extends Document {
    serialNumber: string
    name: string
    modelNumber: string
    type: 'SolarArray' | 'Inverter' | 'BatteryBank' | 'Transformer' | 'Gateway'
    capacityKW?: number
    capacityKWh?: number
    status: 'Operational' | 'MaintenanceRequired' | 'UnderMaintenance' | 'Offline'
    healthPercent: number
    lastMaintenanceDate?: Date
    diagnostics: {
        voltageV?: number
        temperatureC?: number
        efficiencyPercent?: number
        currentOutputKW?: number
        stateOfChargePercent?: number
    }
    maintenanceLogs?: IMaintenanceLog[]
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string; // Optional if you decide to hide it dynamically using select: false
  role: string;
  avatarUrl: {
    url: string | null;
    publicId: string | null;
  };
  households: string[]; // Reference to Household model
  createdAt: Date;
  updatedAt: Date;
}

export interface ITelemetry extends Document {
  timestamp: Date;
  scope: 'Community' | 'Household';
  household?: string; // Reference to Household model
  solarGeneratedKW: number;
  powerConsumedKW: number;
  batteryLevelPercent: number;
  gridVoltage: number;
  solarGeneratedKWh?: number; // Optional, can be calculated from solarGeneratedKW over time
  powerConsumedKWh?: number; // Optional, can be calculated from powerConsumedKW over time
  createdAt: Date;
  updatedAt: Date;
}