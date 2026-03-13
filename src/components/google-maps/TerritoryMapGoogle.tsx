import { useMemo, useState } from 'react'
import { GoogleMap, OverlayView, Polygon } from '@react-google-maps/api'
import { Card } from '@/components/shared/Card'
import { ChevronRight, X } from 'lucide-react'
import { useLeads } from '@/hooks/useLeads'
import { MAP_CONFIG } from '@/lib/constants'
import { TERRITORY_BOUNDARY_GOOGLE } from '@/lib/map-utils'
import { SimplePin } from './MapMarkers'
import { GoogleMapsProvider } from './GoogleMapsProvider'

const mapContainerStyle = {
  width: '100%',
  height: '220px',
}

const expandedMapContainerStyle = {
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

const expandedMapOptions: google.maps.MapOptions = {
  ...mapOptions,
  zoomControl: true,
}

function TerritoryMapContent() {
  const { mapLeads } = useLeads()
  const [isExpanded, setIsExpanded] = useState(false)

  // Use fixed counts from design (82 Excellent, 178 Great)
  const excellentCount = 82
  const greatCount = 178

  const center = useMemo(
    () => ({ lat: MAP_CONFIG.center.lat, lng: MAP_CONFIG.center.lng }),
    []
  )

  const mapContent = (
    <GoogleMap
      mapContainerStyle={isExpanded ? expandedMapContainerStyle : mapContainerStyle}
      center={center}
      zoom={MAP_CONFIG.zoom}
      options={isExpanded ? expandedMapOptions : mapOptions}
    >
      {/* Territory boundary */}
      <Polygon
        paths={TERRITORY_BOUNDARY_GOOGLE}
        options={{
          strokeColor: '#0061AA',
          strokeWeight: 2,
          strokeOpacity: 1,
          fillColor: '#0061AA',
          fillOpacity: 0.05,
        }}
      />

      {/* Lead pins */}
      {mapLeads.map(lead => (
        <OverlayView
          key={lead.id}
          position={{ lat: lead.lat, lng: lead.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <SimplePin score={lead.score} />
        </OverlayView>
      ))}
    </GoogleMap>
  )

  // Expanded modal view
  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFEBF4]">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-[#46494B]">Your territory</h2>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm text-[#46494B]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#166534]" />
              <span>{excellentCount} Excellent Leads</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C08703]" />
              <span>{greatCount} Great Leads</span>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-[#F0F5F7] rounded-full transition-colors ml-4"
            >
              <X className="w-5 h-5 text-[#46494B]" />
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1">
          {mapContent}
        </div>
      </div>
    )
  }

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <h2 className="text-lg font-semibold text-[#46494B]">Your territory</h2>
          <ChevronRight className="w-5 h-5 text-[#46494B]" />
        </button>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm text-[#46494B]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#166534]" />
            <span>{excellentCount} Excellent Leads</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C08703]" />
            <span>{greatCount} Great Leads</span>
          </div>
        </div>
      </div>

      {/* Map container */}
      {mapContent}
    </Card>
  )
}

/**
 * Google Maps version of TerritoryMap
 * Swap this in place of the Leaflet TerritoryMap when ready
 */
export function TerritoryMapGoogle() {
  return (
    <GoogleMapsProvider>
      <TerritoryMapContent />
    </GoogleMapsProvider>
  )
}
