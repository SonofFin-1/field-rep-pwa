# Google Maps Components

Ready-to-use Google Maps components to replace the Leaflet maps.

## Prerequisites

1. **Google Cloud Console Setup:**
   - Create a project at [Google Cloud Console](https://console.cloud.google.com/)
   - Enable **Maps JavaScript API** and **Directions API**
   - Create an API key and restrict it to these APIs
   - Add HTTP referrer restrictions: `http://localhost:*`, `http://127.0.0.1:*`
   - Ensure billing is enabled (Google provides $200/month free credit)

2. **Add API Key to `.env`:**
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

## How to Swap

### Option 1: Swap TerritoryMap (Home Page)

In `src/components/home/TerritoryMap.tsx`:
```tsx
// Replace entire file content with:
export { TerritoryMapGoogle as TerritoryMap } from '@/components/google-maps'
```

Or change the import in `src/pages/HomePage.tsx`:
```tsx
// Before:
import { TerritoryMap } from '@/components/home/TerritoryMap'

// After:
import { TerritoryMapGoogle as TerritoryMap } from '@/components/google-maps'
```

### Option 2: Swap PlannerMap (Planner Page)

In `src/components/planner/index.ts`, change the export:
```tsx
// Before:
export { PlannerMap } from './PlannerMap'

// After:
export { PlannerMapGoogle as PlannerMap } from '@/components/google-maps'
```

Or update the import in `src/pages/PlannerPage.tsx`:
```tsx
// Before:
import { PlannerMap } from '@/components/planner'

// After:
import { PlannerMapGoogle as PlannerMap } from '@/components/google-maps'
```

### Option 3: Remove Leaflet Entirely

Once you've verified Google Maps works:

```bash
npm uninstall leaflet react-leaflet @types/leaflet
```

Then remove the CSS import from `src/main.tsx`:
```tsx
// Remove this line:
import 'leaflet/dist/leaflet.css'
```

## Components Available

| Component | Description |
|-----------|-------------|
| `GoogleMapsProvider` | Wrapper that loads the Google Maps script |
| `TerritoryMapGoogle` | Drop-in replacement for TerritoryMap |
| `PlannerMapGoogle` | Drop-in replacement for PlannerMap with Directions support |
| `ScorePin` | Score marker component (with selection state) |
| `SimplePin` | Simple circular marker |
| `UserLocationMarker` | Blue user location dot |

## Hook

| Hook | Description |
|------|-------------|
| `useDirections` | Calculate driving routes between waypoints |

## Notes

- Google Maps uses `{ lat, lng }` format vs Leaflet's `[lat, lng]` arrays
- The `TERRITORY_BOUNDARY_GOOGLE` constant in `map-utils.ts` provides Google-format coordinates
- Directions automatically optimizes waypoint order for shortest route
- If no API key is configured, a helpful message is displayed
