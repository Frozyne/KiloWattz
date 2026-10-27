import { Link } from 'react-router'
import { Zap, ArrowRight } from 'lucide-react'

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800/80 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Zap className="h-6 w-6 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Kilo<span className="text-amber-400">Wattz</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#overview" className="hover:text-amber-400 transition-colors">Overview</a>
          <a href="#features" className="hover:text-amber-400 transition-colors">Grid Features</a>
          <a href="#architecture" className="hover:text-amber-400 transition-colors">Architecture</a>
          <a href="#impact" className="hover:text-amber-400 transition-colors">Impact</a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all border border-zinc-800"
          >
            Resident Portal
          </Link>
          <Link
            to="/login?role=admin"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-400 text-zinc-950 hover:bg-amber-300 transition-all shadow-md shadow-amber-400/10"
          >
            Command Center
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </nav>
  )
}