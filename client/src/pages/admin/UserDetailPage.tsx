import { useParams, useNavigate } from 'react-router'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { useUserByIdQuery } from '@/hooks/useUserQureies'
import { UserWidgetSection } from '@/components/common/profile/UserWidgetSection'

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { data: targetUser, isLoading } = useUserByIdQuery(userId || '')

  console.log('UserDetailPage mounted:', { userId, targetUser, isLoading })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (!targetUser) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-emerald-200/70">User not found.</p>
        <button
          onClick={() => navigate('/users')}
          className="text-sm text-emerald-400 hover:underline"
        >
          Back to Users List
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 text-accent font-sans">
      <div className="max-w-7xl mx-auto space-y-4">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
        >
          <ChevronLeft className="size-4" /> Back to Users List
        </button>

        <UserWidgetSection
          user={targetUser}
          onDeleted={() => navigate('/users')}
        />
      </div>
    </div>
  )
}