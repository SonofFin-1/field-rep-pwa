import { useMemo, useState } from 'react'
import { leads, mapLeads } from '@/data/leads'
import type { Lead } from '@/data/types'
import type {
  LeadsFilters,
  ScoreFilter,
  ValueFilter,
} from '@/components/leads/LeadsFilterModal'
import { defaultFilters } from '@/components/leads/LeadsFilterModal'

export type SortField = 'name' | 'score' | 'location' | 'value'
export type SortDirection = 'asc' | 'desc'

function matchesScoreFilter(score: number, filter: ScoreFilter): boolean {
  switch (filter) {
    case 'excellent':
      return score >= 85
    case 'great':
      return score >= 70 && score < 85
    case 'low':
      return score < 70
    default:
      return true
  }
}

function matchesValueFilter(value: number, filter: ValueFilter): boolean {
  switch (filter) {
    case 'high':
      return value >= 5000
    case 'medium':
      return value >= 2000 && value < 5000
    case 'low':
      return value < 2000
    default:
      return true
  }
}

export function useLeads(
  initialSortBy: SortField = 'score',
  initialSortDir: SortDirection = 'desc'
) {
  const [sortBy, setSortBy] = useState<SortField>(initialSortBy)
  const [sortDir, setSortDir] = useState<SortDirection>(initialSortDir)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<LeadsFilters>(defaultFilters)

  const filteredLeads = useMemo(() => {
    let result = [...leads]

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        lead =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.address.toLowerCase().includes(searchLower) ||
          lead.city.toLowerCase().includes(searchLower)
      )
    }

    // Apply filters
    if (filters.score !== 'all') {
      result = result.filter(lead => matchesScoreFilter(lead.score ?? 0, filters.score))
    }

    if (filters.status !== 'all') {
      result = result.filter(lead => lead.status === filters.status)
    }

    if (filters.zips.length > 0) {
      result = result.filter(lead => filters.zips.includes(lead.zip))
    }

    if (filters.value !== 'all') {
      result = result.filter(lead => matchesValueFilter(lead.value, filters.value))
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'score':
          comparison = (a.score ?? 0) - (b.score ?? 0)
          break
        case 'location':
          comparison = a.city.localeCompare(b.city)
          break
        case 'value':
          comparison = a.value - b.value
          break
      }
      return sortDir === 'asc' ? comparison : -comparison
    })

    return result
  }, [sortBy, sortDir, search, filters])

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.score !== 'all') count++
    if (filters.status !== 'all') count++
    if (filters.zips.length > 0) count++
    if (filters.value !== 'all') count++
    return count
  }, [filters])

  return {
    leads: filteredLeads,
    allLeads: leads,
    mapLeads,
    sortBy,
    sortDir,
    search,
    setSearch,
    toggleSort,
    filters,
    setFilters,
    activeFilterCount,
  }
}

export function useLeadById(id: string): Lead | undefined {
  return useMemo(() => {
    return [...leads, ...mapLeads].find(lead => lead.id === id)
  }, [id])
}
