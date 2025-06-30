"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

const moods = [
  { emoji: "😢", label: "Very Sad", value: 1 },
  { emoji: "😔", label: "Sad", value: 2 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😊", label: "Great", value: 5 },
]

interface MoodPickerProps {
  value: { mood: number; note?: string; timestamp: number } | null
  onChange: (mood: number, note?: string) => void
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(value?.mood || null)
  const [note, setNote] = useState(value?.note || "")
  const [showNote, setShowNote] = useState(false)

  const handleMoodSelect = (moodValue: number) => {
    setSelectedMood(moodValue)
    if (!showNote) {
      onChange(moodValue, note)
    }
  }

  const handleSave = () => {
    if (selectedMood) {
      onChange(selectedMood, note)
      setShowNote(false)
    }
  }

  if (value) {
    const selectedMoodData = moods.find((m) => m.value === value.mood)
    return (
      <Card className="p-4 text-center bg-accent/10 border-accent/20">
        <div className="text-4xl mb-2">{selectedMoodData?.emoji}</div>
        <p className="text-sm text-muted">Today's mood: {selectedMoodData?.label}</p>
        {value.note && <p className="text-sm mt-2 italic">"{value.note}"</p>}
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-3">
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            onClick={() => handleMoodSelect(mood.value)}
            className={`p-3 rounded-full text-3xl transition-all hover:scale-110 ${
              selectedMood === mood.value ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-surface"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {mood.emoji}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Button variant="outline" onClick={() => setShowNote(!showNote)} className="w-full">
              {showNote ? "Hide Note" : "Add a Note (Optional)"}
            </Button>

            {showNote && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <Textarea
                  placeholder="How are you feeling? What's on your mind?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
                <Button onClick={handleSave} className="w-full">
                  Save Mood & Note
                </Button>
              </motion.div>
            )}

            {!showNote && (
              <Button onClick={handleSave} className="w-full">
                Save Mood
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
