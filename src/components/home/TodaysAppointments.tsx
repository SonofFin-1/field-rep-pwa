import { Link } from 'react-router-dom'
import { Card } from '@/components/shared/Card'
import { AppointmentCard } from './AppointmentCard'
import { PlanYourDayCta } from './PlanYourDayCta'
import { useAppointments } from '@/hooks/useAppointments'
import { ChevronRight } from 'lucide-react'

export function TodaysAppointments() {
  const appointments = useAppointments()

  return (
    <Card padding="none" className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <Link to="/calendar" className="flex items-center gap-1 cursor-pointer hover:opacity-80">
          <h2 className="text-lg font-semibold text-[#46494B]">
            Today's Appointments
          </h2>
          <ChevronRight className="w-5 h-5 text-[#46494B]" />
        </Link>
      </div>

      {/* Appointments list */}
      <div className="px-5">
        {appointments.map(appointment => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>

      {/* Plan your day button */}
      <div className="px-5 pb-5 pt-4">
        <PlanYourDayCta />
      </div>
    </Card>
  )
}
