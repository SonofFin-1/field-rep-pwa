import { Card } from '@/components/shared/Card'
import type { ReactNode } from 'react'

interface KpiCardProps {
  icon: ReactNode
  iconBgColor: string
  value: ReactNode
  label: string
}

export function KpiCard({ icon, iconBgColor, value, label }: KpiCardProps) {
  return (
    <Card className="flex-1 min-w-0" padding="lg">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
        style={{ backgroundColor: iconBgColor }}
      >
        {icon}
      </div>
      <div className="text-[32px] font-semibold text-[#46494B] leading-tight">
        {value}
      </div>
      <div className="text-sm text-[#778188] mt-1">{label}</div>
    </Card>
  )
}
