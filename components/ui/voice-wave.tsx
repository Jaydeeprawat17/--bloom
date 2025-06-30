"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface VoiceWaveProps {
  isActive?: boolean
  persona?: "asha" | "kai" | "mira"
  className?: string
}

export function VoiceWave({ isActive = false, persona = "asha", className }: VoiceWaveProps) {
  const personaColors = {
    asha: "bg-pink-400",
    kai: "bg-blue-400",
    mira: "bg-purple-400",
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={cn("w-1 rounded-full", personaColors[persona])}
          animate={
            isActive
              ? {
                  height: [8, 24, 8],
                  opacity: [0.4, 1, 0.4],
                }
              : {
                  height: 8,
                  opacity: 0.4,
                }
          }
          transition={{
            duration: 1.5,
            repeat: isActive ? Number.POSITIVE_INFINITY : 0,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
