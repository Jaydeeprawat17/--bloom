"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function DailyNoteCard() {
  const [dailyNote, setDailyNote] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const cacheKey = `daily_note_${today}`

    // Check if we already have today's note
    const cachedNote = localStorage.getItem(cacheKey)
    if (cachedNote) {
      setDailyNote(cachedNote)
      setIsLoading(false)
      return
    }

    // Generate new daily note
    generateDailyNote().then((note) => {
      setDailyNote(note)
      localStorage.setItem(cacheKey, note)
      setIsLoading(false)
    })
  }, [])

  const generateDailyNote = async (): Promise<string> => {
    // Simulate API call - in real app, this would call OpenAI
    const notes = [
      "You deserve to bloom slowly and beautifully.",
      "Every small step forward is worth celebrating.",
      "Your feelings are valid, and you are stronger than you know.",
      "Today is a new chance to be gentle with yourself.",
      "You are growing, even when you can't see it.",
      "Your journey matters, and so do you.",
      "It's okay to rest while you heal and grow.",
      "You have survived difficult days before, and you can do it again.",
    ]

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return notes[Math.floor(Math.random() * notes.length)]
  }

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="animate-spin">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="h-4 bg-border rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-border rounded animate-pulse w-3/4"></div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="animate-drift">
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-primary mb-1">Today's Bloom Note</h3>
            <p className="text-sm text-muted italic">"{dailyNote}"</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
