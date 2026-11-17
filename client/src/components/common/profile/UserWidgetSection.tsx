import React, { useState, useEffect } from 'react'
import { PersonalInfo } from '../../common/profile/PersonalInfo'
import { HouseholdInfo } from '../../common/profile/HouuseholdInfo'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'
import { type IUser } from '@/lib/types'

interface UserWidgetSectionProps {
  user?: IUser
  onDeleted?: () => void
}

export const UserWidgetSection: React.FC<UserWidgetSectionProps> = ({ user, onDeleted }) => {
  const { data: currentUser } = useCurrentUserQuery()
  const activeUser = user || currentUser
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | undefined>()

  useEffect(() => {
    if (activeUser?.households && activeUser.households.length > 0) {
      const stillExists = activeUser.households.some((hh) => hh._id === selectedHouseholdId)
      if (!stillExists) {
        setSelectedHouseholdId(activeUser.households[0]._id)
      }
    } else {
      setSelectedHouseholdId(undefined)
    }
  }, [activeUser, selectedHouseholdId])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <PersonalInfo
        targetUser={activeUser}
        selectedHouseholdId={selectedHouseholdId}
        onSelectHousehold={(id) => setSelectedHouseholdId(id)}
        onDeleted={onDeleted}
      />
      <HouseholdInfo
        householdId={selectedHouseholdId}
        onDeleted={() => setSelectedHouseholdId(undefined)}
      />
    </div>
  )
}