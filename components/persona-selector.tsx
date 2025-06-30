"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2 } from "lucide-react"

const personas = [
  {
    id: "asha",
    name: "Asha",
    avatar: "👩🏽‍💼",
    description: "A gentle older sister who speaks softly and offers warm encouragement",
    systemPrompt: "You are Asha, a gentle older sister who speaks softly and offers encouragement.",
  },
  {
    id: "kai",
    name: "Kai",
    avatar: "🧑🏻‍🎨",
    description: "An upbeat best friend who uses humor and motivational pep-talks",
    systemPrompt: "You are Kai, an upbeat best friend who uses humor and quick pep-talks.",
  },
  {
    id: "mira",
    name: "Dr. Mira",
    avatar: "👩🏾‍⚕️",
    description: "A professional therapist-like coach who provides thoughtful coping strategies",
    systemPrompt: "You are Dr. Mira, a professional therapist-like coach.",
  },
]

interface PersonaSelectorProps {
  onSelect: (persona: (typeof personas)[0]) => void
}

export function PersonaSelector({ onSelect }: PersonaSelectorProps) {
  const playVoicePreview = async (persona: (typeof personas)[0]) => {
    if (!("speechSynthesis" in window)) return

    // Wait for voices to load
    const loadVoices = () => {
      return new Promise<SpeechSynthesisVoice[]>((resolve) => {
        let voices = speechSynthesis.getVoices()
        if (voices.length > 0) {
          resolve(voices)
        } else {
          speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices()
            resolve(voices)
          }
        }
      })
    }

    const voices = await loadVoices()
    const utterance = new SpeechSynthesisUtterance(`Hi, I'm ${persona.name}. I'm here to support you.`)

    // Apply the same voice settings as in chat
    switch (persona.id) {
      case "asha":
        utterance.pitch = 1.4
        utterance.rate = 0.6
        utterance.volume = 0.8

        const ashaVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("karen") ||
            voice.name.toLowerCase().includes("victoria") ||
            voice.name.toLowerCase().includes("susan") ||
            voice.name.toLowerCase().includes("allison") ||
            (voice.name.toLowerCase().includes("female") && voice.lang.includes("en")),
        )
        if (ashaVoice) utterance.voice = ashaVoice
        break

      case "kai":
        utterance.pitch = 0.7
        utterance.rate = 0.8
        utterance.volume = 1.0

        const kaiVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("daniel") ||
            voice.name.toLowerCase().includes("alex") ||
            voice.name.toLowerCase().includes("tom") ||
            voice.name.toLowerCase().includes("david") ||
            voice.name.toLowerCase().includes("fred") ||
            (voice.name.toLowerCase().includes("male") && voice.lang.includes("en")),
        )
        if (kaiVoice) utterance.voice = kaiVoice
        break

      case "mira":
        utterance.pitch = 1.1
        utterance.rate = 0.65
        utterance.volume = 0.9

        const miraVoice =
          voices.find(
            (voice) =>
              voice.name.toLowerCase().includes("helen") ||
              voice.name.toLowerCase().includes("kate") ||
              voice.name.toLowerCase().includes("zira") ||
              voice.name.toLowerCase().includes("hazel") ||
              voice.name.toLowerCase().includes("fiona") ||
              (voice.name.toLowerCase().includes("female") &&
                voice.lang.includes("en") &&
                !voice.name.toLowerCase().includes("samantha")),
          ) || voices.find((voice) => voice.name.toLowerCase().includes("female") && voice.lang.includes("en"))
        if (miraVoice) utterance.voice = miraVoice
        break
    }

    speechSynthesis.speak(utterance)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {personas.map((persona, index) => (
        <motion.div
          key={persona.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">{persona.avatar}</div>
              <h3 className="font-semibold text-lg mb-2">{persona.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{persona.description}</p>

              <div className="space-y-2">
                <Button onClick={() => onSelect(persona)} className="w-full bg-bloom-primary hover:bg-bloom-primary/90">
                  Chat with {persona.name}
                </Button>

                <Button variant="ghost" size="sm" onClick={() => playVoicePreview(persona)} className="w-full">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Preview Voice
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
