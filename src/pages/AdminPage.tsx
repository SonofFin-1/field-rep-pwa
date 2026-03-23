import { useState, useEffect } from 'react'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import {
  AdminKpiRow,
  AdminToolbar,
  EmployeeTable,
  EmployeeStopsModal,
  StopDetailModal,
} from '@/components/admin'
import type { AdminStopRecord, RepPerformance } from '@/data/admin-types'

const DISMISSED_ALERTS_KEY = 'admin-dismissed-alerts'

export function AdminPage() {
  const {
    kpis,
    sortedEmployees,
    filters,
    setDateRange,
    setSpecificDate,
    setOutcomeFilter,
    sortBy,
    sortDir,
    toggleSort,
    employeeSortBy,
    employeeSortDir,
    toggleEmployeeSort,
    search,
    setSearch,
    getEmployeeStops,
  } = useAdminDashboard()

  const [selectedEmployee, setSelectedEmployee] = useState<RepPerformance | null>(null)
  const [selectedStop, setSelectedStop] = useState<AdminStopRecord | null>(null)
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  // Load dismissed alerts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(DISMISSED_ALERTS_KEY)
    if (stored) {
      setDismissedAlerts(new Set(JSON.parse(stored)))
    }
  }, [])

  // Dismiss an alert for an employee
  const handleDismissAlert = (repId: string) => {
    setDismissedAlerts(prev => {
      const updated = new Set(prev)
      updated.add(repId)
      localStorage.setItem(DISMISSED_ALERTS_KEY, JSON.stringify([...updated]))
      return updated
    })
  }

  // Filter employees by search
  const filteredEmployees = sortedEmployees.filter(emp =>
    emp.repName.toLowerCase().includes(search.toLowerCase())
  )

  // Get stops for selected employee
  const employeeStops = selectedEmployee ? getEmployeeStops(selectedEmployee.repId) : []

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
          specificDate={filters.specificDate}
          onSpecificDateChange={setSpecificDate}
          outcome={filters.outcome}
          onOutcomeChange={setOutcomeFilter}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      {/* KPI Row */}
      <div className="mb-6">
        <AdminKpiRow kpis={kpis} />
      </div>

      {/* Employee Table */}
      <EmployeeTable
        employees={filteredEmployees}
        sortBy={employeeSortBy}
        sortDir={employeeSortDir}
        dateRange={filters.dateRange}
        dismissedAlerts={dismissedAlerts}
        onSort={toggleEmployeeSort}
        onClickEmployee={setSelectedEmployee}
      />

      {/* Employee Stops Modal */}
      {selectedEmployee && (
        <EmployeeStopsModal
          employee={selectedEmployee}
          stops={employeeStops}
          sortBy={sortBy}
          sortDir={sortDir}
          hasAlert={selectedEmployee.hasIncompletePastStops && !dismissedAlerts.has(selectedEmployee.repId)}
          onSort={toggleSort}
          onClickStop={setSelectedStop}
          onDismissAlert={handleDismissAlert}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* Stop Detail Modal */}
      {selectedStop && (
        <StopDetailModal
          stop={selectedStop}
          onClose={() => setSelectedStop(null)}
        />
      )}
    </div>
  )
}
