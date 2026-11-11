import { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { User, ChevronDown, LogOut, ShieldCheck, Home } from 'lucide-react'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'
import { useAuthStore } from '@/storage/useAuthStorage'
import { useNavigate } from 'react-router'

const UserStats = () => {
    const [open, setOpen] = useState(false)
    const { data: user } = useCurrentUserQuery()
    const logout = useAuthStore((state) => state.logout)
    const navigate = useNavigate()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Primary household associated with the account
    const primaryHousehold = user?.households?.[0]

    // User initials generator for avatar badge
    const initials = user?.fullName
        ? user.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
        : 'U'

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Header Trigger Button */}
            <Button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 px-4 py-6 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-accent transition-all"
            >
                {/* User Avatar / Initials */}
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800/60 text-emerald-100 font-bold border border-emerald-600/40 text-sm">
                    {initials}
                </div>

                {/* Identity & Role */}
                <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-semibold text-accent">{user?.fullName || 'User'}</span>
                    <small className="text-xs text-emerald-200/80 capitalize flex items-center gap-1">
                        {user?.role === 'Admin' && <ShieldCheck className="size-3 text-emerald-300" />}
                        {user?.role || 'Resident'}
                    </small>
                </div>

                <ChevronDown
                    className={`size-4 text-emerald-300 transition-transform duration-200 ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </Button>

            {/* Dropdown Card */}
            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-emerald-800/80 bg-secondary p-4 shadow-2xl backdrop-blur-md text-emerald-100 space-y-4">
                    {/* User Header */}
                    <div className="border-b border-emerald-800/60 pb-3">
                        <p className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wider">Signed in as</p>
                        <p className="font-medium text-accent text-sm truncate">{user?.email}</p>
                    </div>

                    {/* Quick Telemetry Snapshot */}
                    {primaryHousehold ? (
                        <div className="space-y-2 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/60">
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="flex items-center gap-1 text-emerald-100">
                                    <Home className="size-3.5 text-emerald-300" /> Plot {primaryHousehold.plotNumber}
                                </span>
                                <span className="text-emerald-300 font-mono text-[10px] uppercase bg-emerald-900/60 px-1.5 py-0.5 rounded border border-emerald-700/50">
                                    {primaryHousehold.connectionStatus || 'Active'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                                <div>
                                    <span className="text-emerald-300/70 block text-[11px]">Today's Usage</span>
                                    <span className="font-mono text-accent font-semibold">
                                        {primaryHousehold.consumedKWh ?? 0} kWh
                                    </span>
                                </div>
                                <div>
                                    <span className="text-emerald-300/70 block text-[11px]">Daily Quota</span>
                                    <span className="font-mono text-accent font-semibold">
                                        {primaryHousehold.dailyKWHQuota ?? 250} kWh
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-3 text-xs text-emerald-300/70 bg-emerald-950/40 rounded-xl text-center italic border border-emerald-800/40">
                            No active household assigned
                        </div>
                    )}

                    {/* Actions Menu */}
                    <div className="space-y-1 pt-1 border-t border-emerald-800/60">
                        <button
                            onClick={async () => {
                                setOpen(false)
                                await navigate('/dashboard/profile')
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-emerald-100 hover:text-white hover:bg-emerald-800/50 rounded-lg transition-colors"
                        >
                            <User className="size-4 text-emerald-300" /> Profile & Settings
                        </button>

                        <button
                            onClick={async () => {
                                setOpen(false)
                                logout()
                                await navigate('/login')
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-950/40 rounded-lg transition-colors"
                        >
                            <LogOut className="size-4 text-red-400" /> Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserStats