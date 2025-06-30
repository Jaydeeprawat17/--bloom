"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BloomFlowerProps {
  size?: "sm" | "md" | "lg" | "xl"
  petals?: number
  className?: string
}

export function BloomFlower({ size = "md", petals = 0, className }: BloomFlowerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  }

  const petalSize = {
    sm: 3,
    md: 6,
    lg: 9,
    xl: 12,
  }

  const centerSize = {
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
  }

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}>
        {/* Stem */}
        <line x1="50" y1="85" x2="50" y2="95" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" />

        {/* Petals */}
        {Array.from({ length: Math.min(petals, 8) }).map((_, i) => {
          const angle = (i * 360) / 8
          const x = 50 + Math.cos((angle * Math.PI) / 180) * 15
          const y = 50 + Math.sin((angle * Math.PI) / 180) * 15

          return (
            <motion.ellipse
              key={i}
              cx={x}
              cy={y}
              rx={petalSize[size]}
              ry={petalSize[size] * 1.5}
              fill="hsl(var(--primary))"
              transform={`rotate(${angle} ${x} ${y})`}
              initial={{ scale: 0, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
            />
          )
        })}

        {/* Center */}
        <circle cx="50" cy="50" r={centerSize[size]} fill="hsl(var(--accent))" />
      </svg>
    </div>
  )
}
