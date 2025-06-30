"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/layout/header"
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card"
import { Button } from "@/components/ui/button"
import { BreathingCircle } from "@/components/ui/breathing-circle"
import { ParticleBackground } from "@/components/ui/particle-background"
import { Wind, Heart, Brain, Zap, Play, Pause, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const exercises = [
  {
    id: "breathing",
    title: "4-7-8 Breathing",
    description: "Calm your nervous system with this powerful breathing technique",
    icon: Wind,
    color: "from-blue-400 to-cyan-500",
    duration: "5 min",
  },
  {
    id: "gratitude",
    title: "Gratitude Practice",
    description: "Shift your mindset by focusing on what you're grateful for",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    duration: "3 min",
  },
  {
    id: "mindfulness",
    title: "Mindful Meditation",
    description: "Ground yourself in the present moment",
    icon: Brain,
    color: "from-purple-400 to-violet-500",
    duration: "10 min",
  },
  {
    id: "energy",
    title: "Energy Boost",
    description: "Quick exercises to lift your mood and energy",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    duration: "2 min",
  },
]

export default function ExercisesPage() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null)
  const [gratitudeInputs, setGratitudeInputs] = useState({
    small: "",
    person: "",
    self: "",
  })
  const [breathingState, setBreathingState] = useState({
    isActive: false,
    phase: "inhale" as "inhale" | "hold" | "exhale",
    count: 4,
    cycle: 0,
  })
  const { toast } = useToast()

  const startBreathing = () => {
    setBreathingState((prev) => ({ ...prev, isActive: true, phase: "inhale", count: 4, cycle: 0 }))
  }

  const stopBreathing = () => {
    setBreathingState((prev) => ({ ...prev, isActive: false }))
  }

  const resetBreathing = () => {
    setBreathingState({ isActive: false, phase: "inhale", count: 4, cycle: 0 })
  }

  const saveGratitude = () => {
    if (gratitudeInputs.small || gratitudeInputs.person || gratitudeInputs.self) {
      const today = new Date().toISOString().split("T")[0]
      localStorage.setItem(`gratitude-${today}`, JSON.stringify(gratitudeInputs))

      toast({
        title: "Gratitude Saved! 💖",
        description: "Your gratitude practice has been recorded.",
      })

      setGratitudeInputs({ small: "", person: "", self: "" })
      setActiveExercise(null)
    } else {
      toast({
        title: "Please fill at least one field",
        description: "Share something you're grateful for today.",
        variant: "destructive",
      })
    }
  }

  const completeMindfulness = () => {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem(`mindfulness-${today}`, "completed")

    toast({
      title: "Mindfulness Complete! 🧘‍♀️",
      description: "You've taken time to ground yourself in the present.",
    })

    setActiveExercise(null)
  }

  const completeEnergyBoost = () => {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem(`energy-boost-${today}`, "completed")

    toast({
      title: "Energy Boost Complete! ⚡",
      description: "Great job taking action to lift your mood!",
    })

    setActiveExercise(null)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <div className="gradient-mesh fixed inset-0" />

      <Header />

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-bloom-primary to-bloom-secondary bg-clip-text text-transparent mb-4">
            Wellness Exercises
          </h1>
          <p className="text-muted-foreground text-lg">Interactive exercises to support your mental health journey</p>
        </motion.div>

        {!activeExercise ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EnhancedCard
                  variant="glass"
                  interactive
                  onClick={() => setActiveExercise(exercise.id)}
                  className="h-full cursor-pointer"
                >
                  <EnhancedCardHeader>
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${exercise.color} flex items-center justify-center mb-4`}
                    >
                      <exercise.icon className="h-8 w-8 text-white" />
                    </div>
                    <EnhancedCardTitle>{exercise.title}</EnhancedCardTitle>
                    <p className="text-muted-foreground">{exercise.description}</p>
                  </EnhancedCardHeader>
                  <EnhancedCardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{exercise.duration}</span>
                      <Button>Start Exercise</Button>
                    </div>
                  </EnhancedCardContent>
                </EnhancedCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            {activeExercise === "breathing" && (
              <EnhancedCard variant="glass" className="text-center">
                <EnhancedCardHeader>
                  <EnhancedCardTitle>4-7-8 Breathing Exercise</EnhancedCardTitle>
                  <p className="text-muted-foreground">Inhale for 4, hold for 7, exhale for 8 seconds</p>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="space-y-8">
                    <BreathingCircle phase={breathingState.phase} count={breathingState.count} />

                    <div className="text-center">
                      <p className="text-lg font-medium mb-2">
                        {breathingState.phase === "inhale" && "Breathe in slowly through your nose"}
                        {breathingState.phase === "hold" && "Hold your breath gently"}
                        {breathingState.phase === "exhale" && "Exhale slowly through your mouth"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cycle {breathingState.cycle} • {breathingState.phase}
                      </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                      {!breathingState.isActive ? (
                        <Button onClick={startBreathing} size="lg" className="gradient-primary">
                          <Play className="h-5 w-5 mr-2" />
                          Start Breathing
                        </Button>
                      ) : (
                        <Button onClick={stopBreathing} variant="outline" size="lg">
                          <Pause className="h-5 w-5 mr-2" />
                          Pause
                        </Button>
                      )}
                      <Button onClick={resetBreathing} variant="outline" size="lg">
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Reset
                      </Button>
                      <Button onClick={() => setActiveExercise(null)} variant="ghost" size="lg">
                        Back to Exercises
                      </Button>
                    </div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            )}

            {activeExercise === "gratitude" && (
              <EnhancedCard variant="glass" className="text-center">
                <EnhancedCardHeader>
                  <EnhancedCardTitle>Gratitude Practice</EnhancedCardTitle>
                  <p className="text-muted-foreground">Focus on three things you're grateful for today</p>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center">
                      <Heart className="h-16 w-16 text-white" />
                    </div>

                    <div className="space-y-4">
                      <div className="text-left">
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          1. Something small that made you smile:
                        </label>
                        <input
                          type="text"
                          value={gratitudeInputs.small}
                          onChange={(e) => setGratitudeInputs((prev) => ({ ...prev, small: e.target.value }))}
                          className="w-full p-3 rounded-lg border border-border bg-background text-foreground"
                          placeholder="A warm cup of coffee, a text from a friend..."
                        />
                      </div>

                      <div className="text-left">
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          2. Someone you appreciate:
                        </label>
                        <input
                          type="text"
                          value={gratitudeInputs.person}
                          onChange={(e) => setGratitudeInputs((prev) => ({ ...prev, person: e.target.value }))}
                          className="w-full p-3 rounded-lg border border-border bg-background text-foreground"
                          placeholder="Family member, friend, colleague..."
                        />
                      </div>

                      <div className="text-left">
                        <label className="block text-sm font-medium mb-2 text-foreground">
                          3. Something about yourself:
                        </label>
                        <input
                          type="text"
                          value={gratitudeInputs.self}
                          onChange={(e) => setGratitudeInputs((prev) => ({ ...prev, self: e.target.value }))}
                          className="w-full p-3 rounded-lg border border-border bg-background text-foreground"
                          placeholder="A strength, achievement, or quality..."
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button onClick={saveGratitude} size="lg" className="gradient-primary">
                        <Heart className="h-5 w-5 mr-2" />
                        Save Gratitude
                      </Button>
                      <Button onClick={() => setActiveExercise(null)} variant="ghost" size="lg">
                        Back to Exercises
                      </Button>
                    </div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            )}

            {activeExercise === "mindfulness" && (
              <EnhancedCard variant="glass" className="text-center">
                <EnhancedCardHeader>
                  <EnhancedCardTitle>Mindful Meditation</EnhancedCardTitle>
                  <p className="text-muted-foreground">Ground yourself in the present moment</p>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-violet-500 flex items-center justify-center relative">
                      <Brain className="h-16 w-16 text-white" />
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                    </div>

                    <div className="space-y-4 text-left max-w-md mx-auto">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-medium mb-2 text-foreground">5-4-3-2-1 Grounding Technique</h4>
                        <ul className="space-y-2 text-sm text-foreground">
                          <li>
                            • <strong>5 things</strong> you can see around you
                          </li>
                          <li>
                            • <strong>4 things</strong> you can touch
                          </li>
                          <li>
                            • <strong>3 things</strong> you can hear
                          </li>
                          <li>
                            • <strong>2 things</strong> you can smell
                          </li>
                          <li>
                            • <strong>1 thing</strong> you can taste
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm text-foreground">
                          Take your time with each step. Notice the details. This helps bring your mind back to the
                          present moment.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button onClick={completeMindfulness} size="lg" className="gradient-primary">
                        <Brain className="h-5 w-5 mr-2" />
                        Complete Practice
                      </Button>
                      <Button onClick={() => setActiveExercise(null)} variant="ghost" size="lg">
                        Back to Exercises
                      </Button>
                    </div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            )}

            {activeExercise === "energy" && (
              <EnhancedCard variant="glass" className="text-center">
                <EnhancedCardHeader>
                  <EnhancedCardTitle>Energy Boost</EnhancedCardTitle>
                  <p className="text-muted-foreground">Quick exercises to lift your mood and energy</p>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <div className="space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                      <Zap className="h-16 w-16 text-white animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50 text-left">
                        <h4 className="font-medium mb-2 text-foreground">🏃‍♀️ Movement Boost</h4>
                        <ul className="space-y-1 text-sm text-foreground">
                          <li>• 10 jumping jacks</li>
                          <li>• 5 deep stretches</li>
                          <li>• Dance to one song</li>
                          <li>• Walk around the block</li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50 text-left">
                        <h4 className="font-medium mb-2 text-foreground">🧠 Mental Boost</h4>
                        <ul className="space-y-1 text-sm text-foreground">
                          <li>• List 3 achievements</li>
                          <li>• Call a friend</li>
                          <li>• Listen to upbeat music</li>
                          <li>• Write positive affirmations</li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50 text-left">
                        <h4 className="font-medium mb-2 text-foreground">💧 Refresh Boost</h4>
                        <ul className="space-y-1 text-sm text-foreground">
                          <li>• Drink a glass of water</li>
                          <li>• Splash cold water on face</li>
                          <li>• Step outside for fresh air</li>
                          <li>• Take 5 deep breaths</li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50 text-left">
                        <h4 className="font-medium mb-2 text-foreground">🎨 Creative Boost</h4>
                        <ul className="space-y-1 text-sm text-foreground">
                          <li>• Doodle for 2 minutes</li>
                          <li>• Write 3 random words</li>
                          <li>• Organize your space</li>
                          <li>• Look at inspiring photos</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button onClick={completeEnergyBoost} size="lg" className="gradient-primary">
                        <Zap className="h-5 w-5 mr-2" />I Did It!
                      </Button>
                      <Button onClick={() => setActiveExercise(null)} variant="ghost" size="lg">
                        Back to Exercises
                      </Button>
                    </div>
                  </div>
                </EnhancedCardContent>
              </EnhancedCard>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
