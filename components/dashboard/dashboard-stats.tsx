"use client"

import { motion } from "framer-motion"
import { EnhancedCard, EnhancedCardContent } from "@/components/ui/enhanced-card"
import { Calendar, TrendingUp, Heart, Zap } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export function DashboardStats() {
  const [streak] = useLocalStorage("mood-streak", 0)
  const [totalMoods] = useLocalStorage("total-moods", 0)

  const stats = [
    {
      icon: Calendar,
      label: "Day Streak",
      value: streak,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      icon: TrendingUp,
      label: "Growth Score",
      value: Math.min(streak * 10 + 50, 100),
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      icon: Heart,
      label: "Mood Entries",
      value: totalMoods,
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-950/20",
    },
    {
      icon: Zap,
      label: "Energy Level",
      value: 85,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <EnhancedCard variant="glass" className="text-center cursor-default">
            <EnhancedCardContent className="p-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>
      ))}
    </div>
  )
}
