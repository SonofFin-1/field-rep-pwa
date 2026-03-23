import { cn, getScoreColor } from '@/lib/utils'
import { CheckCircle2, HelpCircle } from 'lucide-react'

interface ConversionScoreTagProps {
  score: number | null
  className?: string
  showLabel?: boolean
}

export function ConversionScoreTag({
  score,
  className,
  showLabel = false,
}: ConversionScoreTagProps) {
  const { bg, text, showCheckmark, level } = getScoreColor(score)
  const isUnscored = level === 'unscored'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        className
      )}
      style={{ backgroundColor: bg, color: text }}
    >
      {isUnscored && <HelpCircle className="w-3.5 h-3.5" />}
      {showCheckmark && <CheckCircle2 className="w-3.5 h-3.5" />}
      <span>{score === null ? '?' : score}</span>
      {showLabel && <span className="ml-0.5">Conversion Score</span>}
    </span>
  )
}
