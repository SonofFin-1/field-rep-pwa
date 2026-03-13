import { useState, useCallback } from 'react'
import { USER_LOCATION } from '@/lib/map-utils'

interface Waypoint {
  lat: number
  lng: number
}

interface RouteResult {
  coordinates: [number, number][]
  totalDistance: number // in meters
  totalTime: number // in seconds
}

interface UseRouteResult {
  route: RouteResult | null
  loading: boolean
  error: string | null
  calculateRoute: (waypoints: Waypoint[]) => Promise<void>
  clearRoute: () => void
}

/**
 * Hook for calculating driving routes using OSRM (free, no API key needed)
 */
export function useRoute(): UseRouteResult {
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculateRoute = useCallback(async (waypoints: Waypoint[]) => {
    if (waypoints.length === 0) {
      setRoute(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Build coordinates string: lon,lat;lon,lat;...
      // Start from user location, then all waypoints
      const allPoints = [
        { lat: USER_LOCATION.lat, lng: USER_LOCATION.lng },
        ...waypoints,
      ]

      const coordsString = allPoints
        .map(p => `${p.lng},${p.lat}`)
        .join(';')

      // Use OSRM demo server (free, no API key)
      // For production, you'd want to self-host or use a paid service
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`
      )

      if (!response.ok) {
        throw new Error('Failed to calculate route')
      }

      const data = await response.json()

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('No route found')
      }

      const routeData = data.routes[0]

      // Convert GeoJSON coordinates [lng, lat] to Leaflet format [lat, lng]
      const coordinates: [number, number][] = routeData.geometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
      )

      setRoute({
        coordinates,
        totalDistance: routeData.distance,
        totalTime: routeData.duration,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate route')
      setRoute(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearRoute = useCallback(() => {
    setRoute(null)
    setError(null)
  }, [])

  return {
    route,
    loading,
    error,
    calculateRoute,
    clearRoute,
  }
}
