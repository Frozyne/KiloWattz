import React from 'react'
import { Zap } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-zinc-800 bg-zinc-950 text-zinc-500 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Zap className="h-4 w-4" />
          </div>
          <span className="text-white font-semibold text-base">KiloWattz</span>
        </div>
        <div className="text-center sm:text-right">
          <p>&copy; {new Date().getFullYear()} KiloWattz Microgrid Management. All rights reserved.</p>
          <p className="text-xs text-zinc-600 mt-1">Ibadan, Nigeria Estate Microgrid System Blueprint.</p>
        </div>
      </div>
    </footer>
  )
}