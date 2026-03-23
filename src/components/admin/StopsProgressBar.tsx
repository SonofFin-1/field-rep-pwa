interface StopsProgressBarProps {
  completed: number
  total: number
}

export function StopsProgressBar({ completed, total }: StopsProgressBarProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="flex items-center gap-2">
      {/* Progress bar */}
      <div className="w-[100px] h-2 bg-[#DFEBF4] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#0061AA] rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* Text label - fixed width for consistency */}
      <span className="w-[50px] text-sm font-medium text-[#46494B] tabular-nums">
        {completed}/{total}
      </span>
    </div>
  )
}
