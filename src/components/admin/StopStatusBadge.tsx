import { cn } from '@/lib/utils'
import type { StopStatus } from '@/data/admin-types'

interface StopStatusBadgeProps {
  status: StopStatus
  className?: string
}

const statusStyles: Record<StopStatus, { bg: string; text: string; label: string }> = {
  completed: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#166534]',
    label: 'Completed',
  },
  pending: {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    label: 'Pending',
  },
  missed: {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#DC2626]',
    label: 'Missed',
  },
}

export function StopStatusBadge({ status, className }: StopStatusBadgeProps) {
  const style = statusStyles[status]

  return (
    <span
      className={cn(
        'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium',
        style.bg,
        style.text,
        className
      )}
    >
      {style.label}
    </span>
  )
}
