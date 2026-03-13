import { useState } from 'react'
import { SearchBar } from '@/components/shared'
import { PlannerLeadCard } from './PlannerLeadCard'
import type { Lead } from '@/data/types'

interface PlannerLeadListProps {
  leads: Lead[]
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onViewLead: (lead: Lead) => void
}

export function PlannerLeadList({
  leads,
  selectedIds,
  onToggle,
  onViewLead,
}: PlannerLeadListProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter by search query and sort by score (highest first)
  const filteredLeads = leads
    .filter(lead =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.score - a.score)

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 h-full">
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search"
        className="mb-3"
      />

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="divide-y divide-[#DFEBF4]">
          {filteredLeads.map(lead => (
            <PlannerLeadCard
              key={lead.id}
              lead={lead}
              isSelected={selectedIds.has(lead.id)}
              onToggle={() => onToggle(lead.id)}
              onClick={() => onViewLead(lead)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
