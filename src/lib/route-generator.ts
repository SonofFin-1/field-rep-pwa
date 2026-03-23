import type { Lead } from '@/data/types'
import { USER_LOCATION } from './map-utils'

interface Coordinates {
  lat: number
  lng: number
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function haversineDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRadians(coord2.lat - coord1.lat)
  const dLng = toRadians(coord2.lng - coord1.lng)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

interface LeadWithScore {
  lead: Lead
  distance: number
  compositeScore: number
}

/**
 * Calculate composite score for a lead
 * 50% proximity weight + 50% conversion score weight
 */
function calculateCompositeScore(
  lead: Lead,
  userLocation: Coordinates,
  maxDistance: number
): LeadWithScore {
  const distance = haversineDistance(userLocation, { lat: lead.lat, lng: lead.lng })

  // Normalize proximity (closer = higher score)
  const normalizedProximity = maxDistance > 0 ? 1 - distance / maxDistance : 1

  // Normalize conversion score (0-100 -> 0-1)
  // For unscored leads (null), treat as 0 for route generation
  const normalizedScore = (lead.score ?? 0) / 100

  // Composite score: 50% proximity + 50% conversion
  const compositeScore = normalizedProximity * 0.5 + normalizedScore * 0.5

  return {
    lead,
    distance,
    compositeScore,
  }
}

/**
 * Optimize route order using nearest-neighbor algorithm
 * Starts from user location, always visits the closest unvisited stop
 */
function optimizeRouteOrder(leads: Lead[], startLocation: Coordinates): Lead[] {
  if (leads.length <= 1) return leads

  const optimized: Lead[] = []
  const remaining = [...leads]
  let currentLocation = startLocation

  while (remaining.length > 0) {
    // Find nearest unvisited lead
    let nearestIndex = 0
    let nearestDistance = Infinity

    for (let i = 0; i < remaining.length; i++) {
      const distance = haversineDistance(currentLocation, {
        lat: remaining[i].lat,
        lng: remaining[i].lng,
      })
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = i
      }
    }

    // Add nearest to route and update current location
    const nearest = remaining.splice(nearestIndex, 1)[0]
    optimized.push(nearest)
    currentLocation = { lat: nearest.lat, lng: nearest.lng }
  }

  return optimized
}

export interface GenerateRouteOptions {
  stopCount?: number
  userLocation?: Coordinates
  excludeLeadIds?: Set<string>
}

/**
 * Generate an optimal route of leads based on proximity and conversion score
 *
 * Algorithm:
 * 1. Calculate distance from user location to each lead
 * 2. Score each lead: 50% proximity + 50% conversion score
 * 3. Select top N leads by composite score
 * 4. Reorder using nearest-neighbor (start from user, always go to closest)
 */
export function generateOptimalRoute(
  availableLeads: Lead[],
  options?: GenerateRouteOptions
): Lead[] {
  const stopCount = options?.stopCount ?? 10
  const userLocation = options?.userLocation ?? USER_LOCATION
  const excludeLeadIds = options?.excludeLeadIds ?? new Set<string>()

  // Filter out excluded leads (e.g., already completed stops)
  const eligibleLeads = availableLeads.filter(
    (lead) => !excludeLeadIds.has(lead.id)
  )

  if (eligibleLeads.length === 0) return []

  // Calculate distances to find max distance for normalization
  const distances = eligibleLeads.map((lead) =>
    haversineDistance(userLocation, { lat: lead.lat, lng: lead.lng })
  )
  const maxDistance = Math.max(...distances)

  // Calculate composite scores for all leads
  const scoredLeads = eligibleLeads.map((lead) =>
    calculateCompositeScore(lead, userLocation, maxDistance)
  )

  // Sort by composite score (highest first) and take top N
  scoredLeads.sort((a, b) => b.compositeScore - a.compositeScore)
  const topLeads = scoredLeads.slice(0, stopCount).map((s) => s.lead)

  // Optimize the route order using nearest-neighbor
  return optimizeRouteOrder(topLeads, userLocation)
}
