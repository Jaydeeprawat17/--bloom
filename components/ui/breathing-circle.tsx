"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BreathingCircleProps {
  phase: "inhale" | "hold" | "exhale"
  count: number
  className?: string
}

export function BreathingCircle({ phase, count, className }: BreathingCircleProps) {
  const getScale = () => {
    switch (phase) {
      case "inhale":
        return 1.3
      case "hold":
        return 1.3
      case "exhale":
        return 0.8
      default:
        return 1
    }
  }

  const getColor = () => {
    switch (phase) {
      case "inhale":
        return "from-blue-400 to-cyan-400"
      case "hold":
        return "from-purple-400 to-pink-400"
      case "exhale":
        return "from-green-400 to-emerald-400"
      default:
        return "from-blue-400 to-cyan-400"
    }
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <motion.div
        className={cn(
          "w-48 h-48 rounded-full bg-gradient-to-br shadow-2xl flex items-center justify-center",
          getColor(),
        )}
        animate={{ scale: getScale() }}
        transition={{ duration: count, ease: "easeInOut" }}
      >
        <div className="w-32 h-32 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">{count}</div>
            <div className="text-sm text-muted-foreground capitalize">{phase}</div>
          </div>
        </div>
      </motion.div>

      {/* Ripple effect */}
      <motion.div
        className="absolute w-48 h-48 rounded-full border-2 border-white/30"
        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
      />
    </div>
  )
}
