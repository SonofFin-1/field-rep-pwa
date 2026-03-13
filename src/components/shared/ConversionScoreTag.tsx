import { cn, getScoreColor } from '@/lib/utils'
import { CheckCircle2 } from 'lucide-react'

interface ConversionScoreTagProps {
  score: number
  className?: string
  showLabel?: boolean
}

export function ConversionScoreTag({
  score,
  className,
  showLabel = false,
}: ConversionScoreTagProps) {
  const { bg, text, showCheckmark } = getScoreColor(score)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        className
      )}
      style={{ backgroundColor: bg, color: text }}
    >
      {showCheckmark && <CheckCircle2 className="w-3.5 h-3.5" />}
      <span>{score}</span>
      {showLabel && <span className="ml-0.5">Conversion Score</span>}
    </span>
  )
}
