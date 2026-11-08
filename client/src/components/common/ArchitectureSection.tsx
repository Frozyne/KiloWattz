import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="py-20 px-6 bg-primary border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-xs text-secondary font-bold uppercase tracking-widest mb-3">
              Robust Microgrid Blueprint
            </h2>
            <h3 className="text-3xl font-bold text-accent mb-6">
              Designed for Reliability & Automated Emergency Safety
            </h3>

            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-secondary shrink-0 mt-1" />
                <div>
                  <h4 className="text-secondary font-semibold">Emergency Load Shedding (ELS)</h4>
                  <p className="text-accent text-sm mt-1">
                    Instant admin trigger option to shed non-essential household loads during battery reserve or grid frequency emergencies.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-secondary shrink-0 mt-1" />
                <div>
                  <h4 className="text-secondary font-semibold">Weather-Driven Yield Prediction</h4>
                  <p className="text-accent text-sm mt-1">
                    Hourly background synchronization with Open-Meteo API to calculate theoretical solar yield based on irradiance and cloud cover.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle2 className="h-6 w-6 text-secondary shrink-0 mt-1" />
                <div>
                  <h4 className="text-secondary font-semibold">Heartbeat & Hardware Diagnostics</h4>
                  <p className="text-accent text-sm mt-1">
                    Continuous background monitoring logs warnings for offline meters, thermal spikes, and inverter efficiency drops.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="rounded-2xl bg-secondary border-zinc-800 p-2">
            <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-4 space-y-0">
              <CardTitle className="text-sm font-semibold text-accent">Central System Capabilities</CardTitle>
              <span className="text-xs text-accent font-mono">24/7 Monitoring</span>
            </CardHeader>
            <CardContent className="pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-accent">Array Configuration</span>
                <span className="text-accent font-mono">450 kWp Ground Mount</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-accent">Inverter Architecture</span>
                <span className="text-accent font-mono">300 kW Modular Central</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-accent">Standard Daily Quota</span>
                <span className="text-accent font-mono">Up to 15 kWh / Household</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}