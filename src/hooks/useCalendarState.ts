import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { CalendarViewMode } from '@/data/types'
import { formatDateKey, getWeekDates, parseDateKey } from '@/lib/calendar-utils'

export function useCalendarState() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize from URL params if present
  const initialDate = searchParams.get('date')
  const initialView = searchParams.get('view') as CalendarViewMode | null

  const [viewMode, setViewMode] = useState<CalendarViewMode>(
    initialView && ['day', 'week', 'month'].includes(initialView) ? initialView : 'day'
  )
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (initialDate && /^\d{4}-\d{2}-\d{2}$/.test(initialDate)) {
      return parseDateKey(initialDate)
    }
    return new Date()
  })

  // Clear URL params after initial load so they don't persist on navigation
  useEffect(() => {
    if (initialDate || initialView) {
      setSearchParams({}, { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const goToToday = useCallback(() => {
    setSelectedDate(new Date())
  }, [])

  const goToPrevious = useCallback(() => {
    setSelectedDate(prev => {
      const newDate = new Date(prev)
      switch (viewMode) {
        case 'day':
          newDate.setDate(newDate.getDate() - 1)
          break
        case 'week':
          newDate.setDate(newDate.getDate() - 7)
          break
        case 'month':
          newDate.setMonth(newDate.getMonth() - 1)
          break
      }
      return newDate
    })
  }, [viewMode])

  const goToNext = useCallback(() => {
    setSelectedDate(prev => {
      const newDate = new Date(prev)
      switch (viewMode) {
        case 'day':
          newDate.setDate(newDate.getDate() + 1)
          break
        case 'week':
          newDate.setDate(newDate.getDate() + 7)
          break
        case 'month':
          newDate.setMonth(newDate.getMonth() + 1)
          break
      }
      return newDate
    })
  }, [viewMode])

  const selectDate = useCallback((date: Date) => {
    setSelectedDate(date)
  }, [])

  const switchToView = useCallback((mode: CalendarViewMode) => {
    setViewMode(mode)
  }, [])

  const switchToDayView = useCallback((date: Date) => {
    setSelectedDate(date)
    setViewMode('day')
  }, [])

  const selectedDateKey = formatDateKey(selectedDate)
  const weekDates = getWeekDates(selectedDate)

  return {
    viewMode,
    selectedDate,
    selectedDateKey,
    weekDates,
    setViewMode: switchToView,
    goToToday,
    goToPrevious,
    goToNext,
    selectDate,
    switchToDayView,
  }
}
