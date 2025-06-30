"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MoodOption {
  emoji: string
  label: string
  value: number
  color: string
}

const moods: MoodOption[] = [
  { emoji: "😢", label: "Struggling", value: 1, color: "from-red-400 to-red-600" },
  { emoji: "😔", label: "Down", value: 2, color: "from-orange-400 to-orange-600" },
  { emoji: "😐", label: "Okay", value: 3, color: "from-yellow-400 to-yellow-600" },
  { emoji: "🙂", label: "Good", value: 4, color: "from-green-400 to-green-600" },
  { emoji: "😊", label: "Great", value: 5, color: "from-blue-400 to-blue-600" },
]

interface MoodSelectorProps {
  selectedMood: number | null
  onMoodSelect: (mood: number) => void
  className?: string
}

export function MoodSelector({ selectedMood, onMoodSelect, className }: MoodSelectorProps) {
  return (
    <div className={cn("flex justify-center gap-4", className)}>
      {moods.map((mood, index) => (
        <motion.button
          key={mood.value}
          onClick={() => onMoodSelect(mood.value)}
          className={cn(
            "relative p-4 rounded-2xl text-4xl transition-all duration-300",
            "hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/50",
            selectedMood === mood.value ? "scale-125 shadow-2xl" : "hover:shadow-lg",
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Background gradient */}
          {selectedMood === mood.value && (
            <motion.div
              className={cn("absolute inset-0 rounded-2xl bg-gradient-to-br opacity-20", mood.color)}
              layoutId="mood-bg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}

          {/* Emoji */}
          <span className="relative z-10">{mood.emoji}</span>

          {/* Label */}
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: selectedMood === mood.value ? 1 : 0 }}
          >
            <span className="text-xs font-medium text-foreground whitespace-nowrap">{mood.label}</span>
          </motion.div>
        </motion.button>
      ))}
    </div>
  )
}
