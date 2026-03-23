import { PlannerAppointments } from './PlannerAppointments'
import { PlannerLeadList } from './PlannerLeadList'
import { cn } from '@/lib/utils'
import type { Appointment, Lead } from '@/data/types'

export type SidebarTab = 'appointments' | 'leads'

interface PlannerSidebarProps {
  appointments: Appointment[]
  leads: Lead[]
  onViewAppointment: (appointment: Appointment) => void
  onViewLead: (lead: Lead) => void
  activeTab: SidebarTab
  onTabChange: (tab: SidebarTab) => void
  totalLeadCount: number
  onAddLead?: () => void
}

export function PlannerSidebar({
  appointments,
  leads,
  onViewAppointment,
  onViewLead,
  activeTab,
  onTabChange,
  totalLeadCount,
  onAddLead,
}: PlannerSidebarProps) {

  return (
    <div className="w-[374px] h-full flex flex-col bg-white border-r border-[#DFEBF4]">
      {/* Tab Header */}
      <div className="flex items-center gap-1 px-4 pt-4 pb-2 border-b border-[#DFEBF4]">
        <button
          type="button"
          onClick={() => onTabChange('appointments')}
          className={cn(
            'px-3 py-1.5 text-sm font-semibold rounded-full transition-colors',
            activeTab === 'appointments'
              ? 'bg-[#0061AA] text-white'
              : 'text-[#778188] hover:bg-[#F0F5F7]'
          )}
        >
          Appointments ({appointments.length})
        </button>
        <button
          type="button"
          onClick={() => onTabChange('leads')}
          className={cn(
            'px-3 py-1.5 text-sm font-semibold rounded-full transition-colors',
            activeTab === 'leads'
              ? 'bg-[#0061AA] text-white'
              : 'text-[#778188] hover:bg-[#F0F5F7]'
          )}
        >
          Leads ({leads.length}/{totalLeadCount})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 pt-2 pb-[88px]">
        {activeTab === 'appointments' ? (
          <PlannerAppointments
            appointments={appointments}
            onViewLead={onViewAppointment}
          />
        ) : (
          <PlannerLeadList
            leads={leads}
            onViewLead={onViewLead}
            onAddLead={onAddLead}
          />
        )}
      </div>
    </div>
  )
}
