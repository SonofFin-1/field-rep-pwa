import { SCORE_THRESHOLDS, COLORS } from './constants'

/**
 * Merge class names with clsx-like behavior
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Get score color configuration based on score value
 */
export function getScoreColor(score: number | null): {
  bg: string
  text: string
  showCheckmark: boolean
  level: 'excellent' | 'great' | 'low' | 'unscored'
} {
  // Handle unscored leads
  if (score === null) {
    return {
      bg: '#FEE2E2',  // Light red background
      text: '#DC2626',  // Red text
      showCheckmark: false,
      level: 'unscored',
    }
  }

  if (score >= SCORE_THRESHOLDS.EXCELLENT) {
    return {
      bg: COLORS.scoreGreen.bg,
      text: COLORS.scoreGreen.text,
      showCheckmark: true,
      level: 'excellent',
    }
  }
  if (score >= SCORE_THRESHOLDS.GREAT) {
    return {
      bg: COLORS.scoreYellow.bg,
      text: COLORS.scoreYellow.text,
      showCheckmark: true,
      level: 'great',
    }
  }
  return {
    bg: COLORS.scoreGrey.bg,
    text: COLORS.scoreGrey.text,
    showCheckmark: false,
    level: 'low',
  }
}

/**
 * Format time for display (e.g., "9:00 AM")
 */
export function formatTime(time: string): string {
  return time
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - timestamp.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  }
  return 'Just now'
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Format date for display (e.g., "March 5, 2026")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format short date (e.g., "03/05/26")
 */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  })
}
