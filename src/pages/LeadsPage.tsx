import { useState } from 'react'
import { useLeads } from '@/hooks/useLeads'
import {
  LeadsToolbar,
  LeadsTable,
  LeadDetailModal,
  LeadsFilterModal,
} from '@/components/leads'
import type { Lead } from '@/data/types'
import type { LeadsFilters } from '@/components/leads/LeadsFilterModal'

export function LeadsPage() {
  const {
    leads,
    sortBy,
    sortDir,
    search,
    setSearch,
    toggleSort,
    filters,
    setFilters,
    activeFilterCount,
  } = useLeads()
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showFilterModal, setShowFilterModal] = useState(false)

  const handleApplyFilters = (newFilters: LeadsFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="px-[80px] pt-4 pb-8">
      <h1 className="text-2xl font-semibold text-[#46494B] mb-6">Leads</h1>

      <LeadsToolbar
        search={search}
        onSearchChange={setSearch}
        onFilterClick={() => setShowFilterModal(true)}
        activeFilterCount={activeFilterCount}
      />

      <LeadsTable
        leads={leads}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={toggleSort}
        onClickLead={setSelectedLead}
      />

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

      <LeadsFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApply={handleApplyFilters}
      />
    </div>
  )
}
