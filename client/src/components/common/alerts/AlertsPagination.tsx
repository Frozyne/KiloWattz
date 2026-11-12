import React from 'react'
import { Button } from '@/components/ui/button'

interface AlertsPaginationProps {
  currentPage: number
  totalPages: number
  totalAlerts: number
  pageSize: number
  visibleCount: number
  onPageChange: (page: number) => void
}

export const AlertsPagination: React.FC<AlertsPaginationProps> = ({
  currentPage,
  totalPages,
  totalAlerts,
  pageSize,
  visibleCount,
  onPageChange,
}) => {
  const start = totalAlerts === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = totalAlerts === 0 ? 0 : start + visibleCount - 1

  return (
    <div className="flex items-center justify-between bg-white border border-primary/20 px-4 py-2.5 rounded-2xl text-primary">
      <small>
        Showing {start}–{end} of {totalAlerts} alerts
      </small>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-primary border-primary/25 rounded-xl text-xs"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-primary border-primary/25 rounded-xl text-xs"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}