import { Route } from 'lucide-react'

export function PlanYourDayCta() {
  return (
    <button
      className="w-full flex items-center justify-center gap-2 bg-[#0061AA] text-white py-3.5 px-6 rounded-full font-semibold text-[15px] hover:bg-[#004d88] transition-colors"
      onClick={() => {
        // Navigate to planner
        window.location.href = '/planner'
      }}
    >
      <Route className="w-5 h-5" />
      Plan your day
    </button>
  )
}
