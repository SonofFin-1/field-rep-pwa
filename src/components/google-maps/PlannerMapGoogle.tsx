import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import {
  GoogleMap,
  OverlayView,
  Polyline,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { MAP_CONFIG } from '@/lib/constants'
import { USER_LOCATION } from '@/lib/map-utils'
import { leads as allLeads } from '@/data/leads'
import { ScorePin, UserLocationMarker } from './MapMarkers'
import { MapPopup } from '@/components/planner/MapPopup'
import { GoogleMapsProvider } from './GoogleMapsProvider'
import { useDirections } from '@/hooks/useDirections'
import type { Lead } from '@/data/types'

interface PlannerMapGoogleProps {
  leads: Lead[]
  selectedLeadIds: Set<string>
  completedLeadIds?: Set<string>
  scheduledLeadIds?: Set<string>
  onSelectLead: (lead: Lead) => void
  onAddToPlan: (leadId: string) => void
  onViewDetails: (lead: Lead) => void
  routeCoordinates?: { lat: number; lng: number }[]
  showRoute?: boolean
  focusedLeadId?: string | null
  userLocation?: { lat: number; lng: number }
  showUpdateLocationButton?: boolean
  onUpdateLocation?: () => void
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
}

// Calculate territory boundary from all leads (with padding)
function calculateTerritoryBoundary(): google.maps.LatLngLiteral[] {
  if (allLeads.length === 0) return []

  let minLat = Infinity
  let maxLat = -Infinity
  let minLng = Infinity
  let maxLng = -Infinity

  allLeads.forEach(lead => {
    minLat = Math.min(minLat, lead.lat)
    maxLat = Math.max(maxLat, lead.lat)
    minLng = Math.min(minLng, lead.lng)
    maxLng = Math.max(maxLng, lead.lng)
  })

  // Add padding (about 0.01 degrees ~ 1km)
  const padding = 0.015
  minLat -= padding
  maxLat += padding
  minLng -= padding
  maxLng += padding

  // Return rectangle corners (clockwise)
  return [
    { lat: maxLat, lng: minLng }, // top-left
    { lat: maxLat, lng: maxLng }, // top-right
    { lat: minLat, lng: maxLng }, // bottom-right
    { lat: minLat, lng: minLng }, // bottom-left
    { lat: maxLat, lng: minLng }, // close the loop
  ]
}

// Pre-calculate the territory boundary
const TERRITORY_BOUNDARY = calculateTerritoryBoundary()

function PlannerMapContent({
  leads,
  selectedLeadIds,
  completedLeadIds = new Set(),
  scheduledLeadIds = new Set(),
  onSelectLead,
  onAddToPlan: _onAddToPlan,
  onViewDetails,
  routeCoordinates,
  showRoute = false,
  focusedLeadId,
  userLocation = USER_LOCATION,
  showUpdateLocationButton = false,
  onUpdateLocation,
}: PlannerMapGoogleProps) {
  const [activePopupId, setActivePopupId] = useState<string | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const { directions, calculateRoute, clearRoute } = useDirections()
  const lastFocusedIdRef = useRef<string | null>(null)

  const center = useMemo(
    () => ({ lat: MAP_CONFIG.center.lat, lng: MAP_CONFIG.center.lng }),
    []
  )

  // Create a stable key for route coordinates to avoid unnecessary recalculations
  const routeKey = routeCoordinates
    ? JSON.stringify(routeCoordinates.map(c => `${c.lat},${c.lng}`))
    : ''

  // Create a stable key for user location
  const userLocationKey = `${userLocation.lat},${userLocation.lng}`

  // Calculate directions when route should be shown
  useEffect(() => {
    console.log('[PlannerMap] Route effect:', { showRoute, routeKey, coordsLength: routeCoordinates?.length, userLocation })
    if (showRoute && routeCoordinates && routeCoordinates.length > 0) {
      calculateRoute(routeCoordinates, userLocation)
    } else {
      clearRoute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRoute, routeKey, userLocationKey]) // Use routeKey instead of routeCoordinates for stable comparison

  // Fit bounds when route coordinates change
  useEffect(() => {
    if (map && showRoute && routeCoordinates && routeCoordinates.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      routeCoordinates.forEach(coord => {
        bounds.extend({ lat: coord.lat, lng: coord.lng })
      })
      // Include user location
      bounds.extend({ lat: userLocation.lat, lng: userLocation.lng })
      map.fitBounds(bounds, 50)
    }
  }, [map, showRoute, routeCoordinates])

  // Pan to focused lead when viewing details
  useEffect(() => {
    // Skip if no map or no focused lead
    if (!map || !focusedLeadId) {
      lastFocusedIdRef.current = null
      return
    }

    // Skip if already focused on this lead
    if (lastFocusedIdRef.current === focusedLeadId) {
      return
    }

    // Use allLeads (stable import) instead of leads prop to avoid re-renders
    const lead = allLeads.find(l => l.id === focusedLeadId)
    if (lead) {
      lastFocusedIdRef.current = focusedLeadId

      // Use setCenter for instant move (no animation stuttering)
      const currentZoom = map.getZoom() || 12
      const targetZoom = currentZoom < 13 ? 13 : currentZoom

      // Set both center and zoom at once to avoid multiple render cycles
      map.setCenter({ lat: lead.lat, lng: lead.lng })
      if (currentZoom < 13) {
        map.setZoom(targetZoom)
      }
    }
  }, [map, focusedLeadId])

  const handleMarkerClick = useCallback((lead: Lead) => {
    setActivePopupId(lead.id)
    onSelectLead(lead)
  }, [onSelectLead])

  const handleViewDetails = useCallback((lead: Lead) => {
    onViewDetails(lead)
    setActivePopupId(null)
  }, [onViewDetails])

  const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
  }, [])

  return (
    <div className="flex-1 h-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={MAP_CONFIG.zoom}
        options={mapOptions}
        onLoad={handleMapLoad}
        onClick={() => setActivePopupId(null)}
      >
        {/* Territory boundary - encompasses all lead locations */}
        <Polyline
          path={TERRITORY_BOUNDARY}
          options={{
            strokeColor: '#0061AA',
            strokeWeight: 2,
            strokeOpacity: 0.5,
          }}
        />

        {/* User location */}
        <OverlayView
          position={{ lat: userLocation.lat, lng: userLocation.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <UserLocationMarker />
        </OverlayView>

        {/* Directions renderer for actual driving route */}
        {showRoute && directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#0061AA',
                strokeWeight: 4,
                strokeOpacity: 1,
              },
            }}
          />
        )}

        {/* Lead pins */}
        {leads.map((lead, index) => {
          const isSelected = selectedLeadIds.has(lead.id)
          const isFocused = focusedLeadId === lead.id
          const isCompleted = completedLeadIds.has(lead.id)
          const isScheduled = scheduledLeadIds.has(lead.id)
          // Show stop number when in route mode (1-indexed)
          const stopNumber = showRoute ? index + 1 : undefined
          return (
            <OverlayView
              key={lead.id}
              position={{ lat: lead.lat, lng: lead.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <ScorePin
                  score={lead.score}
                  isSelected={isSelected}
                  isFocused={isFocused}
                  isCompleted={isCompleted}
                  isScheduled={isScheduled}
                  stopNumber={stopNumber}
                  onClick={() => handleMarkerClick(lead)}
                />
                {/* Popup */}
                {activePopupId === lead.id && (
                  <div
                    className="absolute z-[9999]"
                    style={{
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: '10px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MapPopup
                      lead={lead}
                      onViewDetails={() => handleViewDetails(lead)}
                    />
                    {/* Popup arrow */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{
                        bottom: '-6px',
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: '8px solid white',
                      }}
                    />
                  </div>
                )}
              </div>
            </OverlayView>
          )
        })}
      </GoogleMap>

      {/* Update Location button */}
      {showUpdateLocationButton && onUpdateLocation && (
        <button
          type="button"
          onClick={onUpdateLocation}
          className="absolute top-4 left-4 px-4 py-2 bg-white text-[#0061AA] text-sm font-semibold rounded-full shadow-md border border-[#DFEBF4] hover:bg-[#F0F5F7] transition-colors z-10"
        >
          Update Location
        </button>
      )}

    </div>
  )
}

/**
 * Google Maps version of PlannerMap
 * Swap this in place of the Leaflet PlannerMap when ready
 */
export function PlannerMapGoogle(props: PlannerMapGoogleProps) {
  return (
    <GoogleMapsProvider>
      <PlannerMapContent {...props} />
    </GoogleMapsProvider>
  )
}
