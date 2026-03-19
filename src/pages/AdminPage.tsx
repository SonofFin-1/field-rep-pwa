import { useState } from 'react'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import {
  AdminKpiRow,
  AdminToolbar,
  StopsTable,
  StopDetailModal,
} from '@/components/admin'
import type { AdminStopRecord } from '@/data/admin-types'

export function AdminPage() {
  const {
    stops,
    kpis,
    fieldReps,
    filters,
    setDateRange,
    setRepFilter,
    sortBy,
    sortDir,
    toggleSort,
    search,
    setSearch,
  } = useAdminDashboard()

  const [selectedStop, setSelectedStop] = useState<AdminStopRecord | null>(null)

  return (
    <div className="px-[80px] pt-4 pb-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#46494B]">Admin Dashboard</h1>
        <p className="text-sm text-[#778188] mt-1">
          Monitor field rep performance and visit metrics
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-6">
        <AdminToolbar
          dateRange={filters.dateRange}
          onDateRangeChange={setDateRange}
          repId={filters.repId}
          onRepChange={setRepFilter}
          reps={fieldReps}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      {/* KPI Row */}
      <div className="mb-6">
        <AdminKpiRow kpis={kpis} />
      </div>

      {/* Stops Table */}
      <StopsTable
        stops={stops}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={toggleSort}
        onClickStop={setSelectedStop}
      />

      {/* Detail Modal */}
      {selectedStop && (
        <StopDetailModal
          stop={selectedStop}
          onClose={() => setSelectedStop(null)}
        />
      )}
    </div>
  )
}
