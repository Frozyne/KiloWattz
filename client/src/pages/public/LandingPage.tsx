import React from 'react'
import NavBar from '@/components/admin/NavBar'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, Sun } from 'lucide-react'
import "../../index.css";
import { StatsOverview } from '@/components/common/StatsOverview'
import { FeaturesSection } from '@/components/common/FeaturesSection'
import { ArchitectureSection } from '@/components/common/ArchitectureSection'
import { Footer } from '@/components/common/Footer'

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary text-black font-sans selection:bg-amber-500 selection:text-zinc-950">
      <NavBar />
      <div className='flex justify-between items-center'>
        <span>
        <small className='title -translate-y-10 ml-6'>CLEAN ENERGY, MADE AT CONVIENCE</small>
        <p className='text-4xl text-black font-extrabold font-serif'>Power your home.</p><span className='text-4xl text-green-900 font-mono'> Own your future.</span>
       <p className='mt-4 text-gray-500'><small>Premium solar, designed around your life. Cut energy costs, protect your home from rising rates, and control at your convenience.</small></p> 
        <Button className="bg-amber-900 rounded-lg text-black mt-5">Explore how it works<ArrowRightIcon className='border bg-black text-white'/></Button>
        </span>
      <div className='relative w-300 h-50px'>
      <img src='/src/assets/solar.IMG.jpg'/>
      <h2 className='absolute items-center -translate-y-100 p-2 left-110 border-4 ml-40 bg-amber-900 rounded-4xl'><Sun className=''/>Built for brighter days</h2>
      </div>
      </div>
      <StatsOverview />
      <FeaturesSection />
      <ArchitectureSection />
      <Footer />
    </div>
  )
}

export default LandingPage