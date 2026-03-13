import { cn } from '@/lib/utils'

interface AvatarProps {
  initials: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ initials, className, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-[#F4EDDF] text-[#AA3300] font-semibold',
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
