"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

const DAILY_NOTES = [
  "You deserve to feel peace, even when life is loud.",
  "Your healing journey is valid, no matter how slow it feels.",
  "Every breath you take is an act of courage.",
  "You are worthy of love, especially from yourself.",
  "Small steps forward are still steps forward.",
  "Your feelings are temporary visitors, not permanent residents.",
  "You have survived 100% of your difficult days so far.",
  "Growth happens in the quiet moments too.",
  "You are allowed to rest while you heal.",
  "Your story isn't over yet, and that's beautiful.",
  "You matter more than you know.",
  "Healing isn't linear, and that's perfectly okay.",
  "You are stronger than the storm you're weathering.",
  "Tomorrow holds possibilities you can't see today.",
  "You are enough, exactly as you are right now.",
]

export function DailyBloomNote() {
  const [dailyNote, setDailyNote] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const cacheKey = `daily_note_${today}`

    const cachedNote = localStorage.getItem(cacheKey)
    if (cachedNote) {
      setDailyNote(cachedNote)
      setIsLoading(false)
      return
    }

    const dateNum = new Date().getDate() + new Date().getMonth() * 31
    const noteIndex = dateNum % DAILY_NOTES.length
    const selectedNote = DAILY_NOTES[noteIndex]

    setTimeout(() => {
      setDailyNote(selectedNote)
      localStorage.setItem(cacheKey, selectedNote)
      setIsLoading(false)
    }, 800)
  }, [])

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="h-6 w-6 text-bloom-primary" />
            </motion.div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded animate-pulse"></div>
              <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="animate-gentle-bounce"
    >
      <Card className="bg-bloom-soft border-bloom-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="h-6 w-6 text-bloom-primary" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-primary mb-2">Today's Bloom Note</h3>
              <p className="text-lg font-medium text-foreground leading-relaxed">"{dailyNote}"</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
