import { SlidersHorizontal } from 'lucide-react'
import { SearchBar } from '@/components/shared'

interface LeadsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  onFilterClick?: () => void
  activeFilterCount?: number
}

export function LeadsToolbar({
  search,
  onSearchChange,
  onFilterClick,
  activeFilterCount = 0,
}: LeadsToolbarProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <SearchBar
        value={search}
        onChange={onSearchChange}
        placeholder="Search"
        className="w-[280px]"
      />
      <button
        onClick={onFilterClick}
        className="relative flex items-center justify-center w-10 h-10 bg-white border border-[#DFEBF4] rounded-full hover:bg-[#F0F5F7] transition-colors"
        aria-label="Filter"
      >
        <SlidersHorizontal className="w-4 h-4 text-[#46494B]" />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0061AA] text-white text-xs font-semibold rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  )
}
