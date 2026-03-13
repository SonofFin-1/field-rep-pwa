import { PlannerAppointmentCard } from './PlannerAppointmentCard'
import type { Appointment } from '@/data/types'

interface PlannerAppointmentsProps {
  appointments: Appointment[]
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onViewLead: (appointment: Appointment) => void
}

export function PlannerAppointments({
  appointments,
  selectedIds,
  onToggle,
  onViewLead,
}: PlannerAppointmentsProps) {
  return (
    <div className="px-4 h-full overflow-y-auto">
      <div className="divide-y divide-[#DFEBF4]">
        {appointments.map(appointment => (
          <PlannerAppointmentCard
            key={appointment.id}
            appointment={appointment}
            isSelected={selectedIds.has(appointment.id)}
            onToggle={() => onToggle(appointment.id)}
            onClick={() => onViewLead(appointment)}
          />
        ))}
      </div>
    </div>
  )
}
