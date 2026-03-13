# Field Rep iPad PWA - Project Rules

## Overview
iPad PWA for ADT field sales reps. Viewport: 1336x1024 landscape. Greenfield with mock data.

## Design Tokens

### Colors
```
Primary Blue:     #0061AA
Charcoal:         #46494B
Light Grey:       #778188
Off White:        #F0F5F7
Stroke:           #DFEBF4
Background:       #F8FAFC

// Score Colors (Conversion Score)
Score Green:      bg: #DCFCE7, text: #166534
Score Yellow:     bg: #FFFACC, text: #C08703
Score Grey:       bg: #F0F5F7, text: #778188

// Status Tag Colors
New:              bg: #DBEAFE, text: #1E40AF
Returning:        bg: #EBDBFE, text: #311EAF

// KPI Icon Backgrounds
Yellow (leads):   #FEF3C7
Purple (visits):  #F3E8FF
Green (sales):    #DCFCE7

// Avatar
Avatar BG:        #F4EDDF
Avatar Text:      #AA3300
```

### Score Thresholds
- Excellent (green with checkmark): score >= 85
- Great (yellow with checkmark): score 70-84
- Low (grey, no checkmark): score < 70

### Typography
- Font Family: Inter (Google Fonts: 400, 400i, 600, 700)
- Headings: Inter SemiBold (#46494B)
- Body: Inter Regular (#46494B or #778188)
- Links/Names in activity: #0061AA

### Spacing & Layout
- Sidebar width: 70px
- Main padding: px-[80px] pt-4
- Card border-radius: 14px (rounded-[14px])
- Pill buttons: rounded-full
- Card border: 1px solid #DFEBF4

### Component Contracts

**StatusTag**
- Props: `status: 'New' | 'Returning'`
- New: blue pill (#1E40AF on #DBEAFE)
- Returning: purple pill (#311EAF on #EBDBFE)

**ConversionScoreTag**
- Props: `score: number`
- Shows checkmark icon for scores >= 70
- Color based on thresholds above

**ContactActions**
- Native links: tel:, sms:, mailto:
- Icons: Phone, MessageSquare, Mail from lucide-react

**Card**
- White background, #DFEBF4 border, 14px radius

### Sidebar Navigation
- ADT logo at top (blue circle with "ADT")
- 4 nav icons: Home, Planner (map), Calendar, Leads (people)
- Active state: bg-[#F0F5F7] rounded-[30px]
- Inactive state: rounded-[12.75px]
- Avatar "MN" at bottom

## Import Conventions
```typescript
// Components
import { StatusTag } from '@/components/shared/StatusTag'
import { Card } from '@/components/shared/Card'

// Hooks
import { useLeads } from '@/hooks/useLeads'

// Data
import { leads } from '@/data/leads'

// Utils
import { cn, formatCurrency, getScoreColor } from '@/lib/utils'
```

## File Ownership (Parallel Build)
- Home: src/components/home/*, src/pages/HomePage.tsx
- Planner: src/components/planner/*, src/pages/PlannerPage.tsx
- Calendar: src/components/calendar/*, src/pages/CalendarPage.tsx
- Leads: src/components/leads/*, src/pages/LeadsPage.tsx

## Styling Rules
- Tailwind only, no inline styles, no CSS modules
- Use design tokens from constants.ts
- Match Figma pixel-perfect

## Icon Rules
- Lucide React for standard icons (Phone, Mail, MessageSquare, etc.)
- Custom SVGs in src/assets/icons/ for ADT logo, nav icons, KPI icons

## Map Configuration
- Leaflet + react-leaflet
- Center: Edina/Minneapolis (~44.88, -93.35)
- Zoom: ~12
- OpenStreetMap tiles (free)
- Custom DivIcon pins with score numbers
