import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingDisplayProps {
  rating: number | null | undefined
  showNumeric?: boolean
  className?: string
}

export function RatingDisplay({ rating, showNumeric = true, className }: RatingDisplayProps) {
  if (!rating) {
    return (
      <span className={cn('text-[#778188] text-sm', className)}>—</span>
    )
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={14}
            className={cn(
              star <= rating
                ? 'fill-[#F59E0B] text-[#F59E0B]'
                : 'fill-none text-[#D1D5DB]'
            )}
          />
        ))}
      </div>
      {showNumeric && (
        <span className="text-sm text-[#46494B] ml-1">{rating}/5</span>
      )}
    </div>
  )
}
