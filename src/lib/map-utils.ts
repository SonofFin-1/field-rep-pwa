import L from 'leaflet'
import { SCORE_THRESHOLDS } from './constants'

export type PinColor = 'green' | 'yellow' | 'grey' | 'unscored'

export function getScorePinColor(score: number | null): PinColor {
  if (score === null) return 'unscored'
  if (score >= SCORE_THRESHOLDS.EXCELLENT) return 'green'
  if (score >= SCORE_THRESHOLDS.GREAT) return 'yellow'
  return 'grey'
}

const PIN_COLORS = {
  green: { bg: '#166534', text: '#FFFFFF' },
  yellow: { bg: '#C08703', text: '#FFFFFF' },
  grey: { bg: '#778188', text: '#FFFFFF' },
  unscored: { bg: '#F87171', text: '#FFFFFF' },  // Light red for unscored
}

export function createScorePin(score: number, isSelected = false): L.DivIcon {
  const color = getScorePinColor(score)
  const { bg, text } = PIN_COLORS[color]
  const borderColor = isSelected ? '#0061AA' : bg

  // Checkmark SVG for selected state
  const checkmarkBadge = isSelected
    ? `<div style="
        position: absolute;
        top: -4px;
        right: -4px;
        width: 14px;
        height: 14px;
        background-color: #0061AA;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
      ">
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 3L3 5L7 1" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>`
    : ''

  const html = `
    <div style="
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      pointer-events: auto;
    ">
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 32px;
        height: 24px;
        padding: 0 8px;
        background-color: ${bg};
        color: ${text};
        font-size: 12px;
        font-weight: 600;
        border-radius: 12px;
        border: 2px solid ${borderColor};
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        cursor: pointer;
      ">
        ${checkmarkBadge}
        ${score}
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid ${bg};
        margin-top: -1px;
      "></div>
    </div>
  `

  return L.divIcon({
    html,
    className: 'custom-score-pin',
    iconSize: [40, 34],
    iconAnchor: [20, 34],
  })
}

export function createUserLocationIcon(): L.DivIcon {
  const html = `
    <div style="
      width: 16px;
      height: 16px;
      background-color: #0061AA;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>
  `

  return L.divIcon({
    html,
    className: 'user-location-pin',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

// Territory boundary coordinates (approximate for demo)
// Leaflet format: [lat, lng][]
export const TERRITORY_BOUNDARY: [number, number][] = [
  [44.95, -93.40],
  [44.95, -93.25],
  [44.83, -93.25],
  [44.83, -93.40],
  [44.95, -93.40],
]

// Google Maps format: { lat, lng }[]
export const TERRITORY_BOUNDARY_GOOGLE: google.maps.LatLngLiteral[] = [
  { lat: 44.95, lng: -93.40 },
  { lat: 44.95, lng: -93.25 },
  { lat: 44.83, lng: -93.25 },
  { lat: 44.83, lng: -93.40 },
  { lat: 44.95, lng: -93.40 },
]

// User's current location (for demo)
export const USER_LOCATION = { lat: 44.88, lng: -93.37 }

/**
 * Generate a random location within the territory boundary
 * Uses the TERRITORY_BOUNDARY defined above (rectangular area)
 */
export function generateRandomLocationInTerritory(): { lat: number; lng: number } {
  // Territory bounds from TERRITORY_BOUNDARY
  const minLat = 44.83
  const maxLat = 44.95
  const minLng = -93.40
  const maxLng = -93.25

  const lat = minLat + Math.random() * (maxLat - minLat)
  const lng = minLng + Math.random() * (maxLng - minLng)

  return { lat, lng }
}

// Export PIN_COLORS for Google Maps marker components
export { PIN_COLORS }
