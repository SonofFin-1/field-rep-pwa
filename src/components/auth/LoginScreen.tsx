import { useState } from 'react'
import { Lock } from 'lucide-react'

interface LoginScreenProps {
  onLogin: () => void
}

const PASSWORD = 'Salesrep'

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === PASSWORD) {
      sessionStorage.setItem('field-rep-authenticated', 'true')
      onLogin()
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-[#46494B] text-center mb-2">
          Field Rep
        </h1>
        <p className="text-sm text-[#778188] text-center mb-6">
          Enter password to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#778188]" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder="Password"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0061AA] focus:border-transparent ${
                error ? 'border-red-400 bg-red-50' : 'border-[#DFEBF4]'
              }`}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">
              Incorrect password. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#0061AA] text-white font-medium rounded-lg hover:bg-[#004d88] transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
