"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Sparkles } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useToast } from "@/hooks/use-toast"

const moods = [
  { emoji: "😢", label: "Struggling", value: 1 },
  { emoji: "😔", label: "Down", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😊", label: "Great", value: 5 },
]

export function MoodCheckIn() {
  const today = new Date().toISOString().split("T")[0]
  const [todaysMood, setTodaysMood] = useLocalStorage(`mood-${today}`, null)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [note, setNote] = useState("")
  const [showNote, setShowNote] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    if (selectedMood) {
      const moodEntry = {
        mood: selectedMood,
        note: note.trim(),
        timestamp: Date.now(),
      }

      setTodaysMood(moodEntry)
      setSelectedMood(null)
      setNote("")
      setShowNote(false)

      toast({
        title: "Mood saved! 🌱",
        description: "Your daily check-in helps your garden grow.",
      })
    }
  }

  if (todaysMood) {
    const moodData = moods.find((m) => m.value === todaysMood.mood)
    return (
      <Card className="bg-bloom-mint border-bloom-secondary/20">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3">{moodData?.emoji}</div>
          <h3 className="font-semibold mb-2 text-foreground">Today's Check-in Complete</h3>
          <p className="text-sm text-muted-foreground mb-2">Feeling: {moodData?.label}</p>
          {todaysMood.note && (
            <p className="text-sm italic bg-background rounded-lg p-3 mt-3 border">"{todaysMood.note}"</p>
          )}
          <div className="flex items-center justify-center space-x-2 mt-4 text-bloom-secondary">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Your garden is growing!</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <Heart className="h-8 w-8 text-bloom-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2 text-foreground">How are you feeling today?</h3>
        <p className="text-muted-foreground mb-6">Your daily check-in helps track your emotional journey</p>

        <div className="flex justify-center space-x-3 mb-6">
          {moods.map((mood) => (
            <motion.button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-4 rounded-2xl text-3xl transition-all hover:scale-110 ${
                selectedMood === mood.value ? "bg-bloom-soft ring-2 ring-bloom-primary" : "hover:bg-muted"
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
              className="space-y-4"
            >
              <p className="font-medium">{moods.find((m) => m.value === selectedMood)?.label}</p>

              <Button variant="ghost" onClick={() => setShowNote(!showNote)} className="w-full">
                {showNote ? "Hide Note" : "Add a note (optional)"}
              </Button>

              {showNote && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <Textarea
                    placeholder="What's on your mind? How are you feeling right now?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </motion.div>
              )}

              <Button onClick={handleSave} className="w-full bg-bloom-primary hover:bg-bloom-primary/90">
                Save My Check-in
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
