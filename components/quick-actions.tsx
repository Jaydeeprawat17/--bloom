"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageCircle, Wind, BarChart3, Heart, Sparkles, Phone } from "lucide-react"
import { BestThingCard } from "@/components/best-thing-card"
import { BreathingExercise } from "@/components/breathing-exercise"
import { useToast } from "@/hooks/use-toast"

export function QuickActions() {
  const [showBestThing, setShowBestThing] = useState(false)
  const [showBreathing, setShowBreathing] = useState(false)
  const [showCrisisHelp, setShowCrisisHelp] = useState(false)
  const { toast } = useToast()

  const actions = [
    {
      icon: MessageCircle,
      label: "Talk to AI Friend",
      onClick: () => {
        window.location.href = "/chat"
      },
      color: "text-bloom-primary",
      description: "Chat with caring AI companions",
    },
    {
      icon: Wind,
      label: "Breathing Exercise",
      onClick: () => setShowBreathing(true),
      color: "text-blue-500",
      description: "Calm your mind with 4-7-8 breathing",
    },
    {
      icon: Heart,
      label: "Best Thing Today",
      onClick: () => setShowBestThing(true),
      color: "text-pink-500",
      description: "Practice gratitude and positivity",
    },
    {
      icon: BarChart3,
      label: "View Progress",
      onClick: () => {
        window.location.href = "/insights"
      },
      color: "text-green-500",
      description: "See your growth and insights",
    },
    {
      icon: Sparkles,
      label: "Wellness Exercises",
      onClick: () => {
        window.location.href = "/exercises"
      },
      color: "text-purple-500",
      description: "Interactive mental health exercises",
    },
    {
      icon: Phone,
      label: "Crisis Support",
      onClick: () => setShowCrisisHelp(true),
      color: "text-red-500",
      description: "Immediate help and resources",
    },
  ]

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-bloom-primary" />
          <h3 className="font-semibold text-foreground">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={action.onClick}
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-muted/50 bg-transparent border-border hover:border-primary/50 transition-all group"
            >
              <action.icon className={`w-6 h-6 ${action.color} group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium text-foreground">{action.label}</span>
              <span className="text-xs text-muted-foreground text-center leading-tight">{action.description}</span>
            </Button>
          ))}
        </div>
      </Card>

      <BestThingCard isOpen={showBestThing} onClose={() => setShowBestThing(false)} />
      <BreathingExercise isOpen={showBreathing} onClose={() => setShowBreathing(false)} />

      {/* Crisis Help Modal */}
      {showCrisisHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Crisis Support</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCrisisHelp(false)}>
                  ×
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Emergency Hotlines</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>US:</strong>{" "}
                      <a href="tel:988" className="text-red-600 dark:text-red-400">
                        988
                      </a>{" "}
                      (Suicide & Crisis Lifeline)
                    </div>
                    <div>
                      <strong>UK:</strong>{" "}
                      <a href="tel:116123" className="text-red-600 dark:text-red-400">
                        116 123
                      </a>{" "}
                      (Samaritans)
                    </div>
                    <div>
                      <strong>India:</strong>{" "}
                      <a href="tel:+919820466726" className="text-red-600 dark:text-red-400">
                        +91 9820466726
                      </a>{" "}
                      (AASRA)
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setShowCrisisHelp(false)
                    window.location.href = "/chat"
                  }}
                  className="w-full"
                >
                  Talk to AI Friend Now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
