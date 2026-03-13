import { getScorePinColor, PIN_COLORS } from '@/lib/map-utils'

interface ScorePinProps {
  score: number
  isSelected?: boolean
  isFocused?: boolean
  isCompleted?: boolean
  isScheduled?: boolean
  onClick?: () => void
}

/**
 * Score pin marker for Google Maps AdvancedMarkerElement
 * Use as a child of OverlayView or AdvancedMarkerElement
 */
export function ScorePin({ score, isSelected = false, isFocused = false, isCompleted = false, isScheduled = false, onClick }: ScorePinProps) {
  const color = getScorePinColor(score)
  const { bg, text } = PIN_COLORS[color]

  // Completed state: grayed out
  // Focused state: blue and bigger
  let pinBg = bg
  let pinText = text

  if (isCompleted) {
    pinBg = '#9CA3AF' // Darker gray background
    pinText = '#4B5563' // Darker gray text
  } else if (isFocused) {
    pinBg = '#0061AA'
    pinText = '#FFFFFF'
  }

  const borderColor = isSelected && !isCompleted ? '#0061AA' : pinBg

  // Size adjustments for focused state
  const minWidth = isFocused ? '44px' : '32px'
  const height = isFocused ? '32px' : '24px'
  const fontSize = isFocused ? '14px' : '12px'
  const arrowSize = isFocused ? '8px' : '6px'

  return (
    <div
      onClick={onClick}
      className="relative flex flex-col items-center cursor-pointer"
      style={{
        transform: 'translate(-50%, -100%)',
        zIndex: isFocused ? 1000 : 1,
        opacity: isCompleted ? 0.8 : 1,
      }}
    >
      <div
        className="relative flex items-center justify-center px-2 font-semibold rounded-xl transition-all"
        style={{
          minWidth,
          height,
          fontSize,
          backgroundColor: pinBg,
          color: pinText,
          border: `2px solid ${borderColor}`,
          boxShadow: isFocused
            ? '0 4px 12px rgba(0,97,170,0.4)'
            : '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        {/* Scheduled calendar badge (show on left side) */}
        {isScheduled && !isCompleted && (
          <div
            className="absolute -top-1 -left-1 w-[14px] h-[14px] rounded-full flex items-center justify-center"
            style={{
              backgroundColor: '#7C3AED',
              border: '2px solid white',
            }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="3" />
              <path d="M3 10H21" stroke="white" strokeWidth="3" />
              <path d="M8 2V6" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <path d="M16 2V6" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
        )}
        {/* Completed checkmark badge */}
        {isCompleted && (
          <div
            className="absolute -top-1 -right-1 w-[16px] h-[16px] rounded-full flex items-center justify-center"
            style={{
              backgroundColor: '#166534',
              border: '2px solid white',
            }}
          >
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path
                d="M1 3L3 5L7 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        {/* Selected badge (only show if not completed) */}
        {isSelected && !isFocused && !isCompleted && (
          <div
            className="absolute -top-1 -right-1 w-[14px] h-[14px] rounded-full flex items-center justify-center"
            style={{
              backgroundColor: '#0061AA',
              border: '2px solid white',
            }}
          >
            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
              <path
                d="M1 3L3 5L7 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        {score}
      </div>
      <div
        className="w-0 h-0 -mt-px"
        style={{
          borderLeft: `${arrowSize} solid transparent`,
          borderRight: `${arrowSize} solid transparent`,
          borderTop: `${arrowSize} solid ${pinBg}`,
        }}
      />
    </div>
  )
}

interface SimplePinProps {
  score: number
}

/**
 * Simple circular pin for Google Maps (used in TerritoryMap)
 * Use as a child of OverlayView
 */
export function SimplePin({ score }: SimplePinProps) {
  const color = getScorePinColor(score)
  const { bg } = PIN_COLORS[color]

  return (
    <div
      className="w-3 h-3 rounded-full"
      style={{
        backgroundColor: bg,
        border: '2px solid white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

/**
 * User location marker (blue dot) for Google Maps
 * Use as a child of OverlayView
 */
export function UserLocationMarker() {
  return (
    <div
      className="w-4 h-4 rounded-full"
      style={{
        backgroundColor: '#0061AA',
        border: '3px solid white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}
