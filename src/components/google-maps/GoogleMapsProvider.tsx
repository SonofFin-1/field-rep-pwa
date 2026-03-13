import { useJsApiLoader } from '@react-google-maps/api'
import type { ReactNode } from 'react'

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

const libraries: ('places' | 'geometry' | 'drawing' | 'visualization')[] = []

interface GoogleMapsProviderProps {
  children: ReactNode
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  })

  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'your_api_key_here') {
    return (
      <div className="flex items-center justify-center h-full bg-[#F0F5F7] text-[#778188]">
        <div className="text-center p-8">
          <p className="text-lg font-semibold mb-2">Google Maps API Key Required</p>
          <p className="text-sm">
            Add your API key to <code className="bg-white px-2 py-1 rounded">.env</code> file:
          </p>
          <pre className="mt-2 bg-white p-3 rounded text-xs text-left">
            VITE_GOOGLE_MAPS_API_KEY=your_key_here
          </pre>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-[#F0F5F7] text-[#778188]">
        <p>Error loading Google Maps</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-[#F0F5F7] text-[#778188]">
        <p>Loading map...</p>
      </div>
    )
  }

  return <>{children}</>
}
