import { ChevronRight } from 'lucide-react'
import { ConversionScoreTag, StatusTag } from '@/components/shared'
import type { Lead } from '@/data/types'

interface MapPopupProps {
  lead: Lead
  onViewDetails: () => void
}

export function MapPopup({ lead, onViewDetails }: MapPopupProps) {
  return (
    <div className="bg-white rounded-[14px] shadow-lg border border-[#DFEBF4] p-4 min-w-[260px]">
      {/* Header with name and chevron */}
      <button
        type="button"
        onClick={onViewDetails}
        className="flex items-center justify-between w-full group"
      >
        <span className="text-sm font-semibold text-[#46494B] group-hover:text-[#0061AA] transition-colors">
          {lead.name}
        </span>
        <ChevronRight className="w-4 h-4 text-[#778188] group-hover:text-[#0061AA] transition-colors" />
      </button>

      {/* Address */}
      <p className="text-xs text-[#778188] mt-1">
        {lead.address}, {lead.city} {lead.zip}
      </p>

      {/* Contact info */}
      <p className="text-xs text-[#778188]">
        {lead.phone} • {lead.email}
      </p>

      {/* Score and status tags */}
      <div className="flex items-center gap-2 mt-2">
        <ConversionScoreTag score={lead.score} />
        <StatusTag status={lead.status} />
      </div>

      {/* View Details button */}
      <div className="mt-4">
        <button
          type="button"
          onClick={onViewDetails}
          className="w-full px-4 py-2 bg-[#0061AA] text-white text-sm font-medium rounded-full hover:bg-[#005090] transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  )
}
