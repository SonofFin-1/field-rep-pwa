import type { CalendarEvent } from './types'

// Get today's date in YYYY-MM-DD format
function getTodayKey(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Get yesterday's date in YYYY-MM-DD format
function getYesterdayKey(): string {
  const now = new Date()
  now.setDate(now.getDate() - 1)
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

const todayKey = getTodayKey()
const yesterdayKey = getYesterdayKey()

export const calendarEvents: CalendarEvent[] = [
  // Yesterday
  {
    id: 'cal-1',
    date: yesterdayKey,
    title: '9:00 AM Ashley Olsen...',
    type: 'home_assessment',
    time: '9:00 AM',
  },
  {
    id: 'cal-2',
    date: yesterdayKey,
    title: '10:30 AM Peter Johnson',
    type: 'appointment',
    time: '10:30 AM',
  },
  // Today (current day)
  {
    id: 'cal-3',
    date: todayKey,
    title: '9:00 AM Sarah Mitchell',
    type: 'appointment',
    time: '9:00 AM',
  },
  {
    id: 'cal-4',
    date: todayKey,
    title: '11:00 AM Nancy Williams',
    type: 'appointment',
    time: '11:00 AM',
  },
  // March 5
  {
    id: 'cal-5',
    date: '2026-03-05',
    title: 'Plan • 4 Stops',
    type: 'plan',
    stops: 4,
  },
  // March 9
  {
    id: 'cal-6',
    date: '2026-03-09',
    title: '9:00 AM Michelle Garcia',
    type: 'appointment',
    time: '9:00 AM',
  },
  {
    id: 'cal-7',
    date: '2026-03-09',
    title: 'Plan • 3 Stops',
    type: 'plan',
    stops: 3,
  },
  // March 11
  {
    id: 'cal-8',
    date: '2026-03-11',
    title: '9:00 AM Robert Smith',
    type: 'appointment',
    time: '9:00 AM',
  },
  {
    id: 'cal-9',
    date: '2026-03-11',
    title: '10:30 AM Kevin Brown',
    type: 'home_assessment',
    time: '10:30 AM',
  },
  {
    id: 'cal-10',
    date: '2026-03-11',
    title: 'Extra Event',
    type: 'appointment',
    time: '2:00 PM',
  },
  // March 13
  {
    id: 'cal-11',
    date: '2026-03-13',
    title: '9:00 AM Jennifer Davis',
    type: 'appointment',
    time: '9:00 AM',
  },
  // March 17
  {
    id: 'cal-12',
    date: '2026-03-17',
    title: '9:00 AM Jessica Rodriguez',
    type: 'appointment',
    time: '9:00 AM',
  },
  // March 19
  {
    id: 'cal-13',
    date: '2026-03-19',
    title: '9:00 AM Lisa Wilson',
    type: 'appointment',
    time: '9:00 AM',
  },
  {
    id: 'cal-14',
    date: '2026-03-19',
    title: '10:30 AM David Martinez',
    type: 'appointment',
    time: '10:30 AM',
  },
  {
    id: 'cal-15',
    date: '2026-03-19',
    title: 'Extra Event',
    type: 'appointment',
    time: '2:00 PM',
  },
  // March 20
  {
    id: 'cal-16',
    date: '2026-03-20',
    title: '9:00 AM Karen Anderson',
    type: 'appointment',
    time: '9:00 AM',
  },
  {
    id: 'cal-17',
    date: '2026-03-20',
    title: '10:30 AM Thomas Taylor',
    type: 'home_assessment',
    time: '10:30 AM',
  },
  // March 23
  {
    id: 'cal-18',
    date: '2026-03-23',
    title: '9:00 AM Angela Moore',
    type: 'home_assessment',
    time: '9:00 AM',
  },
  {
    id: 'cal-19',
    date: '2026-03-23',
    title: '10:30 AM Richard Jackson',
    type: 'appointment',
    time: '10:30 AM',
  },
  {
    id: 'cal-20',
    date: '2026-03-23',
    title: 'Extra Event',
    type: 'appointment',
    time: '2:00 PM',
  },
  // March 25
  {
    id: 'cal-21',
    date: '2026-03-25',
    title: '9:00 AM Kimberly White',
    type: 'appointment',
    time: '9:00 AM',
  },
]
