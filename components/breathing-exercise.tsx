"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Play, Pause } from "lucide-react"

interface BreathingExerciseProps {
  isOpen: boolean
  onClose: () => void
}

export function BreathingExercise({ isOpen, onClose }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [count, setCount] = useState(4)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const phases = [
      { name: "inhale" as const, duration: 4 },
      { name: "hold" as const, duration: 7 },
      { name: "exhale" as const, duration: 8 },
    ]

    let currentPhaseIndex = phases.findIndex((p) => p.name === phase)
    let currentCount = count

    const timer = setInterval(() => {
      currentCount--
      setCount(currentCount)

      if (currentCount === 0) {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
        const nextPhase = phases[currentPhaseIndex]
        setPhase(nextPhase.name)
        currentCount = nextPhase.duration
        setCount(currentCount)

        if (nextPhase.name === "inhale") {
          setCycle((prev) => prev + 1)
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, phase, count])

  const handleStart = () => {
    setIsActive(true)
    setPhase("inhale")
    setCount(4)
    setCycle(0)
  }

  const handleStop = () => {
    setIsActive(false)
    setPhase("inhale")
    setCount(4)
  }

  const getInstructions = () => {
    switch (phase) {
      case "inhale":
        return "Breathe in slowly through your nose"
      case "hold":
        return "Hold your breath gently"
      case "exhale":
        return "Exhale slowly through your mouth"
    }
  }

  const getCircleScale = () => {
    switch (phase) {
      case "inhale":
        return 1.2
      case "hold":
        return 1.2
      case "exhale":
        return 0.8
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
            <Card className="p-6 text-center">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">4-7-8 Breathing</h3>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="mb-8">
                <motion.div
                  className="w-32 h-32 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4"
                  animate={{ scale: getCircleScale() }}
                  transition={{ duration: count, ease: "easeInOut" }}
                >
                  <div className="text-2xl font-bold text-primary">{count}</div>
                </motion.div>

                <p className="text-sm text-muted mb-2">{getInstructions()}</p>
                <p className="text-xs text-muted">
                  {phase.charAt(0).toUpperCase() + phase.slice(1)} • Cycle {cycle}
                </p>
              </div>

              <div className="space-y-3">
                {!isActive ? (
                  <Button onClick={handleStart} className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Start Breathing Exercise
                  </Button>
                ) : (
                  <Button onClick={handleStop} variant="outline" className="w-full bg-transparent">
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Exercise
                  </Button>
                )}

                <p className="text-xs text-muted">Inhale for 4, hold for 7, exhale for 8 seconds</p>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
