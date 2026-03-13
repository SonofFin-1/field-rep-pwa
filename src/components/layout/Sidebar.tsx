import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Map, Calendar, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/shared/Avatar'
import { currentUser } from '@/data/users'
import adtLogo from '@/assets/adt-logo.png'

const navItems = [
  { path: '/', icon: Map, label: 'Planner' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
]

export function Sidebar() {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleReset = () => {
    // Clear all localStorage data
    localStorage.removeItem('field-rep-schedules')
    localStorage.removeItem('field-rep-schedules-seed-version')
    localStorage.removeItem('field-rep-plan')
    // Clear all date-keyed plans
    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('field-rep-plan-')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
    // Reload the page to reset all state
    window.location.reload()
  }

  return (
    <aside className="flex flex-col items-center w-[70px] h-full bg-white border-r border-[#DFEBF4] py-4">
      {/* ADT Logo */}
      <div className="mb-6">
        <img src={adtLogo} alt="ADT" className="w-[60px] h-[60px] object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'w-10 h-10 flex items-center justify-center transition-colors',
                isActive
                  ? 'bg-[#F0F5F7] rounded-[30px]'
                  : 'rounded-[12.75px] hover:bg-[#F0F5F7]'
              )
            }
            aria-label={label}
          >
            {({ isActive }) => (
              <Icon
                className={cn(
                  'w-5 h-5',
                  isActive ? 'text-[#0061AA]' : 'text-[#778188]'
                )}
              />
            )}
          </NavLink>
        ))}
      </nav>

      {/* Reset Button */}
      <div className="mb-4 relative">
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="w-10 h-10 flex items-center justify-center rounded-[12.75px] hover:bg-[#F0F5F7] transition-colors"
          aria-label="Reset app"
        >
          <RefreshCw className="w-5 h-5 text-[#778188]" />
        </button>

        {/* Confirmation popup */}
        {showConfirm && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowConfirm(false)}
            />
            <div className="absolute left-full ml-2 bottom-0 z-50 bg-white rounded-lg shadow-lg border border-[#DFEBF4] p-4 w-[200px]">
              <p className="text-sm text-[#46494B] mb-3">
                Reset all data? This will clear appointments and plans.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-3 py-1.5 text-sm text-[#778188] hover:bg-[#F0F5F7] rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Avatar */}
      <div className="mt-auto">
        <Avatar initials={currentUser.initials} />
      </div>
    </aside>
  )
}
