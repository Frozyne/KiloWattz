import React, { useState, useEffect } from 'react'
import { 
  User as UserIcon, 
  Pencil, 
  Check, 
  Mail, 
  Shield, 
  X, 
  IdCard, 
  Home, 
  Loader2, 
  Key,
  Plus
} from 'lucide-react'
import { useCurrentUserQuery, useUpdateUserMutation } from '@/hooks/useUserQureies'
import { type IUser } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RegisterHouseholdModal } from '../users/RegisterHouseholdModal'

interface PersonalInfoProps {
  targetUser?: IUser
  selectedHouseholdId?: string
  onSelectHousehold?: (id: string) => void
}

export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  targetUser,
  selectedHouseholdId,
  onSelectHousehold,
}) => {
  const { data: currentUser } = useCurrentUserQuery()
  const updateUserMutation = useUpdateUserMutation()

  const user = targetUser || currentUser
  const isAdmin = currentUser?.role === 'Admin'

  const [isEditing, setIsEditing] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  
  const [draft, setDraft] = useState({
    fullName: '',
    email: '',
    role: 'User' as 'Admin' | 'User' | null,
    password: ''
  })

  useEffect(() => {
    if (user) {
      setDraft({
        fullName: user.fullName || '',
        email: user.email || '',
        role: user.role || 'User',
        password: user.password || ''
      })
    }
  }, [user])

  const handleSave = async () => {
    if (!user?._id) return
    await updateUserMutation.mutateAsync({
      id: user._id,
      user: draft,
    })
    setIsEditing(false)
  }

  return (
    <div className="border border-emerald-800/50 rounded-2xl p-5 bg-secondary shadow-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-800/50">
        <strong className="text-lg flex items-center gap-2 text-accent">
          <IdCard className="size-5 text-emerald-400" /> Personal Information
        </strong>

        {isAdmin && (
          !isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-xs font-semibold border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/40"
            >
              <Pencil className="size-3.5" /> Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsEditing(false)}
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-xs text-emerald-400 hover:bg-emerald-900/40"
              >
                <X className="size-3.5" /> Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateUserMutation.isPending}
                size="sm"
                className="flex items-center gap-1 bg-emerald-600 text-white hover:bg-emerald-500 text-xs"
              >
                {updateUserMutation.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Check className="size-3.5" />
                )}
                Save
              </Button>
            </div>
          )
        )}
      </div>

      {/* Full Name */}
      <div className="space-y-1 border-b border-emerald-800/50 pb-3">
        <span className="text-xs font-semibold text-emerald-300/80 flex items-center gap-2">
          <UserIcon className="size-4" /> Full Name
        </span>
        {isEditing ? (
          <input
            type="text"
            value={draft.fullName}
            onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
            className="w-full rounded-xl border border-emerald-800/60 bg-emerald-950/40 px-3 py-1.5 text-sm font-medium text-emerald-100 focus:border-emerald-400 outline-none"
          />
        ) : (
          <p className="text-base font-medium text-emerald-100">{user?.fullName}</p>
        )}
      </div>

      {/* Email Address */}
      <div className="space-y-1 border-b border-emerald-800/50 pb-3">
        <span className="text-xs font-semibold text-emerald-300/80 flex items-center gap-2">
          <Mail className="size-4" /> Email Address
        </span>
        {isEditing ? (
          <input
            type="email"
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            className="w-full rounded-xl border border-emerald-800/60 bg-emerald-950/40 px-3 py-1.5 text-sm font-medium text-emerald-100 focus:border-emerald-400 outline-none"
          />
        ) : (
          <p className="text-base font-medium text-emerald-100">{user?.email}</p>
        )}
      </div>

      {/* Password (Only show field if editing) */}
      {isEditing && (
        <div className="space-y-1 border-b border-emerald-800/50 pb-3">
          <span className="text-xs font-semibold text-emerald-300/80 flex items-center gap-2">
            <Key className="size-4" /> Reset Password
          </span>
          <input
            type="text"
            placeholder="Enter new password (optional)"
            value={draft.password}
            onChange={(e) => setDraft({ ...draft, password: e.target.value })}
            className="w-full rounded-xl border border-emerald-800/60 bg-emerald-950/40 px-3 py-1.5 text-sm font-medium text-emerald-100 focus:border-emerald-400 outline-none"
          />
        </div>
      )}

      {/* System Role */}
      <div className="space-y-1 border-b border-emerald-800/50 pb-3">
        <span className="text-xs font-semibold text-emerald-300/80 flex items-center gap-2">
          <Shield className="size-4" /> Access Role
        </span>
        {isEditing ? (
          <Select
            value={draft.role || 'User'}
            onValueChange={(val: 'Admin' | 'User' | null) => setDraft({ ...draft, role: val })}
          >
            <SelectTrigger className="w-40 h-8 text-xs bg-emerald-950/40 border-emerald-800/60 text-emerald-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-secondary border-emerald-800 text-emerald-100">
              <SelectGroup>
                <SelectLabel className="text-emerald-400/80 text-xs">Roles</SelectLabel>
                <SelectItem value="Admin">Administrator</SelectItem>
                <SelectItem value="User">Resident</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${user?.role === 'Admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-950 border border-emerald-800 text-emerald-400'}`}>
            {user?.role}
          </span>
        )}
      </div>

      {/* Households Selector */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-300/80 flex items-center gap-2">
            <Home className="size-4" /> Associated Households ({user?.households?.length ?? 0})
          </span>
          
          {/* Admin Assign Button */}
          {isAdmin && (
            <button 
              onClick={() => setIsAssignModalOpen(true)}
              className="px-2 py-1 flex items-center gap-1 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-800/40 rounded-lg text-emerald-400 transition-colors"
              title="Register New Property"
            >
              <Plus className="size-3" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Assign</span>
            </button>
          )}
        </div>

        <div className="space-y-2">
          {user?.households && user.households.length > 0 ? (
            user.households.map((hh) => {
              const isSelected = selectedHouseholdId === hh._id
              return (
                <div
                  key={hh._id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/60'
                      : 'border-emerald-800/40 bg-emerald-950/20 hover:border-emerald-700/60'
                  }`}
                >
                  <span className="text-sm font-medium text-emerald-100">
                    Plot {hh.plotNumber}, {hh.street}
                  </span>
                  <Button
                    size="sm"
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => onSelectHousehold && onSelectHousehold(hh._id)}
                    className={`text-xs h-7 rounded-lg ${
                      isSelected 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500 border-none' 
                        : 'border-emerald-700/50 text-emerald-300 hover:bg-emerald-800/40'
                    }`}
                  >
                    {isSelected ? 'Viewing' : 'Select'}
                  </Button>
                </div>
              )
            })
          ) : (
            <p className="text-xs text-emerald-300/60 italic p-3 text-center bg-emerald-950/20 rounded-xl border border-emerald-900/40">
              No households assigned.
            </p>
          )}
        </div>
      </div>

      {/* The isolated assign modal */}
      {isAssignModalOpen && user?._id && (
        < RegisterHouseholdModal 
          targetUserId={user._id} 
          onClose={() => setIsAssignModalOpen(false)} 
        />
      )}
    </div>
  )
}