"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { X, Flower } from "lucide-react"

interface BestThingCardProps {
  isOpen: boolean
  onClose: () => void
}

export function BestThingCard({ isOpen, onClose }: BestThingCardProps) {
  const [bestThing, setBestThing] = useState("")
  const [yesterdaysBest, setYesterdaysBest] = useState("")
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

      const todaysBest = localStorage.getItem(`best_${today}`)
      const yesterdaysBest = localStorage.getItem(`best_${yesterday}`)

      setBestThing(todaysBest || "")
      setYesterdaysBest(yesterdaysBest || "")

      // Show tooltip after 10 seconds if input is empty
      const timer = setTimeout(() => {
        if (!todaysBest) {
          setShowTooltip(true)
        }
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleSave = () => {
    if (bestThing.trim()) {
      const today = new Date().toISOString().split("T")[0]
      localStorage.setItem(`best_${today}`, bestThing.trim())
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flower className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold">Best Thing Today</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-sm text-muted mb-4">What was one good moment from your day?</p>

              {yesterdaysBest && (
                <div className="mb-4 p-3 bg-surface rounded-lg border">
                  <p className="text-xs text-muted mb-1">Yesterday's best thing:</p>
                  <p className="text-sm italic opacity-60">"{yesterdaysBest}"</p>
                </div>
              )}

              <div className="relative">
                <Input
                  value={bestThing}
                  onChange={(e) => setBestThing(e.target.value)}
                  placeholder="A smile, a song, a sunset..."
                  className="mb-4"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />

                <AnimatePresence>
                  {showTooltip && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute -top-12 left-0 right-0 bg-primary text-white text-xs p-2 rounded-md"
                    >
                      Stuck? Think of a song, smell, or smile you enjoyed.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Button onClick={handleSave} disabled={!bestThing.trim()} className="w-full">
                Save
              </Button>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
