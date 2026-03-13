import { useMemo } from 'react'
import { activities } from '@/data/activities'
import type { Activity } from '@/data/types'

export function useActivities(limit?: number): Activity[] {
  return useMemo(() => {
    if (limit) {
      return activities.slice(0, limit)
    }
    return activities
  }, [limit])
}
