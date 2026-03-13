import { useState, useCallback } from 'react'
import {
  Greeting,
  KpiRow,
  TodaysAppointments,
  ActivityFeed,
} from '@/components/home'
import { TerritoryMapGoogle } from '@/components/google-maps/TerritoryMapGoogle'
import { LeadDetailModal } from '@/components/leads'
import { leads } from '@/data/leads'
import type { Lead } from '@/data/types'

export function HomePage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const handleClickLead = useCallback((leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
    if (lead) {
      setSelectedLead(lead)
    }
  }, [])

  return (
    <div className="px-[80px] pt-4 pb-8">
      {/* Greeting */}
      <div className="mb-6">
        <Greeting />
      </div>

      {/* KPI Row */}
      <div className="mb-4">
        <KpiRow />
      </div>

      {/* Middle Row: Appointments + Activity */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Left column: Today's Appointments (includes Plan CTA) */}
        <TodaysAppointments />

        {/* Right column: Activity Feed */}
        <ActivityFeed onClickLead={handleClickLead} />
      </div>

      {/* Territory Map */}
      <TerritoryMapGoogle />

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  )
}
