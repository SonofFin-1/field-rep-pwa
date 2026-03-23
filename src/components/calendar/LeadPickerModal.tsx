import { useState, useMemo } from 'react'
import { X, Search, ChevronDown } from 'lucide-react'
import { ConversionScoreTag } from '@/components/shared'
import { leads } from '@/data/leads'
import type { Lead } from '@/data/types'

interface LeadPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (lead: Lead) => void
  selectedLeadId?: string
}

type ScoreFilter = 'all' | 'excellent' | 'great' | 'low'

const scoreFilters: { value: ScoreFilter; label: string }[] = [
  { value: 'all', label: 'All Scores' },
  { value: 'excellent', label: 'Excellent (85+)' },
  { value: 'great', label: 'Great (70-84)' },
  { value: 'low', label: 'Low (<70)' },
]

// Get unique cities from leads
const cities = Array.from(new Set(leads.map(l => l.city))).sort()

export function LeadPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedLeadId,
}: LeadPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('all')
  const [cityFilter, setCityFilter] = useState<string>('all')

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search filter (name or address)
      const matchesSearch =
        searchQuery === '' ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.city.toLowerCase().includes(searchQuery.toLowerCase())

      // Score filter
      let matchesScore = true
      if (scoreFilter === 'excellent') {
        matchesScore = lead.score >= 85
      } else if (scoreFilter === 'great') {
        matchesScore = lead.score >= 70 && lead.score < 85
      } else if (scoreFilter === 'low') {
        matchesScore = lead.score < 70
      }

      // City filter
      const matchesCity = cityFilter === 'all' || lead.city === cityFilter

      return matchesSearch && matchesScore && matchesCity
    })
  }, [searchQuery, scoreFilter, cityFilter])

  const handleSelect = (lead: Lead) => {
    onSelect(lead)
    onClose()
    // Reset filters on close
    setSearchQuery('')
    setScoreFilter('all')
    setCityFilter('all')
  }

  const handleClose = () => {
    onClose()
    setSearchQuery('')
    setScoreFilter('all')
    setCityFilter('all')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#DFEBF4]">
          <h2 className="text-lg font-semibold text-[#46494B]">Select Lead</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0F5F7] transition-colors"
          >
            <X className="w-5 h-5 text-[#778188]" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-[#DFEBF4] space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#778188]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name or address..."
              className="w-full pl-10 pr-4 py-2 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent text-sm"
            />
          </div>

          {/* Filter Row */}
          <div className="flex gap-3">
            {/* Score Filter */}
            <div className="relative flex-1">
              <select
                value={scoreFilter}
                onChange={e => setScoreFilter(e.target.value as ScoreFilter)}
                className="w-full px-3 py-2 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent text-sm appearance-none bg-white pr-8"
              >
                {scoreFilters.map(f => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#778188] pointer-events-none" />
            </div>

            {/* City Filter */}
            <div className="relative flex-1">
              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent text-sm appearance-none bg-white pr-8"
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#778188] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="px-4 py-2 text-xs text-[#778188] border-b border-[#DFEBF4]">
          {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} found
        </div>

        {/* Lead List */}
        <div className="flex-1 overflow-y-auto">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center text-[#778188]">
              No leads match your filters
            </div>
          ) : (
            <div className="divide-y divide-[#DFEBF4]">
              {filteredLeads.map(lead => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => handleSelect(lead)}
                  className={`w-full text-left px-4 py-3 hover:bg-[#F0F5F7] transition-colors ${
                    selectedLeadId === lead.id ? 'bg-[#F0F5F7]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#46494B]">
                        {lead.name}
                      </p>
                      <p className="text-xs text-[#778188] mt-0.5">
                        {lead.address}, {lead.city}
                      </p>
                      <p className="text-xs text-[#778188]">
                        {lead.phone}
                      </p>
                    </div>
                    <ConversionScoreTag score={lead.score} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#DFEBF4]">
          <button
            type="button"
            onClick={handleClose}
            className="w-full px-4 py-2 border border-[#DFEBF4] text-[#46494B] rounded-full hover:bg-[#F0F5F7] transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
