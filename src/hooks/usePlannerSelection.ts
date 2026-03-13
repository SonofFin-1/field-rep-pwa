import { useState, useCallback } from 'react'

export function usePlannerSelection() {
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set())

  const toggleLead = useCallback((leadId: string) => {
    setSelectedLeadIds(prev => {
      const next = new Set(prev)
      if (next.has(leadId)) {
        next.delete(leadId)
      } else {
        next.add(leadId)
      }
      return next
    })
  }, [])

  const isSelected = useCallback(
    (leadId: string) => selectedLeadIds.has(leadId),
    [selectedLeadIds]
  )

  const clearSelection = useCallback(() => {
    setSelectedLeadIds(new Set())
  }, [])

  const selectAll = useCallback((leadIds: string[]) => {
    setSelectedLeadIds(new Set(leadIds))
  }, [])

  return {
    selectedLeadIds,
    selectedCount: selectedLeadIds.size,
    toggleLead,
    isSelected,
    clearSelection,
    selectAll,
  }
}
