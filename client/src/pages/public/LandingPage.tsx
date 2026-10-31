import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, Sun } from 'lucide-react'
import "../../index.css";
import { StatsOverview } from '@/components/common/StatsOverview'
import { FeaturesSection } from '@/components/common/FeaturesSection'
import { ArchitectureSection } from '@/components/common/ArchitectureSection'
import { Footer } from '@/components/common/Footer'

export const LandingPage: React.FC = () => {
  return (
    <nav className="bg-primary rounded-3xl gap-2">
<div className="relative min-h-[500px] w-full overflow-hidden rounded-lg border-t border-black">
  <div>
          <div className=" items-center gap-3">
          <div className="relative z-10 flex h-10 w-10 rounded-xl bg-linear-to-br from-gray-800 to-amber-600 items-center justify-center shadow-lg shadow-amber-500/20">
            <Sun className="h-6 w-6 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="absolute z-10 flex items-center text-xl font-bold tracking-tight text-gray-400">
            Kilo<span className="text-gray-800">Wattz</span>
          </span>
        </div>
      </div>
  <img
    src="/src/assets/solar.IMG.jpg"
    alt="Solar panels on a home"
    className="absolute inset-0 h-full w-full object-cover"
  />
  <div className="absolute inset-0 bg-black/50" />
  <div className="relative z-10 flex min-h-[500px] flex-col justify-center p-6 md:p-12">
    <small className="text-amber-400 tracking-widest">
      CLEAN ENERGY, MADE AT CONVENIENCE
    </small>

    <h1 className="mt-3 text-4xl font-extrabold font-serif text-white">
      Power your home.
      <span className="block font-mono text-green-300">Own your future.</span>
    </h1>

    <p className="mt-4 max-w-xl text-sm text-gray-200">
      Premium solar, designed around your life. Cut energy costs, protect your
      home from rising rates, and control at your convenience.
    </p>

    <Button className="mt-5 w-fit rounded-lg bg-amber-900 text-white">
      Explore how it works
      <ArrowRightIcon className="ml-2 h-4 w-4" />
    </Button>
  </div>
</div>
      <StatsOverview />
      <FeaturesSection />
      <ArchitectureSection />
      <Footer />
    </nav>
  )
}

export default LandingPage