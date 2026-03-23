import { useState, useCallback, useEffect } from 'react'
import type { Lead } from '@/data/types'

const STORAGE_KEY = 'field-rep-user-leads'

function loadUserLeads(): Lead[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load user leads from localStorage:', e)
  }
  return []
}

function saveUserLeads(leads: Lead[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
  } catch (e) {
    console.error('Failed to save user leads to localStorage:', e)
  }
}

export function useUserLeads() {
  const [userLeads, setUserLeads] = useState<Lead[]>(() => loadUserLeads())

  // Persist to localStorage whenever userLeads changes
  useEffect(() => {
    saveUserLeads(userLeads)
  }, [userLeads])

  const addLead = useCallback((lead: Lead) => {
    setUserLeads(prev => [...prev, lead])
  }, [])

  const removeLead = useCallback((leadId: string) => {
    setUserLeads(prev => prev.filter(l => l.id !== leadId))
  }, [])

  const updateLead = useCallback((leadId: string, updates: Partial<Lead>) => {
    setUserLeads(prev =>
      prev.map(l => (l.id === leadId ? { ...l, ...updates } : l))
    )
  }, [])

  const clearAllUserLeads = useCallback(() => {
    setUserLeads([])
  }, [])

  return {
    userLeads,
    addLead,
    removeLead,
    updateLead,
    clearAllUserLeads,
  }
}
