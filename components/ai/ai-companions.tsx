"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card"
import { Button } from "@/components/ui/button"
import { VoiceWave } from "@/components/ui/voice-wave"
import { MessageCircle, Volume2, Sparkles } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const companions = [
  {
    id: "asha",
    name: "Asha",
    role: "Gentle Sister",
    avatar: "👩🏽‍💼",
    description: "Warm, understanding, and always ready to listen with a gentle heart",
    voiceType: "Soft Female Voice",
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    gender: "female" as const,
  },
  {
    id: "kai",
    name: "Kai",
    role: "Upbeat Friend",
    avatar: "🧑🏻‍🎨",
    description: "Energetic, optimistic, and loves to motivate with humor",
    voiceType: "Energetic Male Voice",
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    gender: "male" as const,
  },
  {
    id: "mira",
    name: "Dr. Mira",
    role: "Professional Coach",
    avatar: "👩🏾‍⚕️",
    description: "Thoughtful guidance and evidence-based coping strategies",
    voiceType: "Professional Female Voice",
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    gender: "female" as const,
  },
]

interface AICompanionsProps {
  onCrisisDetected: () => void
}

// Enhanced voice selection function
const selectVoiceForPersona = (voices: SpeechSynthesisVoice[], companionId: string, gender: "male" | "female") => {
  console.log(`Selecting ${gender} voice for ${companionId} from ${voices.length} available voices`)

  // Filter English voices first
  const englishVoices = voices.filter(
    (voice) => voice.lang.toLowerCase().includes("en") || voice.lang.toLowerCase().startsWith("en-"),
  )

  console.log(
    `Found ${englishVoices.length} English voices:`,
    englishVoices.map((v) => `${v.name} (${v.lang})`),
  )

  if (gender === "female") {
    // Female voice selection with multiple fallbacks
    const femaleVoices = [
      // Primary female voice names (common across platforms)
      ...englishVoices.filter(
        (voice) =>
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("karen") ||
          voice.name.toLowerCase().includes("susan") ||
          voice.name.toLowerCase().includes("victoria") ||
          voice.name.toLowerCase().includes("allison") ||
          voice.name.toLowerCase().includes("helen") ||
          voice.name.toLowerCase().includes("kate") ||
          voice.name.toLowerCase().includes("zira") ||
          voice.name.toLowerCase().includes("hazel") ||
          voice.name.toLowerCase().includes("fiona"),
      ),
      // Generic female indicators
      ...englishVoices.filter(
        (voice) => voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("woman"),
      ),
      // Platform-specific female voices
      ...englishVoices.filter(
        (voice) => voice.name.toLowerCase().includes("google") && voice.name.toLowerCase().includes("female"),
      ),
    ]

    // Remove duplicates
    const uniqueFemaleVoices = femaleVoices.filter(
      (voice, index, self) => index === self.findIndex((v) => v.name === voice.name),
    )

    if (uniqueFemaleVoices.length > 0) {
      // For different female personas, try to use different voices
      if (companionId === "asha") {
        // Prefer softer sounding names for Asha
        const ashaVoice =
          uniqueFemaleVoices.find(
            (voice) =>
              voice.name.toLowerCase().includes("samantha") ||
              voice.name.toLowerCase().includes("allison") ||
              voice.name.toLowerCase().includes("karen"),
          ) || uniqueFemaleVoices[0]
        console.log(`Selected voice for Asha: ${ashaVoice.name}`)
        return ashaVoice
      } else if (companionId === "mira") {
        // Prefer more professional sounding names for Mira
        const miraVoice =
          uniqueFemaleVoices.find(
            (voice) =>
              voice.name.toLowerCase().includes("helen") ||
              voice.name.toLowerCase().includes("kate") ||
              voice.name.toLowerCase().includes("victoria") ||
              voice.name.toLowerCase().includes("zira"),
          ) || uniqueFemaleVoices[uniqueFemaleVoices.length > 1 ? 1 : 0]
        console.log(`Selected voice for Mira: ${miraVoice.name}`)
        return miraVoice
      }
    }
  } else if (gender === "male") {
    // Male voice selection with multiple fallbacks
    const maleVoices = [
      // Primary male voice names (common across platforms)
      ...englishVoices.filter(
        (voice) =>
          voice.name.toLowerCase().includes("daniel") ||
          voice.name.toLowerCase().includes("alex") ||
          voice.name.toLowerCase().includes("tom") ||
          voice.name.toLowerCase().includes("david") ||
          voice.name.toLowerCase().includes("fred") ||
          voice.name.toLowerCase().includes("james") ||
          voice.name.toLowerCase().includes("mark") ||
          voice.name.toLowerCase().includes("paul") ||
          voice.name.toLowerCase().includes("richard") ||
          voice.name.toLowerCase().includes("oliver"),
      ),
      // Generic male indicators
      ...englishVoices.filter(
        (voice) => voice.name.toLowerCase().includes("male") || voice.name.toLowerCase().includes("man"),
      ),
      // Platform-specific male voices
      ...englishVoices.filter(
        (voice) => voice.name.toLowerCase().includes("google") && voice.name.toLowerCase().includes("male"),
      ),
    ]

    // Remove duplicates
    const uniqueMaleVoices = maleVoices.filter(
      (voice, index, self) => index === self.findIndex((v) => v.name === voice.name),
    )

    if (uniqueMaleVoices.length > 0) {
      console.log(`Selected male voice for ${companionId}: ${uniqueMaleVoices[0].name}`)
      return uniqueMaleVoices[0]
    }
  }

  // Final fallback - just use any English voice
  const fallbackVoice = englishVoices[0] || voices[0]
  console.log(`Using fallback voice: ${fallbackVoice?.name || "default"}`)
  return fallbackVoice
}

export function AICompanions({ onCrisisDetected }: AICompanionsProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const { toast } = useToast()

  const playVoicePreview = async (companionId: string) => {
    // Check if speech synthesis is supported
    if (!("speechSynthesis" in window)) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive",
      })
      return
    }

    // Stop any currently playing speech
    try {
      speechSynthesis.cancel()
    } catch (e) {
      console.log("Could not cancel speech synthesis")
    }

    setPlayingVoice(companionId)

    try {
      // Wait for voices to load
      const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
        return new Promise((resolve) => {
          let voices = speechSynthesis.getVoices()
          if (voices.length > 0) {
            resolve(voices)
          } else {
            const handleVoicesChanged = () => {
              voices = speechSynthesis.getVoices()
              if (voices.length > 0) {
                speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged)
                resolve(voices)
              }
            }
            speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged)

            // Timeout after 2 seconds
            setTimeout(() => {
              speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged)
              resolve(speechSynthesis.getVoices())
            }, 2000)
          }
        })
      }

      const voices = await loadVoices()
      console.log(`Total voices available: ${voices.length}`)

      const companion = companions.find((c) => c.id === companionId)
      if (!companion) {
        throw new Error("Companion not found")
      }

      const text = `Hi! I'm ${companion.name}. I'm here to support you on your journey.`
      const utterance = new SpeechSynthesisUtterance(text)

      // Set basic properties
      utterance.volume = 0.9
      utterance.lang = "en-US"

      // Select appropriate voice based on gender
      const selectedVoice = selectVoiceForPersona(voices, companionId, companion.gender)
      if (selectedVoice) {
        utterance.voice = selectedVoice
        console.log(`Using voice: ${selectedVoice.name} for ${companion.name}`)
      }

      // Apply persona-specific settings
      switch (companionId) {
        case "asha":
          utterance.pitch = 1.4 // Higher, gentler pitch
          utterance.rate = 0.6 // Slower, more calming
          break

        case "kai":
          utterance.pitch = 0.7 // Lower, more masculine pitch
          utterance.rate = 0.8 // Moderate pace, energetic
          break

        case "mira":
          utterance.pitch = 1.1 // Professional female pitch
          utterance.rate = 0.65 // Measured, thoughtful pace
          break
      }

      // Set up event handlers with timeout
      const timeout = setTimeout(() => {
        console.log("Voice preview timeout")
        setPlayingVoice(null)
        speechSynthesis.cancel()
      }, 8000)

      utterance.onstart = () => {
        console.log(`Voice preview started for ${companionId}`)
      }

      utterance.onend = () => {
        console.log(`Voice preview ended for ${companionId}`)
        clearTimeout(timeout)
        setPlayingVoice(null)
      }

      utterance.onerror = (event) => {
        console.error("Voice preview error:", event)
        clearTimeout(timeout)
        setPlayingVoice(null)
        toast({
          title: "Voice preview unavailable",
          description: "Voice preview isn't working right now, but chat voices will still work!",
        })
      }

      console.log(`Starting voice preview for ${companionId}:`, {
        voice: utterance.voice?.name || "default",
        gender: companion.gender,
        pitch: utterance.pitch,
        rate: utterance.rate,
        text: text,
      })

      // Speak the utterance
      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Voice preview setup failed:", error)
      setPlayingVoice(null)
      toast({
        title: "Voice preview error",
        description: "Something went wrong with the voice preview.",
        variant: "destructive",
      })
    }
  }

  return (
    <EnhancedCard variant="glass">
      <EnhancedCardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-bloom-primary/20">
            <MessageCircle className="h-6 w-6 text-bloom-primary" />
          </div>
          <div>
            <EnhancedCardTitle>AI Companions</EnhancedCardTitle>
            <p className="text-muted-foreground">Choose your support companion</p>
          </div>
        </div>
      </EnhancedCardHeader>

      <EnhancedCardContent>
        <div className="grid gap-4">
          {companions.map((companion, index) => (
            <motion.div
              key={companion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EnhancedCard variant="default" interactive className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl ${companion.bgColor} flex items-center justify-center text-2xl relative overflow-hidden`}
                  >
                    <span>{companion.avatar}</span>
                    {playingVoice === companion.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: [-100, 100] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{companion.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${companion.color} text-white`}>
                        {companion.role}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{companion.description}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <Volume2 className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{companion.voiceType}</span>
                      <VoiceWave
                        isActive={playingVoice === companion.id}
                        persona={companion.id as "asha" | "kai" | "mira"}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/chat?persona=${companion.id}`} className="flex-1">
                        <Button className="w-full" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat Now
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => playVoicePreview(companion.id)}
                        disabled={playingVoice !== null}
                        className={playingVoice === companion.id ? "animate-pulse bg-blue-50 dark:bg-blue-950/20" : ""}
                      >
                        <Volume2 className="h-4 w-4" />
                        <span className="ml-1 text-xs">
                          {playingVoice === companion.id ? "Playing..." : playingVoice ? "Wait..." : "Preview"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </EnhancedCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-bloom-primary/10 to-bloom-secondary/10 border border-bloom-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-bloom-primary" />
            <span className="text-sm font-medium text-foreground">Smart Voice Matching</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Each companion automatically gets a matching voice - female voices for Asha & Dr. Mira, male voice for Kai.
            Completely free using your device's built-in voices!
          </p>
        </div>
      </EnhancedCardContent>
    </EnhancedCard>
  )
}
