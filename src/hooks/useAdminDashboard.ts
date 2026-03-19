/**
 * Admin Dashboard Hook
 * Handles filtering, sorting, and KPI calculations
 * Combines mock data with real Mandi data from localStorage
 */

import { useState, useMemo, useEffect, useCallback } from 'react'
import { adminStops, fieldReps } from '@/data/admin-mock-data'
import { loadMandiStopsFromStorage } from '@/lib/plan-adapter'
import type {
  AdminStopRecord,
  AdminKpiSummary,
  RepPerformance,
  AdminFilters,
  DateRangeFilter,
} from '@/data/admin-types'

export type SortField = 'date' | 'rep' | 'lead' | 'status' | 'rating'
export type SortDirection = 'asc' | 'desc'

// Get date range boundaries
function getDateRange(filter: DateRangeFilter): { start: string; end: string } {
  const today = new Date()
  const end = today.toISOString().split('T')[0]

  let start: string

  switch (filter) {
    case 'today':
      start = end
      break
    case 'week': {
      const weekAgo = new Date(today)
      weekAgo.setDate(today.getDate() - 7)
      start = weekAgo.toISOString().split('T')[0]
      break
    }
    case 'month': {
      const monthAgo = new Date(today)
      monthAgo.setDate(today.getDate() - 30)
      start = monthAgo.toISOString().split('T')[0]
      break
    }
    case 'all':
    default: {
      // 30 days of data
      const allAgo = new Date(today)
      allAgo.setDate(today.getDate() - 30)
      start = allAgo.toISOString().split('T')[0]
      break
    }
  }

  return { start, end }
}

// Calculate KPIs from stops
function calculateKpis(stops: AdminStopRecord[]): AdminKpiSummary {
  const totalStops = stops.length
  const completedStops = stops.filter(s => s.status === 'completed').length
  const pendingStops = stops.filter(s => s.status === 'pending').length
  const missedStops = stops.filter(s => s.status === 'missed').length
  const totalSales = stops.filter(s => s.outcome === 'sale').length

  // Calculate average rating from stops with feedback
  const stopsWithRating = stops.filter(s => s.feedback?.accuracyRating)
  const averageRating = stopsWithRating.length > 0
    ? stopsWithRating.reduce((sum, s) => sum + (s.feedback?.accuracyRating || 0), 0) / stopsWithRating.length
    : 0

  return {
    totalStops,
    completedStops,
    pendingStops,
    missedStops,
    completionRate: totalStops > 0 ? (completedStops / totalStops) * 100 : 0,
    averageRating,
    totalSales,
    conversionRate: completedStops > 0 ? (totalSales / completedStops) * 100 : 0,
  }
}

// Calculate per-rep performance
function calculateRepPerformance(stops: AdminStopRecord[]): RepPerformance[] {
  return fieldReps.map(rep => {
    const repStops = stops.filter(s => s.repId === rep.id)
    const kpis = calculateKpis(repStops)

    return {
      repId: rep.id,
      repName: rep.name,
      repInitials: rep.initials,
      totalStops: kpis.totalStops,
      completedStops: kpis.completedStops,
      pendingStops: kpis.pendingStops,
      missedStops: kpis.missedStops,
      completionRate: kpis.completionRate,
      averageRating: kpis.averageRating,
      totalSales: kpis.totalSales,
      conversionRate: kpis.conversionRate,
    }
  })
}

export function useAdminDashboard() {
  // Filter state
  const [filters, setFilters] = useState<AdminFilters>({
    dateRange: 'week',
    repId: null,
  })

  // Sort state
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')

  // Search state
  const [search, setSearch] = useState('')

  // Real Mandi stops from localStorage
  const [mandiStops, setMandiStops] = useState<AdminStopRecord[]>([])

  // Load Mandi's stops from localStorage
  const loadMandiStops = useCallback(() => {
    const stops = loadMandiStopsFromStorage()
    setMandiStops(stops)
  }, [])

  // Load on mount and listen for updates
  useEffect(() => {
    loadMandiStops()

    // Listen for storage events (other tabs)
    const handleStorage = (event: StorageEvent) => {
      if (event.key?.startsWith('field-rep-plan-')) {
        loadMandiStops()
      }
    }

    // Listen for plan-updated events (same tab)
    const handlePlanUpdated = () => {
      loadMandiStops()
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('plan-updated', handlePlanUpdated)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('plan-updated', handlePlanUpdated)
    }
  }, [loadMandiStops])

  // Combine mock stops with real Mandi stops
  const allStops = useMemo(() => {
    return [...adminStops, ...mandiStops]
  }, [mandiStops])

  // Filter stops by date range and rep
  const filteredStops = useMemo(() => {
    const { start, end } = getDateRange(filters.dateRange)

    return allStops.filter(stop => {
      // Date filter
      if (stop.date < start || stop.date > end) return false

      // Rep filter
      if (filters.repId && stop.repId !== filters.repId) return false

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        return (
          stop.leadName.toLowerCase().includes(searchLower) ||
          stop.address.toLowerCase().includes(searchLower) ||
          stop.repName.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [allStops, filters, search])

  // Sort stops
  const sortedStops = useMemo(() => {
    const sorted = [...filteredStops]

    sorted.sort((a, b) => {
      let compare = 0

      switch (sortBy) {
        case 'date':
          compare = a.date.localeCompare(b.date)
          if (compare === 0) {
            compare = a.scheduledTime.localeCompare(b.scheduledTime)
          }
          break
        case 'rep':
          compare = a.repName.localeCompare(b.repName)
          break
        case 'lead':
          compare = a.leadName.localeCompare(b.leadName)
          break
        case 'status': {
          const statusOrder: Record<string, number> = { completed: 0, pending: 1, missed: 2 }
          compare = (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0)
          break
        }
        case 'rating': {
          const ratingA = a.feedback?.accuracyRating || 0
          const ratingB = b.feedback?.accuracyRating || 0
          compare = ratingA - ratingB
          break
        }
      }

      return sortDir === 'asc' ? compare : -compare
    })

    return sorted
  }, [filteredStops, sortBy, sortDir])

  // Calculate KPIs
  const kpis = useMemo(() => calculateKpis(filteredStops), [filteredStops])

  // Calculate rep performance
  const repPerformance = useMemo(
    () => calculateRepPerformance(filteredStops),
    [filteredStops]
  )

  // Toggle sort
  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir('desc')
    }
  }

  // Update date range
  const setDateRange = (dateRange: DateRangeFilter) => {
    setFilters(prev => ({ ...prev, dateRange }))
  }

  // Update rep filter
  const setRepFilter = (repId: string | null) => {
    setFilters(prev => ({ ...prev, repId }))
  }

  return {
    // Data
    stops: sortedStops,
    allStops,
    kpis,
    repPerformance,
    fieldReps,

    // Filters
    filters,
    setDateRange,
    setRepFilter,

    // Sorting
    sortBy,
    sortDir,
    toggleSort,

    // Search
    search,
    setSearch,
  }
}

export function useStopById(id: string): AdminStopRecord | undefined {
  // Check both mock stops and Mandi's real stops
  return useMemo(() => {
    const mandiStops = loadMandiStopsFromStorage()
    const allStops = [...adminStops, ...mandiStops]
    return allStops.find(stop => stop.id === id)
  }, [id])
}
