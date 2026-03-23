import { useState, useEffect, useMemo } from 'react'
import { X, ChevronDown, Search } from 'lucide-react'
import { leads } from '@/data/leads'

export type ScoreFilter = 'all' | 'excellent' | 'great' | 'low' | 'unscored'
export type StatusFilter = 'all' | 'New' | 'Returning'
export type ValueFilter = 'all' | 'high' | 'medium' | 'low'

export interface LeadsFilters {
  score: ScoreFilter
  status: StatusFilter
  zips: string[]  // Changed to array for multi-select
  value: ValueFilter
  name: string
}

export const defaultFilters: LeadsFilters = {
  score: 'all',
  status: 'all',
  zips: [],  // Empty array means all zips
  value: 'all',
  name: '',
}

interface LeadsFilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: LeadsFilters
  onApply: (filters: LeadsFilters) => void
}

const scoreOptions: { value: ScoreFilter; label: string }[] = [
  { value: 'all', label: 'All Scores' },
  { value: 'excellent', label: 'Excellent (85+)' },
  { value: 'great', label: 'Great (70-84)' },
  { value: 'low', label: 'Low (<70)' },
  { value: 'unscored', label: 'Unscored (?)' },
]

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Returning', label: 'Returning' },
]

const valueOptions: { value: ValueFilter; label: string }[] = [
  { value: 'all', label: 'All Values' },
  { value: 'high', label: 'High ($5,000+)' },
  { value: 'medium', label: 'Medium ($2,000-$4,999)' },
  { value: 'low', label: 'Low (<$2,000)' },
]

export function LeadsFilterModal({
  isOpen,
  onClose,
  filters,
  onApply,
}: LeadsFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<LeadsFilters>(filters)

  // Get unique zip codes from leads
  const zipCodes = useMemo(() => {
    return Array.from(new Set(leads.map(l => l.zip))).sort()
  }, [])

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters)
    }
  }, [isOpen, filters])

  const handleApply = () => {
    onApply(localFilters)
    onClose()
  }

  const handleReset = () => {
    setLocalFilters(defaultFilters)
  }

  const hasActiveFilters =
    localFilters.score !== 'all' ||
    localFilters.status !== 'all' ||
    localFilters.zips.length > 0 ||
    localFilters.value !== 'all' ||
    localFilters.name !== ''

  const toggleZip = (zip: string) => {
    setLocalFilters(f => ({
      ...f,
      zips: f.zips.includes(zip)
        ? f.zips.filter(z => z !== zip)
        : [...f.zips, zip],
    }))
  }

  const selectAllZips = () => {
    setLocalFilters(f => ({ ...f, zips: [] }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#DFEBF4]">
          <h2 className="text-lg font-semibold text-[#46494B]">Filter Leads</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0F5F7] transition-colors"
          >
            <X className="w-5 h-5 text-[#778188]" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 space-y-4">
          {/* Name Search */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-2">
              Search by Name
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#778188]" />
              <input
                type="text"
                value={localFilters.name}
                onChange={e =>
                  setLocalFilters(f => ({ ...f, name: e.target.value }))
                }
                placeholder="Enter name..."
                className="w-full pl-10 pr-3 py-2.5 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
              />
            </div>
          </div>

          {/* Score Filter */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-2">
              Conversion Score
            </label>
            <div className="relative">
              <select
                value={localFilters.score}
                onChange={e =>
                  setLocalFilters(f => ({
                    ...f,
                    score: e.target.value as ScoreFilter,
                  }))
                }
                className="w-full px-3 py-2.5 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent appearance-none bg-white pr-10"
              >
                {scoreOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#778188] pointer-events-none" />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-2">
              Status
            </label>
            <div className="relative">
              <select
                value={localFilters.status}
                onChange={e =>
                  setLocalFilters(f => ({
                    ...f,
                    status: e.target.value as StatusFilter,
                  }))
                }
                className="w-full px-3 py-2.5 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent appearance-none bg-white pr-10"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#778188] pointer-events-none" />
            </div>
          </div>

          {/* Zip Code Filter - Multi-select */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-[#46494B]">
                Zip Codes
              </label>
              {localFilters.zips.length > 0 && (
                <button
                  type="button"
                  onClick={selectAllZips}
                  className="text-xs text-[#0061AA] hover:underline"
                >
                  Clear selection
                </button>
              )}
            </div>
            <div className="border border-[#DFEBF4] rounded-lg p-2 max-h-[140px] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                {zipCodes.map(zip => {
                  const isSelected = localFilters.zips.includes(zip)
                  return (
                    <label
                      key={zip}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#0061AA]/10' : 'hover:bg-[#F0F5F7]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleZip(zip)}
                        className="w-4 h-4 rounded border-[#DFEBF4] text-[#0061AA] focus:ring-[#0061AA]"
                      />
                      <span className="text-sm text-[#46494B]">{zip}</span>
                    </label>
                  )
                })}
              </div>
            </div>
            {localFilters.zips.length === 0 && (
              <p className="text-xs text-[#778188] mt-1">All zip codes selected</p>
            )}
            {localFilters.zips.length > 0 && (
              <p className="text-xs text-[#778188] mt-1">
                {localFilters.zips.length} zip code{localFilters.zips.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Value Filter */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-2">
              System Value
            </label>
            <div className="relative">
              <select
                value={localFilters.value}
                onChange={e =>
                  setLocalFilters(f => ({
                    ...f,
                    value: e.target.value as ValueFilter,
                  }))
                }
                className="w-full px-3 py-2.5 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent appearance-none bg-white pr-10"
              >
                {valueOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#778188] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-[#DFEBF4]">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className="px-4 py-2 text-[#778188] hover:text-[#46494B] transition-colors font-medium disabled:opacity-50"
          >
            Reset
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#DFEBF4] text-[#46494B] rounded-full hover:bg-[#F0F5F7] transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2 bg-[#0061AA] text-white rounded-full hover:bg-[#004d88] transition-colors font-medium"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
