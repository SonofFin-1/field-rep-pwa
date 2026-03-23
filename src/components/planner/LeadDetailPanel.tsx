import { useState, useEffect } from 'react'
import { X, Navigation, ExternalLink, Mic, MicOff, Send, Trash2, Calendar } from 'lucide-react'
import { ConversionScoreTag, StatusTag } from '@/components/shared'
import { formatCurrency } from '@/lib/utils'
import { useLeadNotes } from '@/hooks/useLeadNotes'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import type { Lead } from '@/data/types'

interface LeadDetailPanelProps {
  lead: Lead
  onClose: () => void
  appointmentId?: string | null
  onRemoveAppointment?: () => void
  isScheduled?: boolean
  onRemoveFromCalendar?: () => void
}

function formatNoteDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function LeadDetailPanel({
  lead,
  onClose,
  appointmentId,
  onRemoveAppointment,
  isScheduled,
  onRemoveFromCalendar,
}: LeadDetailPanelProps) {
  const [noteInput, setNoteInput] = useState('')
  const { notes, addNote, deleteNote } = useLeadNotes(lead.id)
  const { isListening, isSupported, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition()

  // Append transcript to note input as user speaks
  useEffect(() => {
    if (transcript) {
      setNoteInput(prev => prev + transcript)
      resetTranscript()
    }
  }, [transcript, resetTranscript])

  const handleSaveNote = () => {
    if (noteInput.trim()) {
      addNote(noteInput)
      setNoteInput('')
      if (isListening) {
        stopListening()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSaveNote()
    }
  }

  const handleMicClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const fullAddress = `${lead.address}, ${lead.city} ${lead.zip}`
  const systemValue = lead.purchaseHistory
    ? lead.purchaseHistory.reduce((sum, item) => sum + item.amount, 0)
    : lead.value

  return (
    <div className="w-[320px] h-full bg-white border-l border-[#DFEBF4] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-[#DFEBF4]">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[#46494B]">{lead.name}</h2>
          <div className="mt-1">
            <ConversionScoreTag score={lead.score} showLabel />
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-[#F0F5F7] rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-[#778188]" />
        </button>
      </div>

      {/* Contact Info */}
      <div className="px-4 py-3 space-y-2 border-b border-[#DFEBF4]">
        <div className="flex items-start gap-2">
          <span className="text-xs text-[#778188] w-20 flex-shrink-0">Address</span>
          <span className="text-xs text-[#46494B]">{fullAddress}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs text-[#778188] w-20 flex-shrink-0">Phone</span>
          <span className="text-xs text-[#46494B]">{lead.phone}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs text-[#778188] w-20 flex-shrink-0">Email</span>
          <a
            href={`mailto:${lead.email}`}
            className="text-xs text-[#0061AA] hover:text-[#004d88] flex items-center gap-1 font-medium"
          >
            {lead.email}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs text-[#778188] w-20 flex-shrink-0">Status</span>
          <StatusTag status={lead.status} />
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs text-[#778188] w-20 flex-shrink-0">System Value</span>
          <span className="text-xs text-[#46494B]">{formatCurrency(systemValue)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-[#DFEBF4]">
        <a
          href={`https://maps.google.com/maps?daddr=${encodeURIComponent(fullAddress)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#46494B] text-sm font-medium rounded-full border border-[#DFEBF4] hover:bg-[#F0F5F7] transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Get Directions
        </a>
        {appointmentId && onRemoveAppointment && (
          <button
            type="button"
            onClick={onRemoveAppointment}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Remove Appointment
          </button>
        )}
        {!appointmentId && isScheduled && onRemoveFromCalendar && (
          <button
            type="button"
            onClick={onRemoveFromCalendar}
            className="flex items-center gap-1.5 px-4 py-2 text-red-500 text-sm font-medium rounded-full border border-red-300 hover:bg-red-50 transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Remove from Calendar
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Summary */}
        {lead.summary && (
          <div className="px-4 py-3 border-b border-[#DFEBF4]">
            <h3 className="text-sm font-semibold text-[#46494B] mb-2 flex items-center gap-1">
              <span className="text-yellow-500">*</span> Summary
            </h3>
            <p className="text-xs text-[#778188] leading-relaxed">{lead.summary}</p>
          </div>
        )}

        {/* Purchase History */}
        {lead.purchaseHistory && lead.purchaseHistory.length > 0 && (
          <div className="px-4 py-3 border-b border-[#DFEBF4]">
            <h3 className="text-sm font-semibold text-[#46494B] mb-3">Purchase History</h3>
            <div className="space-y-4">
              {lead.purchaseHistory.map((purchase, index) => (
                <div key={index}>
                  <p className="text-xs text-[#778188]">{purchase.date}</p>
                  <p className="text-sm text-[#46494B] mt-0.5">{purchase.item}</p>
                  <p className="text-sm font-semibold text-[#0061AA] mt-0.5">
                    {formatCurrency(purchase.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visit History */}
        {lead.visitHistory && lead.visitHistory.length > 0 && (
          <div className="px-4 py-3 border-b border-[#DFEBF4]">
            <h3 className="text-sm font-semibold text-[#46494B] mb-3">Visit History</h3>
            <div className="space-y-4">
              {lead.visitHistory.map((visit, index) => (
                <div key={index}>
                  <p className="text-xs text-[#778188]">{visit.date}</p>
                  <p className="text-xs text-[#46494B] mt-1 leading-relaxed">{visit.notes}</p>
                  {visit.followUp && (
                    <p className="text-xs text-[#0061AA] mt-1">{visit.followUp}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Notes */}
        {notes.length > 0 && (
          <div className="px-4 py-3 border-b border-[#DFEBF4]">
            <h3 className="text-sm font-semibold text-[#46494B] mb-3">Notes</h3>
            <div className="space-y-3">
              {notes.map(note => (
                <div key={note.id} className="group flex items-start gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-[#778188]">{formatNoteDate(note.timestamp)}</p>
                    <p className="text-xs text-[#46494B] mt-1 leading-relaxed">{note.text}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#F0F5F7] rounded-full transition-all"
                  >
                    <Trash2 className="w-3 h-3 text-[#778188]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Notes */}
        <div className="px-4 py-3">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a note..."
              className="flex-1 py-2 text-sm text-[#46494B] placeholder-[#778188] border-b border-[#DFEBF4] focus:outline-none focus:border-[#0061AA]"
            />
            {isSupported && (
              <button
                type="button"
                onClick={handleMicClick}
                className={`p-1 rounded-full transition-colors ${
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
            <button
              type="button"
              onClick={handleSaveNote}
              disabled={!noteInput.trim()}
              className="p-1 hover:bg-[#F0F5F7] rounded-full transition-colors disabled:opacity-40"
            >
              <Send className="w-4 h-4 text-[#0061AA]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
