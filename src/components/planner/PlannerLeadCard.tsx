import { ChevronRight } from 'lucide-react'
import { ConversionScoreTag, StatusTag } from '@/components/shared'
import type { Lead } from '@/data/types'

interface PlannerLeadCardProps {
  lead: Lead
  onClick?: () => void
}

export function PlannerLeadCard({
  lead,
  onClick,
}: PlannerLeadCardProps) {
  return (
    <div
      className="flex items-start gap-3 py-3 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
      onClick={onClick}
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#46494B]">{lead.name}</p>
            <p className="text-xs text-[#778188] mt-0.5">
              {lead.address}, {lead.city}
            </p>
            <p className="text-xs text-[#778188]">
              {lead.phone} • {lead.email}
            </p>
            {lead.notes && (
              <p className="text-xs text-[#778188] italic mt-1">{lead.notes}</p>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-[#778188] flex-shrink-0 mt-1" />
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-2">
          <ConversionScoreTag score={lead.score} />
          <StatusTag status={lead.status} />
        </div>
      </div>
    </div>
  )
}
