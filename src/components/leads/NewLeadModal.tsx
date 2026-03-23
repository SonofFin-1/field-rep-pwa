import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Lead } from '@/data/types'

interface NewLeadModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateLead: (lead: Lead) => void
  userLocation: { lat: number; lng: number }
}

// Street names for generating nearby addresses
const streetNames = [
  'Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Washington', 'Lake',
  'Hill', 'Walnut', 'Spring', 'Park', 'River', 'Forest', 'Sunset', 'Ridge',
]
const streetTypes = ['St', 'Ave', 'Blvd', 'Dr', 'Ln', 'Way']

function generateNearbyAddress(userLat: number, userLng: number): {
  address: string
  city: string
  state: string
  zip: string
  lat: number
  lng: number
} {
  // Generate a location within ~0.5 miles of user
  const latOffset = (Math.random() - 0.5) * 0.015
  const lngOffset = (Math.random() - 0.5) * 0.015
  const lat = userLat + latOffset
  const lng = userLng + lngOffset

  // Generate a realistic-looking address
  const streetNum = Math.floor(Math.random() * 9000) + 1000
  const streetName = streetNames[Math.floor(Math.random() * streetNames.length)]
  const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)]
  const address = `${streetNum} ${streetName} ${streetType}`

  // Determine city/zip based on approximate location
  const cities = [
    { name: 'Edina', zip: '55410', latRange: [44.85, 44.92], lngRange: [-93.40, -93.32] },
    { name: 'Minneapolis', zip: '55408', latRange: [44.92, 45.0], lngRange: [-93.35, -93.25] },
    { name: 'Bloomington', zip: '55420', latRange: [44.80, 44.86], lngRange: [-93.35, -93.28] },
    { name: 'St. Louis Park', zip: '55416', latRange: [44.92, 44.98], lngRange: [-93.40, -93.35] },
  ]

  // Find best matching city or default to Edina
  const matchingCity = cities.find(
    c =>
      lat >= c.latRange[0] &&
      lat <= c.latRange[1] &&
      lng >= c.lngRange[0] &&
      lng <= c.lngRange[1]
  ) || { name: 'Edina', zip: '55410' }

  return {
    address,
    city: matchingCity.name,
    state: 'MN',
    zip: matchingCity.zip,
    lat,
    lng,
  }
}

export function NewLeadModal({
  isOpen,
  onClose,
  onCreateLead,
  userLocation,
}: NewLeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'MN',
    zip: '',
    notes: '',
  })
  const [generatedLocation, setGeneratedLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  // Generate nearby address when modal opens
  useEffect(() => {
    if (isOpen) {
      const nearbyAddr = generateNearbyAddress(userLocation.lat, userLocation.lng)
      setFormData(f => ({
        ...f,
        address: nearbyAddr.address,
        city: nearbyAddr.city,
        state: nearbyAddr.state,
        zip: nearbyAddr.zip,
      }))
      setGeneratedLocation({ lat: nearbyAddr.lat, lng: nearbyAddr.lng })
    }
  }, [isOpen, userLocation])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      return
    }

    // Create new lead with null score (unscored)
    const newLead: Lead = {
      id: `user-lead-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: formData.phone.trim() || '612-555-0000',
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      score: null, // Unscored lead
      value: 0,
      status: 'New',
      lat: generatedLocation?.lat || userLocation.lat,
      lng: generatedLocation?.lng || userLocation.lng,
      notes: formData.notes.trim() || undefined,
      isUserCreated: true,
    }

    onCreateLead(newLead)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: 'MN',
      zip: '',
      notes: '',
    })
    setGeneratedLocation(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#DFEBF4]">
          <h2 className="text-lg font-semibold text-[#46494B]">Add New Lead</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F0F5F7] transition-colors"
          >
            <X className="w-5 h-5 text-[#778188]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
              placeholder="Enter name"
              required
              className="w-full px-3 py-2.5 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
              placeholder="email@example.com"
              className="w-full px-3 py-2.5 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))}
              placeholder="612-555-0000"
              className="w-full px-3 py-2.5 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-1">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData(f => ({ ...f, address: e.target.value }))}
              placeholder="123 Main St"
              className="w-full px-3 py-2.5 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
            />
            <p className="text-xs text-[#778188] mt-1">
              Auto-filled with a nearby address
            </p>
          </div>

          {/* City, State, Zip Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-[#46494B] mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData(f => ({ ...f, city: e.target.value }))}
                className="w-full px-3 py-2.5 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#46494B] mb-1">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={e => setFormData(f => ({ ...f, state: e.target.value }))}
                className="w-full px-3 py-2.5 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#46494B] mb-1">
                Zip
              </label>
              <input
                type="text"
                value={formData.zip}
                onChange={e => setFormData(f => ({ ...f, zip: e.target.value }))}
                className="w-full px-3 py-2.5 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#46494B] mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
              placeholder="Add any notes about this lead..."
              rows={3}
              className="w-full px-3 py-2.5 border border-[#DFEBF4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent resize-none"
            />
          </div>

          {/* Info notice */}
          <div className="bg-[#FEE2E2] rounded-lg p-3">
            <p className="text-sm text-[#DC2626]">
              This lead will be created without a conversion score and marked with a "?" on the map.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-[#DFEBF4] text-[#46494B] rounded-full hover:bg-[#F0F5F7] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-[#0061AA] text-white rounded-full hover:bg-[#004d88] transition-colors font-medium"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
