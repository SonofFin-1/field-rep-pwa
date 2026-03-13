import { KpiCard } from './KpiCard'
import { COLORS } from '@/lib/constants'
import { Target, Users, DollarSign } from 'lucide-react'

export function KpiRow() {
  return (
    <div className="flex gap-4">
      <KpiCard
        icon={<Target className="w-5 h-5 text-[#B45309]" />}
        iconBgColor={COLORS.kpiYellow}
        value="18"
        label="High Score Lead Visits"
      />
      <KpiCard
        icon={<Users className="w-5 h-5 text-[#7C3AED]" />}
        iconBgColor={COLORS.kpiPurple}
        value="81"
        label="Total Visits"
      />
      <KpiCard
        icon={<DollarSign className="w-5 h-5 text-[#166534]" />}
        iconBgColor={COLORS.kpiGreen}
        value={
          <>
            $16,450<span className="text-lg text-[#778188] font-normal">/24,000</span>
          </>
        }
        label="Monthly Sales Target"
      />
    </div>
  )
}
