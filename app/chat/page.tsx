"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Volume2, VolumeX } from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"
import { useLocalStorage } from "@/hooks/use-local-storage"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const personas = [
  {
    id: "asha",
    name: "Asha",
    description: "A gentle older sister who speaks softly and offers encouragement",
    avatar: "👩🏽‍💼",
    voiceId: "paige",
    systemPrompt:
      "You are Asha, a gentle older sister who speaks softly and offers encouragement. You're warm, understanding, and always ready to listen. Keep responses under 100 words and focus on emotional support.",
  },
  {
    id: "kai",
    name: "Kai",
    description: "An upbeat best friend who uses humor and quick pep-talks",
    avatar: "🧑🏻‍🎨",
    voiceId: "rohan",
    systemPrompt:
      "You are Kai, an upbeat best friend who uses humor and quick pep-talks. You're energetic, optimistic, and love to motivate others. Keep responses under 100 words and include light humor when appropriate.",
  },
  {
    id: "mira",
    name: "Dr. Mira",
    description: "A professional therapist-like coach who provides coping strategies",
    avatar: "👩🏾‍⚕️",
    systemPrompt:
      "You are Dr. Mira, a professional therapist-like coach. Provide coping strategies and gentle guidance. Never make medical claims. Keep responses under 100 words and focus on practical mental health techniques.",
  },
]

export default function ChatPage() {
  const searchParams = useSearchParams()
  const personaFromUrl = searchParams.get("persona")

  const [selectedPersona, setSelectedPersona] = useLocalStorage("selected-persona", null)
  const [isPlaying, setIsPlaying] = useState(false)

  // If there's a persona in URL, use it directly
  useEffect(() => {
    if (personaFromUrl) {
      const persona = personas.find((p) => p.id === personaFromUrl)
      if (persona) {
        setSelectedPersona(persona)
      }
    }
  }, [personaFromUrl, setSelectedPersona])

  const handlePersonaSelect = (persona: (typeof personas)[0]) => {
    setSelectedPersona(persona)
  }

  const playVoicePreview = async (persona: (typeof personas)[0]) => {
    if (isPlaying) return

    setIsPlaying(true)

    try {
      const utterance = new SpeechSynthesisUtterance(`Hi from ${persona.name}`)
      utterance.rate = 0.9
      utterance.pitch = persona.id === "asha" ? 1.1 : persona.id === "kai" ? 1.2 : 1.0

      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Voice preview failed:", error)
      setIsPlaying(false)
    }
  }

  // Show chat interface if persona is selected (either from URL or localStorage)
  if (selectedPersona) {
    return (
      <ChatInterface
        persona={selectedPersona}
        onBack={() => {
          setSelectedPersona(null)
          // Clear URL parameter when going back
          window.history.replaceState({}, "", "/chat")
        }}
      />
    )
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
          <h1 className="text-xl font-semibold text-foreground">Choose Your AI Friend</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <p className="text-muted-foreground text-center mb-8">
            Each friend has their own personality and voice. Choose who you'd like to talk with today.
          </p>

          <div className="grid gap-4">
            {personas.map((persona) => (
              <motion.div key={persona.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card className="p-6 cursor-pointer hover:bg-accent/50 transition-colors border-border">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{persona.avatar}</div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 text-foreground">{persona.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{persona.description}</p>

                      <div className="flex items-center gap-3">
                        <Button onClick={() => handlePersonaSelect(persona)} className="flex-1">
                          Chat with {persona.name}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playVoicePreview(persona)}
                          disabled={isPlaying}
                          className="flex items-center gap-2"
                        >
                          {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          Preview Voice
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
