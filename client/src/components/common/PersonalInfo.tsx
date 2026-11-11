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
  Key
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

  // Use targetUser if passed as prop, otherwise fallback to standard query
  const user = targetUser || currentUser
  const isAdmin = currentUser?.role === 'Admin'

  const [isEditing, setIsEditing] = useState(false)
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
    <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b">
        <strong className="text-lg flex items-center gap-2 text-slate-800">
          <IdCard className="size-5 text-emerald-600" /> Personal Information
        </strong>

        {isAdmin && (
          !isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-xs font-semibold"
            >
              <Pencil className="size-3.5" /> Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsEditing(false)}
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-xs"
              >
                <X className="size-3.5" /> Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateUserMutation.isPending}
                size="sm"
                className="flex items-center gap-1 bg-emerald-700 text-white hover:bg-emerald-800 text-xs"
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
      <div className="space-y-1 border-b pb-3">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
          <UserIcon className="size-4" /> Full Name
        </span>
        {isEditing ? (
          <input
            type="text"
            value={draft.fullName}
            onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
            className="w-full rounded border px-2 py-1 text-sm font-medium"
          />
        ) : (
          <p className="text-base font-medium text-slate-800">{user?.fullName}</p>
        )}
      </div>

      {/* Email Address */}
      <div className="space-y-1 border-b pb-3">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
          <Mail className="size-4" /> Email Address
        </span>
        {isEditing ? (
          <input
            type="email"
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
            className="w-full rounded border px-2 py-1 text-sm font-medium"
          />
        ) : (
          <p className="text-base font-medium text-slate-800">{user?.email}</p>
        )}
      </div>

      {isEditing ? (
            <div className="space-y-1 border-b pb-3">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                    <Key className="size-4" /> Password
                </span>
                <input
                type="text"
                value={draft.password}
                onChange={(e) => setDraft({ ...draft, password: e.target.value })}
                className="w-full rounded border px-2 py-1 text-sm font-medium"
                />
            </div>
        ) : (
            <p className="text-base font-medium text-slate-800">{user?.fullName}</p>
        )}

      {/* System Role */}
      <div className="space-y-1 border-b pb-3">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
          <Shield className="size-4" /> Access Role
        </span>
        {isEditing ? (
          <Select
            value={draft.role}
            onValueChange={(val: 'Admin' | 'User' | null) => setDraft({ ...draft, role: val })}
          >
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <SelectItem value="Admin">Administrator</SelectItem>
                <SelectItem value="User">Resident</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
            {user?.role}
          </span>
        )}
      </div>

      {/* Households Selector */}
      <div className="space-y-2 pt-1">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
          <Home className="size-4" /> Associated Households ({user?.households?.length ?? 0})
        </span>

        <div className="space-y-2">
          {user?.households && user.households.length > 0 ? (
            user.households.map((hh) => {
              const isSelected = selectedHouseholdId === hh._id
              return (
                <div
                  key={hh._id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm font-medium text-slate-700">
                    Plot {hh.plotNumber}, {hh.street}
                  </span>
                  <Button
                    size="sm"
                    variant={isSelected ? 'default' : 'outline'}
                    onClick={() => onSelectHousehold && onSelectHousehold(hh._id)}
                    className={`text-xs h-7 ${
                      isSelected ? 'bg-emerald-700 text-white hover:bg-emerald-800' : ''
                    }`}
                  >
                    {isSelected ? 'Viewing' : 'Select'}
                  </Button>
                </div>
              )
            })
          ) : (
            <p className="text-xs text-slate-400 italic">No households assigned.</p>
          )}
        </div>
      </div>
    </div>
  )
}