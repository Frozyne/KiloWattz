import React from 'react'
import { Button } from '@base-ui/react';
import { ArrowRightIcon, Sun, Zap } from 'lucide-react'
import "../../index.css";

import { FeaturesSection } from '@/components/common/FeaturesSection'
import { ArchitectureSection } from '@/components/common/ArchitectureSection'
import { Footer } from '@/components/common/Footer'
import { Link } from 'react-router';
export const LandingPage: React.FC = () => {
  return (
    <nav className="bg-primary rounded-3xl gap-2">
<div className="relative min-h-125 w-full overflow-hidden rounded-lg border-t border-black">
  <div>
          <div className="flex items-center">
          <div className="relative z-10 flex h-10 w-10 rounded-xl bg-linear-to-br from-primary to-accent items-center justify-center shadow-lg shadow-amber-500/20 mt-3 ml-2">
            <Sun className="h-6 w-6 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="absolute z-10 pl-13 mt-3 text-xl font-bold tracking-tight text-accent">
            Kilo<span className="text-secondary">Wattz</span>
          </span>
          <div className='z-10 relative flex ml-30 mt-4 gap-20 sm:flex-row'>
       <Button render={<Link to="/login"/> } nativeButton={false} className="text-secondary hover:bg-accent rounded-lg p-2 pl-5">Sign in</Button>
        <Button className="text-secondcary hover:bg-accent rounded-lg p-1 pl-5">Customers</Button>
        <Button className="text-secondary border-accent hover:bg-accent rounded-lg p-1 pl-5">Get an estimate</Button>
        </div>
        </div>
      </div>
  <img
    src="/src/assets/solar.IMG.jpg"
    alt="Solar panels on a home"
    className="absolute inset-0 h-full w-full object-cover"
  />
  <div className="absolute inset-0 bg-black/50"/>
  <div className="relative z-10 flex min-h-125 flex-col justify-center p-6 md:p-12">
    <small className="text-accent tracking-widest">
      CLEAN ENERGY, MADE AT CONVENIENCE
    </small>

    <h1 className="mt-3 text-4xl font-extrabold font-serif text-white">
      Power your home.
      <span className="block font-mono text-accent">Own your future.</span>
    </h1>

    <p className="mt-4 max-w-xl text-sm text-accent">
      Premium solar, designed around your life. Cut energy costs, protect your
      home from rising rates, and control at your convenience.
    </p>
    <Button className="mt-10 w-fit rounded-lg flex items-center border-black p-1 bg-secondary text-accent">
      Explore how it works
      <ArrowRightIcon className="ml-2 h-4 w-4 text-accent"/>
    </Button>
  </div>
</div>
<div className='overflow-hidden whitespace-nowrap flex justify-around gap-10 p-2 bg-green-100'>
  <span className='flex w-max animate-marquee tracking-widest gap-3'><Zap className='text-amber-600'/> CLEAN POWER, DAY AND NIGHT</span>
  <span className='flex w-max animate-marquee tracking-widest gap-3'><Zap className='text-amber-600'/> CLEAN POWER, DAY AND NIGHT</span>
  <span className='flex w-max animate-marquee tracking-widest gap-3'><Zap className='text-amber-600'/> CLEAN POWER, DAY AND NIGHT</span>
  <span className='flex w-max animate-marquee tracking-widest gap-3'><Zap className='text-amber-600'/> CLEAN POWER, DAY AND NIGHT</span>
  <span className='flex w-max animate-marquee tracking-widest gap-3'><Zap className='text-amber-600'/> CLEAN POWER, DAY AND NIGHT</span>
    </div>
     <ArchitectureSection />
      <FeaturesSection />
      <Footer />
    </nav>
  )
}

export default LandingPage
