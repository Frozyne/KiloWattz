interface IModelData {
    type: string
    capacityKW?: number
    capacityKWh?: number
    name: string
}

// Dictionary mapping physical manufacturer model numbers to your database schema shapes
const INFRASTRUCTURE_MODELS: Record<string, IModelData> = {
    'INV-SG150HX': {
        name: 'Sungrow 150kW Central Inverter',
        type: 'Inverter',
        capacityKW: 150
    },
    'BAT-LFP-250': {
        name: 'Lithium Iron Phosphate Rack 250kWh',
        type: 'BatteryBank',
        capacityKWh: 250
    },
    'ARR-50KW-BLK': {
        name: '50kW Solar Array Block',
        type: 'SolarArray',
        capacityKW: 50
    },
    'GTW-IOT-01': {
        name: 'Central Telemetry Gateway',
        type: 'Gateway'
    },
    'TRF-200KVA-PH': {
        name: '200kVA Step-Down Transformer',
        type: 'Transformer',
        capacityKW: 200
    }
}

export const getInfrastructureModelData = (modelNumber: string): IModelData | null => {
    if (!modelNumber) return null
    
    const data = INFRASTRUCTURE_MODELS[modelNumber.trim().toUpperCase()]
    return data || null
}