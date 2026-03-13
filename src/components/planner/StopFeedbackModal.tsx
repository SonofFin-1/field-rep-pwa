import { useState, useEffect } from 'react'
import { X, Mic, MicOff, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLeadNotes } from '@/hooks/useLeadNotes'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import type { PlanStop } from '@/data/types'

interface StopFeedbackModalProps {
  stop: PlanStop
  isOpen: boolean
  onClose: () => void
  onComplete: (notes: string, accuracy: number) => void
}

export function StopFeedbackModal({
  stop,
  isOpen,
  onClose,
  onComplete,
}: StopFeedbackModalProps) {
  const [notes, setNotes] = useState('')
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const leadId = stop.lead?.id || ''
  const { addNote } = useLeadNotes(leadId)
  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition()

  // Append transcript to notes
  useEffect(() => {
    if (transcript) {
      setNotes(prev => prev + transcript)
      resetTranscript()
    }
  }, [transcript, resetTranscript])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setNotes('')
      setAccuracy(null)
      resetTranscript()
    }
  }, [isOpen, resetTranscript])

  const handleComplete = () => {
    // Save notes to lead if provided
    if (notes.trim() && leadId) {
      addNote(notes.trim())
    }
    onComplete(notes, accuracy || 0)
  }

  const toggleVoice = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isOpen) return null

  const score = stop.lead?.score || 0

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-[#F0F5F7] rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-[#778188]" />
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[#46494B] text-center mb-6">
            How was your stop?
          </h2>

          {/* Notes section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#46494B] mb-2">
              Add notes
            </label>
            <div className="relative">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Cold call - expressed interest in smart home integration."
                className="w-full h-24 px-4 py-3 pr-12 border border-[#DFEBF4] rounded-xl text-sm text-[#46494B] placeholder-[#778188] resize-none focus:outline-none focus:ring-2 focus:ring-[#0061AA]/20 focus:border-[#0061AA]"
              />
              {isSupported && (
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={cn(
                    "absolute bottom-3 right-3 p-2 rounded-full transition-colors",
                    isListening
                      ? "bg-red-100 text-red-600"
                      : "hover:bg-[#F0F5F7] text-[#778188]"
                  )}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Accuracy rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#46494B] mb-2">
              How accurate was the conversion score?
            </label>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#DCFCE7] text-[#166534] text-xs font-medium rounded-full">
                <Check className="w-3 h-3" />
                {score} Conversion Score
              </span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAccuracy(value)}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-medium rounded-lg border transition-colors",
                    accuracy === value
                      ? "bg-[#0061AA] text-white border-[#0061AA]"
                      : "bg-white text-[#46494B] border-[#DFEBF4] hover:border-[#0061AA]"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-[#778188]">Inaccurate</span>
              <span className="text-xs text-[#778188]">Accurate</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold text-[#46494B] bg-white border border-[#DFEBF4] rounded-full hover:bg-[#F0F5F7] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-[#0061AA] rounded-full hover:bg-[#005090] transition-colors"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
