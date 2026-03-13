import { getGreeting } from '@/lib/utils'
import { currentUser } from '@/data/users'

export function Greeting() {
  const greeting = getGreeting()

  return (
    <h1 className="text-[28px] font-semibold text-[#46494B] tracking-tight">
      {greeting}, {currentUser.name}!
    </h1>
  )
}
