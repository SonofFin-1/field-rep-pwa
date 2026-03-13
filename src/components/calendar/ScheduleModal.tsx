import { useState, useEffect } from 'react'
import { X, ChevronRight, Mic, MicOff, Trash2 } from 'lucide-react'
import type { ScheduleEvent, ScheduleEventType, Lead } from '@/data/types'
import { leads } from '@/data/leads'
import { formatDateKey } from '@/lib/calendar-utils'
import { LeadPickerModal } from './LeadPickerModal'
import { ConversionScoreTag } from '@/components/shared'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<ScheduleEvent, 'id' | 'status'>) => void
  onDelete?: (eventId: string, leadId?: string, eventDate?: string) => void
  initialDate?: Date
  editingEvent?: ScheduleEvent
}

const eventTypes: { value: ScheduleEventType; label: string }[] = [
  { value: 'appointment', label: 'Appointment' },
  { value: 'task', label: 'Task' },
  { value: 'follow-up', label: 'Follow-up' },
]

export function ScheduleModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialDate,
  editingEvent,
}: ScheduleModalProps) {
  const [title, setTitle] = useState('')
  const [leadId, setLeadId] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [type, setType] = useState<ScheduleEventType>('appointment')
  const [notes, setNotes] = useState('')
  const [showLeadPicker, setShowLeadPicker] = useState(false)

  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition()

  // Append transcript to notes as user speaks
  useEffect(() => {
    if (transcript) {
      setNotes(prev => prev + (prev ? ' ' : '') + transcript)
      resetTranscript()
    }
  }, [transcript, resetTranscript])

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title)
      setLeadId(editingEvent.leadId || '')
      setDate(editingEvent.date)
      setStartTime(editingEvent.startTime)
      setEndTime(editingEvent.endTime)
      setType(editingEvent.type)
      setNotes(editingEvent.notes || '')
    } else if (initialDate) {
      setDate(formatDateKey(initialDate))
      setTitle('')
      setLeadId('')
      setStartTime('09:00')
      setEndTime('10:00')
      setType('appointment')
      setNotes('')
    }
  }, [editingEvent, initialDate, isOpen])

  const selectedLead = leads.find(l => l.id === leadId)

  const handleLeadSelect = (lead: Lead) => {
    setLeadId(lead.id)
  }

  const handleClearLead = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLeadId('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const event: Omit<ScheduleEvent, 'id' | 'status'> = {
      title,
      date,
      startTime,
      endTime,
      type,
      notes: notes || undefined,
      leadId: leadId || undefined,
      leadName: selectedLead?.name,
      address: selectedLead
        ? `${selectedLead.address}, ${selectedLead.city} ${selectedLead.zip}`
        : undefined,
    }

    onSave(event)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#DFEBF4]">
          <h2 className="text-lg font-semibold text-[#46494B]">
            {editingEvent ? 'Edit Event' : 'New Event'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0F5F7] transition-colors"
          >
            <X className="w-5 h-5 text-[#778188]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
              placeholder="Event title"
            />
          </div>

          {/* Lead */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-1">
              Lead (optional)
            </label>
            <button
              type="button"
              onClick={() => setShowLeadPicker(true)}
              className="w-full px-3 py-2 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent text-left flex items-center justify-between hover:bg-[#F0F5F7] transition-colors"
            >
              {selectedLead ? (
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-sm text-[#46494B] truncate">
                      {selectedLead.name}
                    </span>
                    <ConversionScoreTag score={selectedLead.score} />
                  </div>
                  <button
                    type="button"
                    onClick={handleClearLead}
                    className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#DFEBF4] transition-colors"
                  >
                    <X className="w-3 h-3 text-[#778188]" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-[#778188]">Select a lead...</span>
                  <ChevronRight className="w-4 h-4 text-[#778188]" />
                </div>
              )}
            </button>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-1">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
            />
          </div>

          {/* Time row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#46494B] mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#46494B] mb-1">
                End Time *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                required
                className="w-full px-3 py-2 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value as ScheduleEventType)}
              className="w-full px-3 py-2 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
            >
              {eventTypes.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-[#46494B]">
                Notes
              </label>
              {isSupported && (
                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`p-1.5 rounded-full transition-colors ${
                    isListening
                      ? 'bg-red-100 hover:bg-red-200'
                      : 'hover:bg-[#F0F5F7]'
                  }`}
                  title={isListening ? 'Stop recording' : 'Start voice input'}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4 text-red-500" />
                  ) : (
                    <Mic className="w-4 h-4 text-[#778188]" />
                  )}
                </button>
              )}
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent resize-none ${
                isListening ? 'border-red-300 bg-red-50' : 'border-[#DFEBF4]'
              }`}
              placeholder={isListening ? 'Listening...' : 'Add any notes...'}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            {editingEvent && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(editingEvent.id, editingEvent.leadId, editingEvent.date)
                  onClose()
                }}
                className="px-4 py-2 border border-red-300 text-red-500 rounded-full hover:bg-red-50 transition-colors font-medium flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#DFEBF4] text-[#46494B] rounded-full hover:bg-[#F0F5F7] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#0061AA] text-white rounded-full hover:bg-[#004d88] transition-colors font-medium"
            >
              {editingEvent ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>

    <LeadPickerModal
      isOpen={showLeadPicker}
      onClose={() => setShowLeadPicker(false)}
      onSelect={handleLeadSelect}
      selectedLeadId={leadId}
    />
    </>
  )
}
