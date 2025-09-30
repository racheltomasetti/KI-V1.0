import React from 'react'

interface OnboardingProps {
  onComplete: () => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to KI!
          </h1>
          <p className="text-lg text-gray-600">
            Let's get to know you better so we can personalize your experience.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Personality Profile</h3>
                <p className="text-sm text-gray-600">
                  Share your background, interests, and goals
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Life Timeline</h3>
                <p className="text-sm text-gray-600">
                  Map out key moments in your journey
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Learning Preferences</h3>
                <p className="text-sm text-gray-600">
                  How you like to learn and process information
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Content Goals</h3>
                <p className="text-sm text-gray-600">
                  What you want to create and share
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-gray-500 mb-4">
              This is a placeholder for the onboarding flow. The actual onboarding
              will use the AI agents to conduct a conversational interview.
            </p>

            <button
              onClick={onComplete}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Skip for Now (Development Only)
            </button>

            <p className="text-xs text-gray-400 text-center mt-2">
              In production, this will guide you through a personalized interview
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
