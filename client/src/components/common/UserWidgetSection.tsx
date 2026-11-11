import React, { useState, useEffect } from 'react'
import { PersonalInfo } from '../../components/common/PersonalInfo'
import { HouseholdInfo } from '../../components/common/HouuseholdInfo'
import { type IUser } from '@/lib/types'

interface UserWidgetSectionProps {
  user?: IUser // Optional user for Admin views
}

export const UserWidgetSection: React.FC<UserWidgetSectionProps> = ({ user }) => {
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | undefined>()

  // Set default selected household when user loads
  useEffect(() => {
    if (user?.households && user.households.length > 0) {
      setSelectedHouseholdId(user.households[0]._id)
    }
  }, [user])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <PersonalInfo
        targetUser={user}
        selectedHouseholdId={selectedHouseholdId}
        onSelectHousehold={(id) => setSelectedHouseholdId(id)}
      />
      <HouseholdInfo householdId={selectedHouseholdId} />
    </div>
  )
}