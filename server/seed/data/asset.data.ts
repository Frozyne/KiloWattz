export interface SeedInfrastructure {
    model: string
}

export function getSeedInfrastructure(): SeedInfrastructure[] {
    return [
        // Solar Array Blocks (Total 9 blocks = 450kW)
        { model: 'ARR-50KW-BLK' }, { model: 'ARR-50KW-BLK' }, { model: 'ARR-50KW-BLK' },
        { model: 'ARR-50KW-BLK' }, { model: 'ARR-50KW-BLK' }, { model: 'ARR-50KW-BLK' },
        { model: 'ARR-50KW-BLK' }, { model: 'ARR-50KW-BLK' }, { model: 'ARR-50KW-BLK' },
        
        // Inverters (Total 3 units = 450kW)
        { model: 'INV-SG150HX' }, { model: 'INV-SG150HX' }, { model: 'INV-SG150HX' },
        
        // Battery Storage Racks (Total 4 racks = 1.1MWh)
        { model: 'BAT-LFP-250' }, { model: 'BAT-LFP-250' }, { model: 'BAT-LFP-250' }, 
        { model: 'BAT-LFP-250' }, { model: 'BAT-LFP-250' },

        // Phase-Distributed Transformers (3 units for Phase 1, 2, and 3)
        { model: 'TRF-200KVA-PH' }, { model: 'TRF-200KVA-PH' }, { model: 'TRF-200KVA-PH' },

        // Central Telemetry Gateway
        { model: 'GTW-IOT-01' }
    ]
}