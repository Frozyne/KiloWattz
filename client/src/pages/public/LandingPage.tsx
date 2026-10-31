import React from 'react'
import NavBar from '@/components/admin/NavBar'
import { HeroSection } from '@/components/common/HeroSection'
import { StatsOverview } from '@/components/common/StatsOverview'
import { FeaturesSection } from '@/components/common/FeaturesSection'
import { ArchitectureSection } from '@/components/common/ArchitectureSection'
import { Footer } from '@/components/common/Footer'

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950">
      <NavBar />
      <HeroSection />
      <StatsOverview />
      <FeaturesSection />
      <ArchitectureSection />
      <Footer />
    </div>
  )
}

export default LandingPage