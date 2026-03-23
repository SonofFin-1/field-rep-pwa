import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Card } from '@/components/shared/Card'
import { ChevronRight } from 'lucide-react'
import { useLeads } from '@/hooks/useLeads'
import { MAP_CONFIG, SCORE_THRESHOLDS } from '@/lib/constants'
import { TERRITORY_BOUNDARY } from '@/lib/map-utils'

// Pin styles for different score levels
function createSimplePin(score: number): L.DivIcon {
  let bgColor: string
  if (score >= SCORE_THRESHOLDS.EXCELLENT) {
    bgColor = '#166534' // Dark green
  } else if (score >= SCORE_THRESHOLDS.GREAT) {
    bgColor = '#C08703' // Yellow/amber
  } else {
    bgColor = '#778188' // Grey
  }

  const html = `
    <div style="
      width: 16px;
      height: 16px;
      background-color: ${bgColor};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>
  `

  return L.divIcon({
    html,
    className: 'simple-map-pin',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export function TerritoryMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const { allLeads } = useLeads()

  // Count leads by score category
  const excellentCount = allLeads.filter(l => l.score >= SCORE_THRESHOLDS.EXCELLENT).length
  const greatCount = allLeads.filter(l => l.score >= SCORE_THRESHOLDS.GREAT && l.score < SCORE_THRESHOLDS.EXCELLENT).length

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [MAP_CONFIG.center.lat, MAP_CONFIG.center.lng],
      zoom: MAP_CONFIG.zoom,
      zoomControl: false,
      attributionControl: false,
    })

    mapInstanceRef.current = map

    // Add tile layer
    L.tileLayer(MAP_CONFIG.tileUrl, {
      attribution: MAP_CONFIG.attribution,
    }).addTo(map)

    // Add territory boundary
    L.polygon(TERRITORY_BOUNDARY, {
      color: '#0061AA',
      weight: 2,
      fillColor: '#0061AA',
      fillOpacity: 0.05,
      dashArray: '5, 5',
    }).addTo(map)

    // Add lead pins for all listed leads
    allLeads.forEach(lead => {
      const marker = L.marker([lead.lat, lead.lng], {
        icon: createSimplePin(lead.score),
      })
      marker.addTo(map)
    })

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [allLeads])

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <Link to="/planner" className="flex items-center gap-1 cursor-pointer hover:opacity-80">
          <h2 className="text-lg font-semibold text-[#46494B]">Your territory</h2>
          <ChevronRight className="w-5 h-5 text-[#46494B]" />
        </Link>

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
      <div ref={mapRef} className="w-full h-[220px]" />
    </Card>
  )
}
