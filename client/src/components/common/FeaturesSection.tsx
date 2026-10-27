import React from 'react'
import { Cpu, ShieldCheck, TrendingUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">
            Engineered For Parity & Precision
          </h2>
          <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Everything Needed to Govern an Independent Solar Microgrid
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="rounded-2xl bg-zinc-900/40 border-zinc-800 hover:border-amber-500/50 transition-all group p-2">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                <Cpu className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-white">Live Telemetry Ingestion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-sm leading-relaxed">
                High-frequency smart meter pings monitor active power draw, grid voltage levels, and battery state of charge across the entire estate.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="rounded-2xl bg-zinc-900/40 border-zinc-800 hover:border-amber-500/50 transition-all group p-2">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-white">Fair-Use Daily Quotas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Automated 0–15 kWh daily allocation management protects central battery reserves from premature deep discharges with automated suspension routines.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="rounded-2xl bg-zinc-900/40 border-zinc-800 hover:border-amber-500/50 transition-all group p-2">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold text-white">Monetary Savings Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Calculates real-time monetary savings in Nigerian Naira (₦) for residents by evaluating solar allocation coverage against baseline DisCo grid tariffs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}