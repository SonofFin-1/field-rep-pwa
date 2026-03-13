import { useState, useEffect, useCallback } from 'react'

interface LeadNote {
  id: string
  text: string
  timestamp: Date
}

interface LeadNotesStore {
  [leadId: string]: LeadNote[]
}

const STORAGE_KEY = 'lead-notes'

function loadNotes(): LeadNotesStore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert timestamp strings back to Date objects
      Object.keys(parsed).forEach(leadId => {
        parsed[leadId] = parsed[leadId].map((note: LeadNote) => ({
          ...note,
          timestamp: new Date(note.timestamp),
        }))
      })
      return parsed
    }
  } catch (e) {
    console.error('Failed to load notes:', e)
  }
  return {}
}

function saveNotes(notes: LeadNotesStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (e) {
    console.error('Failed to save notes:', e)
  }
}

export function useLeadNotes(leadId: string) {
  const [allNotes, setAllNotes] = useState<LeadNotesStore>(loadNotes)
  const notes = allNotes[leadId] || []

  // Reload notes when leadId changes
  useEffect(() => {
    setAllNotes(loadNotes())
  }, [leadId])

  const addNote = useCallback((text: string) => {
    if (!text.trim()) return

    const newNote: LeadNote = {
      id: `note-${Date.now()}`,
      text: text.trim(),
      timestamp: new Date(),
    }

    setAllNotes(prev => {
      const updated = {
        ...prev,
        [leadId]: [...(prev[leadId] || []), newNote],
      }
      saveNotes(updated)
      return updated
    })
  }, [leadId])

  const deleteNote = useCallback((noteId: string) => {
    setAllNotes(prev => {
      const updated = {
        ...prev,
        [leadId]: (prev[leadId] || []).filter(n => n.id !== noteId),
      }
      saveNotes(updated)
      return updated
    })
  }, [leadId])

  return { notes, addNote, deleteNote }
}
