import React from 'react'
import { Button } from '@base-ui/react';
import { ArrowRightIcon, Sun, Zap } from 'lucide-react'
import "../../index.css";
import { useState } from 'react';
import { StatsOverview } from '@/components/common/StatsOverview'
import { FeaturesSection } from '@/components/common/FeaturesSection'
import { ArchitectureSection } from '@/components/common/ArchitectureSection'
import { Footer } from '@/components/common/Footer'

export const LandingPage: React.FC = () => {
  const [client, setClient] = useState("All")
  return (
    <nav className="bg-primary rounded-3xl gap-2">
<div className="relative min-h-[500px] w-full overflow-hidden rounded-lg border-t border-black">
  <div>
          <div className="flex items-center">
          <div className="relative z-10 flex h-10 w-10 rounded-xl bg-linear-to-br from-gray-800 to-amber-600 items-center justify-center shadow-lg shadow-amber-500/20 mt-3 ml-2">
            <Sun className="h-6 w-6 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="absolute z-10 pl-13 mt-3 text-xl font-bold tracking-tight text-gray-400">
            Kilo<span className="text-gray-800">Wattz</span>
          </span>
          <div className='z-10 relative flex ml-30 mt-3 gap-30 sm:flex-row'>
        <Button className="text-black hover:bg-gray-500 rounded-lg p-1 pl-5">Our system</Button>
        <Button className="text-black hover:bg-gray-500 rounded-lg p-1 pl-5">Sign in</Button>
        <Button className="text-black hover:bg-gray-500 rounded-lg p-1 pl-5">Customers</Button>
        <Button className="text-black border-black hover:bg-gray-500 rounded-lg p-1 pl-5">Get an estimate</Button>
        </div>
         <div className='relative z-10 ml-28 mt-3'>
            <select value={client}
                        onChange={(e) => { setClient(e.target.value); }}
                        className="shrink-0 rounded-md border border-white/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 text-gray-800">
                            <option value="All">Client Swicher: Individual</option>
                            <option value="North">North</option>
                            <option value="South">South</option>
                            <option value="East">East</option>
                            <option value="West">West</option>
                        </select>
          </div>
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
    <Button className="mt-10 w-fit rounded-lg flex items-center border-black p-1 bg-amber-900 text-white">
      Explore how it works
      <ArrowRightIcon className="ml-2 h-4 w-4 text-black"/>
    </Button>
  </div>
</div>
<div className='overflow-hidden whitespace-nowrap flex justify-around gap-10'>
  <span className='flex w-max animate-marquee tracking-widest'><Zap className='text-amber-600'/> CLEAN POWER, DAY AND NIGHT</span>
  <span className='flex w-max animate-marquee tracking-widest'><Zap className='text-amber-600'/> CLEAN POWER, DAY AND NIGHT</span>
  <span className='flex w-max animate-marquee tracking-widest'><Zap className='text-amber-600'/> CLEAN POWER, DAY AND NIGHT</span>
    </div>
      <StatsOverview />
      <FeaturesSection />
      <ArchitectureSection />
      <Footer />
    </nav>
  )
}

export default LandingPage