import { useState } from 'react'
import { Plus } from 'lucide-react'
import { SearchBar } from '@/components/shared'
import { PlannerLeadCard } from './PlannerLeadCard'
import type { Lead } from '@/data/types'

interface PlannerLeadListProps {
  leads: Lead[]
  onViewLead: (lead: Lead) => void
  onAddLead?: () => void
}

export function PlannerLeadList({
  leads,
  onViewLead,
  onAddLead,
}: PlannerLeadListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter by search query and sort by score (highest first, null scores last)
  const filteredLeads = leads
    .filter(lead =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1))

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 h-full">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search"
        className="mb-3"
      />

      {/* Add Lead button */}
      {onAddLead && (
        <button
          type="button"
          onClick={onAddLead}
          className="flex items-center justify-center gap-2 w-full py-2.5 mb-3 border-2 border-dashed border-[#DFEBF4] rounded-lg text-sm font-medium text-[#0061AA] hover:bg-[#F0F5F7] hover:border-[#0061AA] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Lead
        </button>
      )}

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="divide-y divide-[#DFEBF4] pb-4">
          {filteredLeads.map(lead => (
            <PlannerLeadCard
              key={lead.id}
              lead={lead}
              onClick={() => onViewLead(lead)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
