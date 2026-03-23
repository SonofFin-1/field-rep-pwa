import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { MAP_CONFIG } from '@/lib/constants'
import {
  createScorePin,
  createUserLocationIcon,
  USER_LOCATION,
  TERRITORY_BOUNDARY,
} from '@/lib/map-utils'
import { MapPopup } from './MapPopup'
import type { Lead } from '@/data/types'
import 'leaflet/dist/leaflet.css'

interface PlannerMapProps {
  leads: Lead[]
  selectedLeadIds: Set<string>
  onSelectLead: (lead: Lead) => void
  onAddToPlan: (leadId: string) => void
  onViewDetails: (lead: Lead) => void
  routeCoordinates?: { lat: number; lng: number }[]
  routePath?: [number, number][] // Actual driving route path from OSRM
  showRoute?: boolean
}

// Component to handle map centering when route is shown
function MapController({ routePath }: { routePath?: [number, number][] }) {
  const map = useMap()

  useEffect(() => {
    if (routePath && routePath.length > 0) {
      map.fitBounds(routePath, { padding: [50, 50] })
    }
  }, [map, routePath])

  return null
}

export function PlannerMap({
  leads,
  selectedLeadIds,
  onSelectLead,
  onAddToPlan: _onAddToPlan,
  onViewDetails,
  routeCoordinates: _routeCoordinates,
  routePath,
  showRoute = false,
}: PlannerMapProps) {
  const [, setActivePopup] = useState<string | null>(null)
  const markerRefs = useRef<Map<string, L.Marker>>(new Map())

  const handleMarkerClick = (lead: Lead) => {
    setActivePopup(lead.id)
    onSelectLead(lead)
  }

  const handleViewDetails = (lead: Lead) => {
    onViewDetails(lead)
    setActivePopup(null)
  }

  return (
    <div className="flex-1 h-full relative">
      <MapContainer
        center={[MAP_CONFIG.center.lat, MAP_CONFIG.center.lng]}
        zoom={MAP_CONFIG.zoom}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          url={MAP_CONFIG.tileUrl}
          attribution={MAP_CONFIG.attribution}
        />

        <MapController routePath={showRoute ? routePath : undefined} />

        {/* Territory boundary */}
        <Polyline
          positions={TERRITORY_BOUNDARY}
          pathOptions={{
            color: '#0061AA',
            weight: 2,
            opacity: 0.5,
            dashArray: '5, 10',
          }}
        />

        {/* User location */}
        <Marker
          position={[USER_LOCATION.lat, USER_LOCATION.lng]}
          icon={createUserLocationIcon()}
        />

        {/* Route line when showing plan */}
        {showRoute && routePath && routePath.length > 1 && (
          <Polyline
            positions={routePath}
            pathOptions={{
              color: '#0061AA',
              weight: 5,
              opacity: 0.8,
            }}
          />
        )}

        {/* Lead pins */}
        {leads.map(lead => {
          const isSelected = selectedLeadIds.has(lead.id)
          return (
            <Marker
              key={lead.id}
              position={[lead.lat, lead.lng]}
              icon={createScorePin(lead.score ?? 0, isSelected)}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current.set(lead.id, ref)
                }
              }}
              eventHandlers={{
                click: () => handleMarkerClick(lead),
              }}
            >
              <Popup
                closeButton={false}
                className="custom-popup"
                offset={[120, -20]}
                autoPan={true}
                autoPanPadding={[50, 50]}
              >
                <MapPopup
                  lead={lead}
                  onViewDetails={() => handleViewDetails(lead)}
                />
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Planner label overlay */}
      {!showRoute && (
        <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 pointer-events-none">
          <span className="text-[#778188] text-lg font-medium opacity-60">Planner</span>
        </div>
      )}

      {/* Custom styles for popup */}
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 14px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          border: 1px solid #DFEBF4;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .custom-popup .leaflet-popup-tip-container {
          left: -10px;
          top: 50%;
          transform: translateY(-50%) rotate(90deg);
          width: 20px;
          height: 20px;
          margin: 0;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #DFEBF4;
          box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.05);
        }
        .custom-score-pin {
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          pointer-events: auto !important;
        }
        .custom-score-pin > div {
          pointer-events: auto !important;
          cursor: pointer !important;
        }
        .user-location-pin {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-marker-icon {
          pointer-events: auto !important;
        }
      `}</style>
    </div>
  )
}
