import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ConversionScoreTag, StatusTag } from '@/components/shared'
import type { Lead } from '@/data/types'

interface PlannerLeadCardProps {
  lead: Lead
  isSelected: boolean
  onToggle: () => void
  onClick?: () => void
}

export function PlannerLeadCard({
  lead,
  isSelected,
  onToggle,
  onClick,
}: PlannerLeadCardProps) {
  return (
    <div
      className="flex items-start gap-3 py-3 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
      onClick={onClick}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={e => {
          e.stopPropagation()
          onToggle()
        }}
        className={cn(
          'flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors',
          isSelected
            ? 'bg-[#0061AA] border-[#0061AA]'
            : 'bg-white border-[#DFEBF4]'
        )}
      >
        {isSelected && (
          <svg
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4L4.5 7.5L11 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

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
