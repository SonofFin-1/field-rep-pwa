import type { Activity } from '@/data/types'
import { Home, FileText, UserPlus, Route, Phone } from 'lucide-react'

interface ActivityFeedItemProps {
  activity: Activity
  onClickLead?: (leadId: string) => void
}

function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'visit':
      return <Home className="w-4 h-4 text-[#778188]" />
    case 'notes':
      return <FileText className="w-4 h-4 text-[#778188]" />
    case 'lead_assigned':
      return <UserPlus className="w-4 h-4 text-[#778188]" />
    case 'plan_completed':
      return <Route className="w-4 h-4 text-[#778188]" />
    case 'call':
      return <Phone className="w-4 h-4 text-[#778188]" />
    default:
      return <FileText className="w-4 h-4 text-[#778188]" />
  }
}

export function ActivityFeedItem({ activity, onClickLead }: ActivityFeedItemProps) {
  const { type, description, linkedName, leadId } = activity

  const handleNameClick = () => {
    if (leadId && onClickLead) {
      onClickLead(leadId)
    }
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#DFEBF4] last:border-b-0">
      <div className="flex-shrink-0">{getActivityIcon(type)}</div>
      <div className="flex-1 text-sm text-[#46494B]">
        {description}{' '}
        {linkedName && (
          <span
            onClick={leadId ? handleNameClick : undefined}
            className={`text-[#0061AA] font-medium ${leadId ? 'cursor-pointer hover:underline' : ''}`}
          >
            {linkedName}
          </span>
        )}
      </div>
    </div>
  )
}
