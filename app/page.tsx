"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { MoodCheckIn } from "@/components/mood/mood-check-in"
import { AICompanions } from "@/components/ai/ai-companions"
import { CommunityStories } from "@/components/community-stories"
import { QuickActions } from "@/components/quick-actions"
import { DailyInsights } from "@/components/daily-insights"
import { CrisisShield } from "@/components/crisis-shield"
import { WelcomeScreen } from "@/components/welcome-screen"
import { ParticleBackground } from "@/components/ui/particle-background"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useTheme } from "@/components/theme-provider"

export default function HomePage() {
  const [hasCompletedWelcome, setHasCompletedWelcome] = useLocalStorage("bloom-welcome-completed", false)
  const [showCrisisShield, setShowCrisisShield] = useState(false)
  const { theme } = useTheme()

  if (!hasCompletedWelcome) {
    return <WelcomeScreen onComplete={() => setHasCompletedWelcome(true)} />
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <div className="gradient-mesh fixed inset-0" />

      <CrisisShield isVisible={showCrisisShield} onDismiss={() => setShowCrisisShield(false)} />

      <Header />

      <main className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <DashboardStats />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <MoodCheckIn onCrisisDetected={() => setShowCrisisShield(true)} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <AICompanions onCrisisDetected={() => setShowCrisisShield(true)} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <CommunityStories />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <QuickActions />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <DailyInsights />
            </motion.div>
          </div>
        </div>
        <footer
          className={`text-center text-sm mt-10 py-4 ${
            theme === "dark" || theme === "midnight" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          ⚡ Built with{" "}
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className={`underline hover:no-underline transition-colors ${
              theme === "dark" || theme === "midnight"
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            Bolt.new
          </a>
        </footer>
      </main>
    </div>
  )
}
