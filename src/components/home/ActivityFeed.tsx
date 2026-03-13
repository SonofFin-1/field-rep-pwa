import { Link } from 'react-router-dom'
import { Card } from '@/components/shared/Card'
import { ActivityFeedItem } from './ActivityFeedItem'
import { useActivities } from '@/hooks/useActivities'
import { ChevronRight } from 'lucide-react'

interface ActivityFeedProps {
  onClickLead?: (leadId: string) => void
}

export function ActivityFeed({ onClickLead }: ActivityFeedProps) {
  const activities = useActivities(6)

  return (
    <Card padding="none" className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <Link to="/leads" className="flex items-center gap-1 cursor-pointer hover:opacity-80">
          <h2 className="text-lg font-semibold text-[#46494B]">Recent Activity</h2>
          <ChevronRight className="w-5 h-5 text-[#46494B]" />
        </Link>
      </div>

      {/* Activity list */}
      <div className="px-5 pb-5 flex-1">
        {activities.map(activity => (
          <ActivityFeedItem key={activity.id} activity={activity} onClickLead={onClickLead} />
        ))}
      </div>
    </Card>
  )
}
