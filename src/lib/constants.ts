// Design tokens
export const COLORS = {
  primary: '#0061AA',
  charcoal: '#46494B',
  lightGrey: '#778188',
  offWhite: '#F0F5F7',
  stroke: '#DFEBF4',
  background: '#F8FAFC',

  // Score colors
  scoreGreen: { bg: '#DCFCE7', text: '#166534' },
  scoreYellow: { bg: '#FFFACC', text: '#C08703' },
  scoreGrey: { bg: '#F0F5F7', text: '#778188' },

  // Status colors
  statusNew: { bg: '#DBEAFE', text: '#1E40AF' },
  statusReturning: { bg: '#EBDBFE', text: '#311EAF' },

  // KPI icon backgrounds
  kpiYellow: '#FEF3C7',
  kpiPurple: '#F3E8FF',
  kpiGreen: '#DCFCE7',

  // Avatar
  avatarBg: '#F4EDDF',
  avatarText: '#AA3300',
} as const

// Score thresholds
export const SCORE_THRESHOLDS = {
  EXCELLENT: 85, // >= 85 is green
  GREAT: 70,     // 70-84 is yellow
  // < 70 is grey
} as const

// Viewport
export const VIEWPORT = {
  width: 1336,
  height: 1024,
} as const

// Sidebar
export const SIDEBAR_WIDTH = 70

// Map defaults
export const MAP_CONFIG = {
  center: { lat: 44.88, lng: -93.35 },
  zoom: 12,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
} as const

// Activity types
export const ACTIVITY_TYPES = {
  visit: 'visit',
  notes: 'notes',
  lead_assigned: 'lead_assigned',
  plan_completed: 'plan_completed',
  call: 'call',
} as const

// Calendar event types
export const CALENDAR_EVENT_TYPES = {
  appointment: 'appointment',
  home_assessment: 'home_assessment',
  plan: 'plan',
} as const

// Daily planning targets
export const PLANNING_TARGETS = {
  CLIENTS_PER_DAY: 10,
  WORK_START_HOUR: 8,
  WORK_END_HOUR: 18,
  CLIENT_DURATION_MIN: 30,
  COMMUTE_DURATION_MIN: 15,
} as const
