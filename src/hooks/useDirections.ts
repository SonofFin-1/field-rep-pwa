import { useState, useCallback, useRef } from 'react'
import { USER_LOCATION } from '@/lib/map-utils'

interface Waypoint {
  lat: number
  lng: number
}

interface UseDirectionsResult {
  directions: google.maps.DirectionsResult | null
  loading: boolean
  error: string | null
  calculateRoute: (waypoints: Waypoint[], userLocation?: Waypoint) => void
  clearRoute: () => void
}

/**
 * Hook for calculating driving directions using Google Maps Directions API
 *
 * Usage:
 * const { directions, loading, error, calculateRoute, clearRoute } = useDirections()
 *
 * // Calculate route when leads are selected
 * useEffect(() => {
 *   if (selectedLeads.length > 0) {
 *     calculateRoute(selectedLeads.map(l => ({ lat: l.lat, lng: l.lng })))
 *   } else {
 *     clearRoute()
 *   }
 * }, [selectedLeads, calculateRoute, clearRoute])
 *
 * // Render with DirectionsRenderer
 * {directions && <DirectionsRenderer directions={directions} />}
 */
export function useDirections(): UseDirectionsResult {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null)

  const calculateRoute = useCallback((waypoints: Waypoint[], userLocation?: Waypoint) => {
    if (waypoints.length === 0) {
      console.log('[Directions] No waypoints provided')
      setDirections(null)
      return
    }

    // Check if Google Maps is loaded
    if (!window.google?.maps) {
      console.error('[Directions] Google Maps not loaded')
      setError('Google Maps not loaded')
      return
    }

    // Create DirectionsService if not exists
    if (!directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService()
    }

    setLoading(true)
    setError(null)

    // Origin is user location (use provided or default)
    const originLocation = userLocation || USER_LOCATION
    const origin = new google.maps.LatLng(originLocation.lat, originLocation.lng)

    // Destination is the last waypoint
    const dest = waypoints[waypoints.length - 1]
    const destination = new google.maps.LatLng(dest.lat, dest.lng)

    // Intermediate waypoints (all except the last one)
    const intermediateWaypoints = waypoints.slice(0, -1).map(wp => ({
      location: new google.maps.LatLng(wp.lat, wp.lng),
      stopover: true,
    }))

    console.log('[Directions] Calculating route:', {
      origin: originLocation,
      destination: dest,
      waypointCount: intermediateWaypoints.length,
    })

    directionsServiceRef.current.route(
      {
        origin,
        destination,
        waypoints: intermediateWaypoints,
        optimizeWaypoints: false, // Keep order as user selected
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setLoading(false)
        console.log('[Directions] Result:', status, result)
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result)
        } else {
          console.error('[Directions] Failed:', status)
          setError(`Directions request failed: ${status}`)
          setDirections(null)
        }
      }
    )
  }, [])

  const clearRoute = useCallback(() => {
    setDirections(null)
    setError(null)
  }, [])

  return {
    directions,
    loading,
    error,
    calculateRoute,
    clearRoute,
  }
}
