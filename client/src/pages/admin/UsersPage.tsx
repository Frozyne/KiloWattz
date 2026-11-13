import { useState } from 'react'
import { Users, UserPlus, ChevronLeft } from 'lucide-react'
import { UsersTable } from '@/components/common/users/UsersTable'
import { AddUserModal } from '@/components/common/users/AddUserModal'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'
import { UserWidgetSection } from '@/components/common/profile/UserWidgetSection'
import { type IUser } from '@/lib/types'
import WeatherStats from '@/components/common/WeatherStats'

export default function UsersPage() {
  const { data: user } = useCurrentUserQuery()
  const isAdmin = user?.role === 'Admin'

  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

  return (
    <div className="min-h-screen p-4 md:p-8 text-accent font-sans space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <WeatherStats />
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary p-6 rounded-3xl border border-emerald-800/50 shadow-md">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-accent flex items-center gap-2">
              <Users className="h-6 w-6 text-emerald-400" /> User Management
            </h1>
            <p className="text-sm text-emerald-100/80 mt-1">
              Manage residents, administrators, and grid access permissions.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsAddUserOpen(true)}
              className="h-10 px-4 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              <UserPlus className="size-4" /> Add User
            </button>
          )}
        </div>

        {/* View Toggling: Table vs. User Detail Widget */}
        {!selectedUser ? (
          <UsersTable 
            onRowClick={(clickedUser: IUser) => setSelectedUser(clickedUser)} 
          />
        ) : (
          <div className="space-y-4">
            <button 
              onClick={() => setSelectedUser(null)}
              className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <ChevronLeft className="size-4" /> Back to Users List
            </button>
            <UserWidgetSection user={selectedUser} />
          </div>
        )}

      </div>

      {isAddUserOpen && (
        <AddUserModal onClose={() => setIsAddUserOpen(false)} />
      )}
    </div>
  )
}