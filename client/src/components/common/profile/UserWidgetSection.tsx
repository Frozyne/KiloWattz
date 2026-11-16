import React, { useState, useEffect } from 'react'
import { PersonalInfo } from '../../common/profile/PersonalInfo'
import { HouseholdInfo } from '../../common/profile/HouuseholdInfo'
import { type IUser } from '@/lib/types'

interface UserWidgetSectionProps {
  user?: IUser
  onDeleted?: () => void
}

export const UserWidgetSection: React.FC<UserWidgetSectionProps> = ({ user, onDeleted }) => {
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | undefined>()

  useEffect(() => {
    if (user?.households && user.households.length > 0) {
      const stillExists = user.households.some((hh) => hh._id === selectedHouseholdId)
      if (!stillExists) {
        setSelectedHouseholdId(user.households[0]._id)
      }
    } else {
      setSelectedHouseholdId(undefined)
    }
  }, [user, selectedHouseholdId])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <PersonalInfo
        targetUser={user}
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