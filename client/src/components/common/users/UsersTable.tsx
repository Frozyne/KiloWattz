import React from 'react'
import { Loader2, Shield, User, ChevronRight, Home } from 'lucide-react'
import { type IUser } from '@/lib/types'
import { useAllUsersQuery } from '@/hooks/useUserQureies' 

interface UsersTableProps {
  onRowClick: (user: IUser) => void
}

export const UsersTable: React.FC<UsersTableProps> = ({ onRowClick }) => {
  const { data: users, isLoading } = useAllUsersQuery()

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center bg-secondary rounded-3xl border border-emerald-800/50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-secondary rounded-3xl border border-emerald-800/50 text-emerald-300/70 space-y-2">
        <User className="size-8 opacity-50" />
        <p className="text-sm">No users found.</p>
      </div>
    )
  }

  return (
    <div className="bg-secondary rounded-3xl border border-emerald-800/50 shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-950/40 border-b border-emerald-800/50 text-emerald-300 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">User Profile</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Assigned Properties</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-800/30">
            {users.map((user: IUser) => (
              <tr 
                key={user._id} 
                onClick={() => onRowClick(user)}
                className="hover:bg-emerald-900/20 cursor-pointer transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-900/60 text-emerald-300 font-bold border border-emerald-700/50 text-sm">
                      {user.fullName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-accent group-hover:text-emerald-300 transition-colors">
                        {user.fullName}
                      </span>
                      <span className="text-xs text-emerald-200/60">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {user.role === 'Admin' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Shield className="size-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-950 border border-emerald-800 text-emerald-400">
                        <User className="size-3" /> Resident
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-100">
                    <Home className="size-4 text-emerald-500" />
                    <span>
                      {user.households?.length || 0} Plot{(user.households?.length !== 1) && 's'}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <ChevronRight className="size-5 text-emerald-500/50 group-hover:text-emerald-400 ml-auto transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}