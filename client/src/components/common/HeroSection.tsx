import React from 'react'
import { Link } from 'react-router'
import { Sun, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { TelemetryPreviewCard } from './TelementryPreviewCard'

export const HeroSection: React.FC = () => {
  return (
    <section id="overview" className="relative pt-24 pb-20 px-6 overflow-hidden">
      {/* Glow Background Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[200px] bg-amber-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <Badge 
          variant="outline" 
          className="px-3 py-1.5 rounded-full bg-amber-500/10 border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-8 gap-2"
        >
          <Sun className="h-3.5 w-3.5 animate-spin-slow" />
          Next-Gen Community Solar Microgrid Management
        </Badge>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-5xl mx-auto leading-[1.1]">
          Clean, Reliable Energy Governance for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
            Modern Residential Estates
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto font-normal leading-relaxed">
          KiloWattz seamlessly unifies central solar generation, battery diagnostics, daily fair-use quotas, and real-time monetary savings tracking into one intelligent command center.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth/sign-in" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-6 rounded-xl text-base font-semibold bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 hover:from-amber-300 hover:to-amber-400 transition-all shadow-xl shadow-amber-500/20">
            <span className="flex items-center gap-3">
              Access Your Microgrid
              <ArrowRight className="h-5 w-5" />
            </span>
          </Link>

          <a href="#architecture" className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-6 rounded-xl text-base font-semibold bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800">
            View System Specs
          </a>
        </div>

        <TelemetryPreviewCard />
      </div>
    </section>
  )
}