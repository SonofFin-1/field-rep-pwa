import { MapPin, Mail } from 'lucide-react'
import { StatusTag, ConversionScoreTag } from '@/components/shared'
import { formatCurrency } from '@/lib/utils'
import type { Lead } from '@/data/types'

interface LeadsTableRowProps {
  lead: Lead
  onClickName?: (lead: Lead) => void
}

export function LeadsTableRow({ lead, onClickName }: LeadsTableRowProps) {
  return (
    <div
      onClick={() => onClickName?.(lead)}
      className="flex items-center py-4 border-b border-[#DFEBF4] last:border-b-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
    >
      {/* Name Column */}
      <div className="w-[240px] pl-4">
        <div className="text-sm font-medium text-[#46494B]">{lead.name}</div>
        <div className="text-xs text-[#0061AA]">{lead.email}</div>
      </div>

      {/* Score Column */}
      <div className="w-[100px]">
        <ConversionScoreTag score={lead.score} />
      </div>

      {/* Location Column */}
      <div className="w-[200px]">
        <div className="flex items-center gap-1 text-sm text-[#46494B]">
          <MapPin className="w-3.5 h-3.5 text-[#778188]" />
          <span>{lead.city}, {lead.state}</span>
        </div>
        <div className="text-xs text-[#778188] pl-[18px]">{lead.address}</div>
      </div>

      {/* Value Column */}
      <div className="w-[100px] text-sm text-[#46494B]">
        {formatCurrency(lead.value)}
      </div>

      {/* Status Column */}
      <div className="w-[120px]">
        <StatusTag status={lead.status} />
      </div>

      {/* Contact Column */}
      <div className="w-[140px] pr-4" onClick={e => e.stopPropagation()}>
        <a
          href={`mailto:${lead.email}`}
          className="p-2 rounded-full hover:bg-[#F0F5F7] transition-colors inline-flex"
          aria-label="Email"
        >
          <Mail className="w-4 h-4 text-[#778188]" />
        </a>
      </div>
    </div>
  )
}
