import { CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { Card } from '@/components/shared'
import type { AdminKpiSummary } from '@/data/admin-types'

interface AdminKpiRowProps {
  kpis: AdminKpiSummary
}

interface KpiCardProps {
  icon: React.ReactNode
  iconBgColor: string
  value: React.ReactNode
  label: string
}

function KpiCard({ icon, iconBgColor, value, label }: KpiCardProps) {
  return (
    <Card className="flex-1 p-4">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
        <div>
          <div className="text-2xl font-semibold text-[#46494B]">{value}</div>
          <div className="text-sm text-[#778188]">{label}</div>
        </div>
      </div>
    </Card>
  )
}

export function AdminKpiRow({ kpis }: AdminKpiRowProps) {
  return (
    <div className="flex gap-4">
      <KpiCard
        icon={<CheckCircle size={20} className="text-[#166534]" />}
        iconBgColor="#DCFCE7"
        value={
          <span>
            {kpis.completedStops}/{kpis.totalStops}{' '}
            <span className="text-sm font-normal text-[#778188]">
              ({kpis.completionRate.toFixed(0)}%)
            </span>
          </span>
        }
        label="Completed Stops"
      />
      <KpiCard
        icon={<Clock size={20} className="text-[#B45309]" />}
        iconBgColor="#FEF3C7"
        value={`${kpis.pendingStops} remaining`}
        label="Pending Stops"
      />
      <KpiCard
        icon={<TrendingUp size={20} className="text-[#7C3AED]" />}
        iconBgColor="#F3E8FF"
        value={
          <span>
            {kpis.conversionRate.toFixed(0)}%{' '}
            <span className="text-sm font-normal text-[#778188]">
              ({kpis.totalSales} sales)
            </span>
          </span>
        }
        label="Conversion Rate"
      />
    </div>
  )
}
