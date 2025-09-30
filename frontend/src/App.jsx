import { AuthProvider, useAuth } from './contexts/AuthContext'
import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import Chat from './components/Chat'
import Onboarding from './components/Onboarding'
import { chatService } from './services/api'

function AppContent() {
  const { session, loading, user, signOut } = useAuth()
  const [onboardingComplete, setOnboardingComplete] = useState(null)
  const [checkingOnboarding, setCheckingOnboarding] = useState(true)

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!session) {
        setCheckingOnboarding(false)
        return
      }

      try {
        // Check user profile from backend
        const userProfile = await chatService.getCurrentUser()
        setOnboardingComplete(userProfile.onboarding_completed || false)
      } catch (error) {
        console.error('Error checking onboarding:', error)
        setOnboardingComplete(false)
      } finally {
        setCheckingOnboarding(false)
      }
    }

    checkOnboardingStatus()
  }, [session])

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - show auth page
  if (!session) {
    return <Auth />
  }

  // Authenticated but not onboarded - show onboarding
  if (onboardingComplete === false) {
    return <Onboarding onComplete={() => setOnboardingComplete(true)} />
  }

  // Fully authenticated and onboarded - show chat
  return (
    <div className="relative">
      <Chat />
      <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
        <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow">
          {user?.email}
        </span>
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 shadow"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}