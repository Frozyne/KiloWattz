import React, { useState } from "react";
import Analytics from "../../components/admin/Analytics"; // Adjust path as needed
import {
  Sun,
  Zap,
  BatteryCharging,
  Activity,
  ShieldAlert,
  CloudSun,
  Gauge,
  Layers,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

// Mock telemetry data matching the Reading type required by your Analytics component
const SAMPLE_TELEMETRY_DATA = [
  { date: "2026-10-27T00:00:00Z", output: 0.0 },
  { date: "2026-10-27T06:00:00Z", output: 4.2 },
  { date: "2026-10-27T09:00:00Z", output: 14.8 },
  { date: "2026-10-27T12:00:00Z", output: 22.4 },
  { date: "2026-10-27T14:00:00Z", output: 18.42 },
  { date: "2026-10-27T18:00:00Z", output: 3.1 },
  { date: "2026-10-27T22:00:00Z", output: 0.0 },
];

export default function AnalyticsPage () : React.JSX.Element {
  const [scope, setScope] = useState<"community" | "household">("community");
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d">("24h");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8 text-zinc-900 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
              <Zap className="h-4 w-4" /> Microgrid Operations & Analytics
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              System Performance Dashboard
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Comprehensive telemetry, generation efficiency, quota compliance, and grid health diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Scope Toggle */}
            <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-medium">
              <button
                onClick={() => setScope("community")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  scope === "community"
                    ? "bg-white text-zinc-900 shadow-sm font-semibold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                Community Grid
              </button>
              <button
                onClick={() => setScope("household")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  scope === "household"
                    ? "bg-white text-zinc-900 shadow-sm font-semibold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                My Home
              </button>
            </div>

            {/* Timeframe Toggle */}
            <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-medium">
              {(["24h", "7d", "30d"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-2.5 py-1.5 rounded-lg uppercase transition-all ${
                    timeframe === t
                      ? "bg-amber-400 text-zinc-950 font-bold"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 transition-all"
              title="Refresh Analytics Data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-amber-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* --- HIGH-LEVEL METRICS KPI ROW --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Generation */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-center text-xs font-medium text-zinc-500 mb-2">
              <span>Total Solar Generation</span>
              <Sun className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-zinc-900">
              3,450.5 <span className="text-sm font-normal text-zinc-500">kWh</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 mt-2 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>94.2% of Weather Forecast Target</span>
            </div>
          </div>

          {/* Card 2: Estate Consumption */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-center text-xs font-medium text-zinc-500 mb-2">
              <span>Total Energy Consumed</span>
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-zinc-900">
              2,180.2 <span className="text-sm font-normal text-zinc-500">kWh</span>
            </div>
            <div className="text-xs text-zinc-500 mt-2">
              Peak Demand: <strong className="text-zinc-800">280.4 kW</strong> at 14:00
            </div>
          </div>

          {/* Card 3: Storage State of Charge */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-center text-xs font-medium text-zinc-500 mb-2">
              <span>Battery Bank Reserve</span>
              <BatteryCharging className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-zinc-900">
              88.5<span className="text-sm font-normal text-zinc-500">%</span>
            </div>
            <div className="text-xs text-emerald-600 mt-2 font-medium">
              1,100 kWh Capacity — Optimal Range
            </div>
          </div>

          {/* Card 4: Quota & Compliance */}
          <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-center text-xs font-medium text-zinc-500 mb-2">
              <span>Quota Compliance</span>
              <ShieldAlert className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-zinc-900">
              96<span className="text-sm font-normal text-zinc-500">%</span>
            </div>
            <div className="text-xs text-amber-600 mt-2 font-medium">
              4 Quota Breaches Recorded Today
            </div>
          </div>

        </div>

        {/* --- MAIN ANALYTICS CHART & HEALTH EMBED --- */}
        {/* Your existing Analytics component embeds directly here */}
        <div className="w-full">
          <Analytics data={SAMPLE_TELEMETRY_DATA} />
        </div>

        {/* --- EXPANDED TECHNICAL BREAKDOWN PANELS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panel 1: Environmental Conditions & Correlation */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
              <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
                <CloudSun className="h-5 w-5 text-amber-500" /> Environmental Yield Context
              </h3>
              <span className="text-xs font-mono text-zinc-400">Open-Meteo Sync</span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-zinc-50">
                <span className="text-zinc-500">Solar Irradiance</span>
                <span className="font-semibold text-zinc-900 font-mono">850 W/m²</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-50">
                <span className="text-zinc-500">Cloud Cover</span>
                <span className="font-semibold text-zinc-900 font-mono">15%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-50">
                <span className="text-zinc-500">Ambient Temperature</span>
                <span className="font-semibold text-zinc-900 font-mono">31.5 °C</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-500">Thermal Degradation Loss</span>
                <span className="font-semibold text-amber-600 font-mono">-2.6% Efficiency</span>
              </div>
            </div>
          </div>

          {/* Panel 2: Phase Connection Load Balancing */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
              <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-500" /> Phase Load Distribution
              </h3>
              <span className="text-xs font-mono text-zinc-400">3-Phase Estate Grid</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-zinc-600">Phase 1 Draw</span>
                  <span className="font-mono text-zinc-900">72.4 kW (33%)</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-400 h-2.5 rounded-full" style={{ width: "33%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-zinc-600">Phase 2 Draw</span>
                  <span className="font-mono text-zinc-900">78.1 kW (36%)</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "36%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-zinc-600">Phase 3 Draw</span>
                  <span className="font-mono text-zinc-900">67.7 kW (31%)</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: "31%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Panel 3: Inverter & Grid Voltage Stability */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
              <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
                <Gauge className="h-5 w-5 text-emerald-500" /> Voltage & Frequency Stability
              </h3>
              <span className="text-xs font-mono text-zinc-400">Telemetry Pings</span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-zinc-50">
                <span className="text-zinc-500">Nominal Line Voltage</span>
                <span className="font-semibold text-emerald-600 font-mono">230.1 V (Stable)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-50">
                <span className="text-zinc-500">Inverter Conversion Efficiency</span>
                <span className="font-semibold text-zinc-900 font-mono">98.4%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-50">
                <span className="text-zinc-500">Grid Frequency</span>
                <span className="font-semibold text-zinc-900 font-mono">50.02 Hz</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-500">Active Smart Meters</span>
                <span className="font-semibold text-zinc-900 font-mono">100 / 100 Online</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}