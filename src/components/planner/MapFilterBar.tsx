import { useState } from 'react'
import { SlidersHorizontal, X, Calendar } from 'lucide-react'
import { LeadsFilterModal } from '@/components/leads/LeadsFilterModal'
import type { LeadsFilters } from '@/components/leads/LeadsFilterModal'
import { defaultFilters } from '@/components/leads/LeadsFilterModal'

export type ScheduleFilter = 'all' | 'scheduled' | 'unscheduled'

interface MapFilterBarProps {
  filters: LeadsFilters
  onFiltersChange: (filters: LeadsFilters) => void
  activeFilterCount: number
  visibleCount: number
  totalCount: number
  scheduleFilter: ScheduleFilter
  onScheduleFilterChange: (filter: ScheduleFilter) => void
}

export function MapFilterBar({
  filters,
  onFiltersChange,
  activeFilterCount,
  visibleCount,
  totalCount,
  scheduleFilter,
  onScheduleFilterChange,
}: MapFilterBarProps) {
  const [showFilterModal, setShowFilterModal] = useState(false)

  const clearAllFilters = () => {
    onFiltersChange(defaultFilters)
    onScheduleFilterChange('all')
  }

  const getActiveFilterLabels = (): string[] => {
    const labels: string[] = []
    if (filters.name) {
      labels.push(`"${filters.name}"`)
    }
    if (filters.score !== 'all') {
      labels.push(filters.score.charAt(0).toUpperCase() + filters.score.slice(1) + ' Score')
    }
    if (filters.status !== 'all') {
      labels.push(filters.status)
    }
    if (filters.zips.length > 0) {
      if (filters.zips.length === 1) {
        labels.push(filters.zips[0])
      } else {
        labels.push(`${filters.zips.length} ZIPs`)
      }
    }
    if (filters.value !== 'all') {
      labels.push(filters.value.charAt(0).toUpperCase() + filters.value.slice(1) + ' Value')
    }
    return labels
  }

  const activeLabels = getActiveFilterLabels()

  return (
    <>
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center gap-2">
        {/* Filter button */}
        <button
          type="button"
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-[#DFEBF4] rounded-full shadow-md hover:bg-[#F0F5F7] transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#46494B]" />
          <span className="text-sm font-medium text-[#46494B]">Filter</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-[#0061AA] text-white text-xs font-semibold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Schedule filter toggle */}
        <div className="flex items-center bg-white border border-[#DFEBF4] rounded-full shadow-md overflow-hidden">
          <button
            type="button"
            onClick={() => onScheduleFilterChange('all')}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              scheduleFilter === 'all'
                ? 'bg-[#0061AA] text-white'
                : 'text-[#46494B] hover:bg-[#F0F5F7]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onScheduleFilterChange('unscheduled')}
            className={`px-3 py-2 text-sm font-medium transition-colors border-l border-[#DFEBF4] ${
              scheduleFilter === 'unscheduled'
                ? 'bg-[#0061AA] text-white'
                : 'text-[#46494B] hover:bg-[#F0F5F7]'
            }`}
          >
            Unscheduled
          </button>
          <button
            type="button"
            onClick={() => onScheduleFilterChange('scheduled')}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors border-l border-[#DFEBF4] ${
              scheduleFilter === 'scheduled'
                ? 'bg-[#7C3AED] text-white'
                : 'text-[#46494B] hover:bg-[#F0F5F7]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Scheduled
          </button>
        </div>

        {/* Active filter chips */}
        {activeLabels.map((label, index) => (
          <span
            key={index}
            className="px-3 py-1.5 bg-[#DBEAFE] text-[#1E40AF] text-sm font-medium rounded-full"
          >
            {label}
          </span>
        ))}

        {/* Clear all button */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#778188] hover:text-[#46494B] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}

        {/* Results count */}
        <span className="ml-auto px-3 py-1.5 bg-white/90 text-sm text-[#778188] rounded-full shadow-sm">
          {visibleCount} of {totalCount} leads
        </span>
      </div>

      {/* Filter Modal */}
      <LeadsFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApply={onFiltersChange}
      />
    </>
  )
}
