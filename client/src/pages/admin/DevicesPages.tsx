import { useState, useMemo } from 'react'
import { 
  ArrowDownToLineIcon, 
  ArrowUpIcon, 
  ShapesIcon, 
  SearchIcon, 
  Plus, 
  Loader2, 
  Cpu, 
  AlertCircle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useInfrastructureStatsQuery } from '@/hooks/useInfrastructureQueries'
import { AddAssetModal } from '@/components/common/infrastructure/AddAssetModal'
import WeatherStats from '@/components/common/WeatherStats'

export default function DevicesPage() {
  const { data: statsData, isLoading } = useInfrastructureStatsQuery()
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const summary = statsData?.summary
  const assets = statsData?.assets || []

  // Filter assets by search query and asset type
  const filteredAssets = useMemo(() => {
    return assets.filter((asset: any) => {
      const matchesType = typeFilter === 'All' || asset.type === typeFilter
      const q = query.trim().toLowerCase()
      const matchesQuery = 
        !q ||
        asset.name?.toLowerCase().includes(q) ||
        asset.serialNumber?.toLowerCase().includes(q) ||
        asset.modelNumber?.toLowerCase().includes(q)

      return matchesType && matchesQuery
    })
  }, [assets, query, typeFilter])

  // Calculate live online percentage from status counts
  const totalAssets = summary?.totalAssets || 0
  const operationalCount = summary?.statusCounts?.operational || 0
  const onlinePercent = totalAssets > 0 ? Math.round((operationalCount / totalAssets) * 100 * 10) / 10 : 100

  // Aggregate current output across all assets with power diagnostics
  const totalOutputKW = summary?.inverters.totalCapacityKW || 0

  return (
    <div className="min-h-screen p-4 md:p-8 text-accent font-sans space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <WeatherStats />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary p-6 rounded-3xl border border-emerald-800/50 shadow-md">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-accent flex items-center gap-2">
              <Cpu className="h-6 w-6 text-emerald-400" /> Devices & Infrastructure
            </h1>
            <p className="text-sm text-emerald-100/80 mt-1">
              Monitor inverters, meters, solar arrays, battery banks, and gateway controllers.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 text-xs gap-1.5 rounded-xl shadow-sm"
            >
              <Plus className="size-4" /> Register Device
            </Button>
            <Button 
              variant="outline" 
              className="bg-secondary text-emerald-100 border-emerald-800/60 hover:bg-emerald-900/40 text-xs gap-1.5 rounded-xl"
            >
              <ArrowDownToLineIcon className="size-4" /> Export Devices
            </Button>
          </div>
        </div>

        {/* Dynamic Summary Metric Banner */}
        <div className="bg-secondary border border-emerald-800/50 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <span className="border border-emerald-700/50 bg-emerald-950/80 text-emerald-400 p-3.5 rounded-2xl">
              <ShapesIcon className="size-6" />
            </span>
            <div>
              <span className="text-xs font-medium text-emerald-300">Total Tracked Devices</span>
              <p className="text-3xl font-bold font-mono text-accent mt-0.5">{totalAssets}</p>
              <p className="flex items-center gap-1 text-xs text-emerald-400 mt-1 font-medium">
                <ArrowUpIcon size={12} />
                <span>{summary?.statusCounts?.operational || 0} Operational Assets</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:items-center border-t md:border-t-0 md:border-x border-emerald-800/40 pt-4 md:pt-0">
            <span className="text-xs font-medium text-emerald-300">System Online Rate</span>
            <strong className="text-3xl font-bold font-mono text-accent mt-0.5">{onlinePercent}%</strong>
            <small className="text-xs text-emerald-200/80 mt-1">
              {operationalCount} of {totalAssets} reporting normally
            </small>
          </div>

          <div className="flex flex-col md:items-end border-t md:border-t-0 border-emerald-800/40 pt-4 md:pt-0">
            <span className="text-xs font-medium text-emerald-300">Current Output Capacity</span>
            <strong className="text-3xl font-bold font-mono text-accent mt-0.5">{totalOutputKW} KW</strong>
            <p className="flex items-center gap-1 text-xs text-emerald-400 mt-1 font-medium">
              <ArrowUpIcon size={12} />
              <span>Active Grid Load</span>
            </p>
          </div>
        </div>

        {/* Filter & Search Controls */}
        <div className="bg-secondary border border-emerald-800/50 rounded-3xl p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, serial, model..."
              className="w-full rounded-xl border border-emerald-800/60 bg-emerald-950/60 py-2.5 pl-10 pr-3 text-xs outline-none text-emerald-100 placeholder:text-emerald-500 focus:border-emerald-400 transition-colors"
            />
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter devices by type"
              className="w-full sm:w-48 rounded-xl border border-emerald-800/60 bg-emerald-950/60 px-3 py-2.5 text-xs outline-none text-emerald-100 focus:border-emerald-400 transition-colors font-medium"
            >
              <option value="All">All Asset Types</option>
              <option value="SolarArray">Solar Array</option>
              <option value="Inverter">Inverter</option>
              <option value="BatteryBank">Battery Bank</option>
              <option value="Transformer">Transformer</option>
              <option value="Gateway">Gateway</option>
            </select>
          </div>
        </div>

        {/* Devices List Table / Cards */}
        <div className="bg-secondary border border-emerald-800/50 rounded-3xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-emerald-950/40 border-b border-emerald-800/50 grid grid-cols-12 gap-4 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
            <div className="col-span-5">Asset / Model</div>
            <div className="col-span-2">Health</div>
            <div className="col-span-2">Live Telemetry</div>
            <div className="col-span-3 text-right">Status</div>
          </div>

          {isLoading ? (
            <div className="py-20 flex items-center justify-center text-emerald-400 gap-2">
              <Loader2 className="size-6 animate-spin" />
              <span className="text-sm">Loading infrastructure diagnostics...</span>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="py-16 text-center text-emerald-300/60 space-y-2">
              <AlertCircle className="mx-size-8 mx-auto size-8 opacity-40" />
              <p className="text-sm">No hardware assets found matching your criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-emerald-800/30">
              {filteredAssets.map((asset: any) => {
                const isOnline = asset.status === 'Operational'
                const isWarning = asset.status === 'MaintenanceRequired'
                const health = asset.healthPercent ?? 100
                const output = asset.diagnostics?.currentOutputKW || asset.capacityKW || 0
                const charge = asset.diagnostics?.stateOfChargePercent || asset.capacityKWh || 0
                const outputDisplay = output >= 1000 ? `${(output / 1000).toFixed(2)} MW` : `${output} kW`
                const chargeDisplay = `${charge} %`

                return (
                  <div key={asset._id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-emerald-900/20 transition-colors">
                    {/* Asset Name & Serial */}
                    <div className="col-span-5 flex items-center gap-3 overflow-hidden">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900/60 text-emerald-300 font-mono font-bold border border-emerald-700/50 text-xs">
                        {asset.type === 'Inverter' ? 'INV' : asset.type === 'SolarArray' ? 'SOL' : asset.type === 'BatteryBank' ? 'BAT' : 'DEV'}
                      </span>
                      <div className="flex flex-col truncate leading-tight">
                        <span className="text-sm font-bold text-accent truncate">{asset.name}</span>
                        <span className="text-xs font-mono text-emerald-300/70 truncate">{asset.serialNumber} · {asset.modelNumber}</span>
                      </div>
                    </div>

                    {/* Health Percent */}
                    <div className="col-span-2 font-mono text-xs font-semibold text-emerald-100">
                      {health}% Health
                    </div>

                    {/* Live Reading */}
                    <div className="col-span-2 font-mono text-xs font-semibold text-accent">
                      {asset.type === 'BatteryBank' ? chargeDisplay : 
                            output !== 0 && asset.type !== 'Transformer' ? outputDisplay : 
                                    asset.type === 'Transformer' ? `${output} KVA` : '-'}
                    </div>

                    {/* Status Badge */}
                    <div className="col-span-3 flex justify-end">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-semibold border ${
                        isOnline 
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/50' 
                          : isWarning
                          ? 'bg-amber-950/80 text-amber-400 border-amber-700/50'
                          : 'bg-red-950/80 text-red-400 border-red-700/50'
                      }`}>
                        <span className={`size-1.5 rounded-full mr-1.5 ${isOnline ? 'bg-emerald-400 animate-pulse' : isWarning ? 'bg-amber-400' : 'bg-red-400'}`} />
                        {asset.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>

      {/* Register Asset Modal */}
      {isAddModalOpen && (
        <AddAssetModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  )
}