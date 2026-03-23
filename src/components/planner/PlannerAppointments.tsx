import { PlannerAppointmentCard } from './PlannerAppointmentCard'
import type { Appointment } from '@/data/types'

interface PlannerAppointmentsProps {
  appointments: Appointment[]
  onViewLead: (appointment: Appointment) => void
}

export function PlannerAppointments({
  appointments,
  onViewLead,
}: PlannerAppointmentsProps) {
  return (
    <div className="px-4 h-full overflow-y-auto">
      <div className="divide-y divide-[#DFEBF4] pb-4">
        {appointments.map(appointment => (
          <PlannerAppointmentCard
            key={appointment.id}
            appointment={appointment}
            onClick={() => onViewLead(appointment)}
          />
        ))}
      </div>
    </div>
  )
}
