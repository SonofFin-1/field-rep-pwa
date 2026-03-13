import { cn } from '@/lib/utils'

interface StatusTagProps {
  status: 'New' | 'Returning'
  className?: string
}

export function StatusTag({ status, className }: StatusTagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        status === 'New'
          ? 'bg-[#DBEAFE] text-[#1E40AF]'
          : 'bg-[#EBDBFE] text-[#311EAF]',
        className
      )}
    >
      {status}
    </span>
  )
}
