import React from 'react'

interface OnboardingProps {
  onComplete: () => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl mb-6">
            <span className="text-white font-bold text-3xl">KI</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Welcome to KI!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Let's get to know you better so we can personalize your experience and help you build your knowledge empire.
          </p>
        </div>

        {/* Onboarding Steps Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8 space-y-6">
          <div className="space-y-5">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">Personality Profile</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Share your background, interests, passions, and goals to help our AI understand who you are
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">Life Timeline</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Map out key moments, experiences, and milestones in your personal journey
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">Learning Preferences</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Tell us how you like to learn, process information, and retain knowledge
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">Content Goals</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Define what you want to create, share, and achieve with your knowledge
                </p>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                  <strong className="font-semibold">Development Mode:</strong> The full onboarding flow will use AI agents to conduct a natural, conversational interview tailored to you.
                </p>
              </div>
            </div>

            <button
              onClick={onComplete}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              Skip Onboarding for Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              You can complete your profile later from the settings menu
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-1.5 bg-blue-600 rounded-full"></div>
          <div className="w-8 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="w-8 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="w-8 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
