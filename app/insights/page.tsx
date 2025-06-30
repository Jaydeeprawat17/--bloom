"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, TrendingUp, Calendar, Flower2, Heart } from "lucide-react"
import Link from "next/link"

interface MoodEntry {
  mood: number
  note?: string
  timestamp: number
}

export default function InsightsPage() {
  const [moodData, setMoodData] = useState<{ [key: string]: MoodEntry }>({})
  const [streak, setStreak] = useState(0)
  const [averageMood, setAverageMood] = useState(0)
  const [positiveWords, setPositiveWords] = useState<string[]>([])

  useEffect(() => {
    const data: { [key: string]: MoodEntry } = {}
    const words: string[] = []

    for (let i = 0; i < 14; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateKey = date.toISOString().split("T")[0]
      const moodKey = `mood-${dateKey}`

      const stored = localStorage.getItem(moodKey)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          data[dateKey] = parsed

          if (parsed.note) {
            const noteWords = parsed.note.toLowerCase().split(/\s+/)
            const positive = noteWords.filter((word) =>
              [
                "good",
                "great",
                "happy",
                "better",
                "hope",
                "grateful",
                "love",
                "joy",
                "peace",
                "calm",
                "strong",
              ].includes(word),
            )
            words.push(...positive)
          }
        } catch (e) {
          console.error("Error parsing mood data:", e)
        }
      }
    }

    setMoodData(data)
    setPositiveWords([...new Set(words)])

    let currentStreak = 0
    for (let i = 0; i < 14; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateKey = date.toISOString().split("T")[0]
      if (data[dateKey]) {
        currentStreak++
      } else {
        break
      }
    }
    setStreak(currentStreak)

    const moods = Object.values(data).map((entry) => entry.mood)
    if (moods.length > 0) {
      setAverageMood(moods.reduce((sum, mood) => sum + mood, 0) / moods.length)
    }
  }, [])

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😢", "😔", "😐", "🙂", "😊"]
    return emojis[mood - 1] || "😐"
  }

  const getLast14Days = () => {
    const days = []
    for (let i = 13; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateKey = date.toISOString().split("T")[0]
      days.push({
        date: dateKey,
        day: date.getDate(),
        mood: moodData[dateKey]?.mood || null,
      })
    }
    return days
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Your Growth Insights</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-card border-border">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </Card>

          <Card className="p-4 text-center bg-card border-border">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{averageMood.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Average Mood</div>
          </Card>

          <Card className="p-4 text-center bg-card border-border">
            <Flower2 className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{Math.min(streak + 2, 8)}</div>
            <div className="text-sm text-muted-foreground">Flower Petals</div>
          </Card>
        </div>

        <Card className="p-6 bg-card border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5" />
            14-Day Mood Timeline
          </h3>

          <div className="flex justify-between items-end h-32 mb-4">
            {getLast14Days().map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-8 bg-primary rounded-t transition-all"
                  style={{ height: day.mood ? `${day.mood * 16}px` : "8px" }}
                />
                <div className="text-xs text-muted-foreground">{day.day}</div>
                {day.mood && <div className="text-lg">{getMoodEmoji(day.mood)}</div>}
              </motion.div>
            ))}
          </div>

          <div className="text-xs text-muted-foreground text-center">Last 14 days • Higher bars = better mood</div>
        </Card>

        {positiveWords.length > 0 && (
          <Card className="p-6 bg-card border-border">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
              <Heart className="w-5 h-5 text-destructive" />
              Your Positive Words
            </h3>

            <div className="flex flex-wrap gap-2">
              {positiveWords.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-6 bg-card border-border">
          <h3 className="font-semibold mb-4 text-foreground">Recent Reflections</h3>

          <div className="space-y-3">
            {Object.entries(moodData)
              .filter(([_, entry]) => entry.note)
              .slice(0, 5)
              .map(([date, entry]) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-muted rounded-lg border border-border"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getMoodEmoji(entry.mood)}</span>
                    <span className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm italic text-foreground">"{entry.note}"</p>
                </motion.div>
              ))}
          </div>

          {Object.values(moodData).filter((entry) => entry.note).length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              Start adding notes to your mood check-ins to see your reflections here.
            </p>
          )}
        </Card>
      </main>
    </div>
  )
}
