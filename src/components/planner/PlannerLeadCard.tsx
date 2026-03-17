import { ChevronRight, Calendar } from 'lucide-react'
import { ConversionScoreTag, StatusTag } from '@/components/shared'
import type { Lead } from '@/data/types'

interface PlannerLeadCardProps {
  lead: Lead
  onClick?: () => void
  onScheduleLead?: (lead: Lead) => void
  isScheduled?: boolean
}

export function PlannerLeadCard({
  lead,
  onClick,
  onScheduleLead,
  isScheduled,
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

        {/* Tags and Schedule Button */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex items-center gap-2">
            <ConversionScoreTag score={lead.score} />
            <StatusTag status={lead.status} />
          </div>

          {!isScheduled && onScheduleLead && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                onScheduleLead(lead)
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0061AA] bg-[#F0F5F7] rounded-full hover:bg-[#DFEBF4] transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              Schedule
            </button>
          )}

          {isScheduled && (
            <span className="text-xs text-[#778188] italic">Scheduled</span>
          )}
        </div>
      </div>
    </div>
  )
}
