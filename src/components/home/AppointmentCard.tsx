import { ConversionScoreTag } from '@/components/shared/ConversionScoreTag'
import { StatusTag } from '@/components/shared/StatusTag'
import { ContactActions } from '@/components/shared/ContactActions'
import type { Appointment } from '@/data/types'

interface AppointmentCardProps {
  appointment: Appointment
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const { lead, time, type, notes } = appointment

  return (
    <div className="flex items-start gap-4 py-4 border-b border-[#DFEBF4] last:border-b-0">
      {/* Time badge */}
      <div className="text-sm font-semibold text-[#0061AA] w-[70px] flex-shrink-0 pt-0.5">
        {time}
      </div>

      {/* Appointment details */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[#46494B] text-[15px]">{type}</div>
        <div className="text-sm text-[#778188] mt-0.5">{lead.name}</div>
        <div className="text-sm text-[#778188]">
          {lead.address}, {lead.city}
        </div>
        <div className="text-sm text-[#778188] italic">{notes}</div>

        {/* Tags row */}
        <div className="flex items-center gap-2 mt-2">
          <ConversionScoreTag score={lead.score} />
          <StatusTag status={lead.status} />
        </div>
      </div>

      {/* Contact actions */}
      <ContactActions
        phone={lead.phone}
        email={lead.email}
        showEmail={type === 'Home Assessment'}
        className="flex-shrink-0"
      />
    </div>
  )
}
