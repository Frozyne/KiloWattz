import React from 'react'

export const StatsOverview: React.FC = () => {
  return (
    <section id="impact" className="py-12 border-y border-zinc-800/80 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white">
            450 <span className="text-amber-400">kWp</span>
          </div>
          <div className="text-sm text-zinc-400 mt-1">Central Solar Generation</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white">
            1.1 <span className="text-amber-400">MWh</span>
          </div>
          <div className="text-sm text-zinc-400 mt-1">LiFePO4 Storage Capacity</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white">100+</div>
          <div className="text-sm text-zinc-400 mt-1">Connected Household Meters</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white">99.9%</div>
          <div className="text-sm text-zinc-400 mt-1">Grid Uptime & Stability</div>
        </div>
      </div>
    </section>
  )
}