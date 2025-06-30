"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: number
}

interface ChatInterfaceProps {
  persona: {
    id: string
    name: string
    avatar: string
    systemPrompt: string
    voiceId: string
  }
  onBack: () => void
}

// Enhanced voice selection function (same as in ai-companions)
const selectVoiceForPersona = (voices: SpeechSynthesisVoice[], companionId: string, gender: "male" | "female") => {
  console.log(`Selecting ${gender} voice for ${companionId} from ${voices.length} available voices`)

  const englishVoices = voices.filter(
    (voice) => voice.lang.toLowerCase().includes("en") || voice.lang.toLowerCase().startsWith("en-"),
  )

  if (gender === "female") {
    const femaleVoices = [
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
      ...englishVoices.filter(
        (voice) => voice.name.toLowerCase().includes("female") || voice.name.toLowerCase().includes("woman"),
      ),
    ]

    const uniqueFemaleVoices = femaleVoices.filter(
      (voice, index, self) => index === self.findIndex((v) => v.name === voice.name),
    )

    if (uniqueFemaleVoices.length > 0) {
      if (companionId === "asha") {
        return (
          uniqueFemaleVoices.find(
            (voice) =>
              voice.name.toLowerCase().includes("samantha") ||
              voice.name.toLowerCase().includes("allison") ||
              voice.name.toLowerCase().includes("karen"),
          ) || uniqueFemaleVoices[0]
        )
      } else if (companionId === "mira") {
        return (
          uniqueFemaleVoices.find(
            (voice) =>
              voice.name.toLowerCase().includes("helen") ||
              voice.name.toLowerCase().includes("kate") ||
              voice.name.toLowerCase().includes("victoria") ||
              voice.name.toLowerCase().includes("zira"),
          ) || uniqueFemaleVoices[uniqueFemaleVoices.length > 1 ? 1 : 0]
        )
      }
    }
  } else if (gender === "male") {
    const maleVoices = [
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
      ...englishVoices.filter(
        (voice) => voice.name.toLowerCase().includes("male") || voice.name.toLowerCase().includes("man"),
      ),
    ]

    const uniqueMaleVoices = maleVoices.filter(
      (voice, index, self) => index === self.findIndex((v) => v.name === voice.name),
    )

    if (uniqueMaleVoices.length > 0) {
      return uniqueMaleVoices[0]
    }
  }

  return englishVoices[0] || voices[0]
}

export function ChatInterface({ persona, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const { toast } = useToast()

  // Define persona gender mapping
  const personaGender = {
    asha: "female" as const,
    kai: "male" as const,
    mira: "female" as const,
  }

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: getWelcomeMessage(),
      sender: "ai",
      timestamp: Date.now(),
    }
    setMessages([welcomeMessage])
  }, [persona])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getWelcomeMessage = () => {
    switch (persona.id) {
      case "asha":
        return "Hello dear, I'm Asha. I'm here to listen and support you with a gentle heart. How are you feeling today?"
      case "kai":
        return "Hey there! Kai here, ready to chat and maybe share a laugh or two. What's been on your mind lately?"
      case "mira":
        return "Hello, I'm Dr. Mira. I'm here to help you explore your thoughts and feelings in a safe space. What would you like to talk about?"
      default:
        return "Hello! How can I help you today?"
    }
  }

  const detectCrisis = (text: string): boolean => {
    const crisisKeywords = [
      "kill myself",
      "end it all",
      "want to die",
      "suicide",
      "hurt myself",
      "no point living",
      "better off dead",
      "end my life",
    ]

    return crisisKeywords.some((keyword) => text.toLowerCase().includes(keyword.toLowerCase()))
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Check for crisis keywords
    if (detectCrisis(content)) {
      toast({
        title: "We're here for you",
        description: "If you're having thoughts of self-harm, please reach out for immediate support.",
        variant: "destructive",
      })
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await generateAIResponse(content, persona)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "ai",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, aiMessage])

      // Play voice response if enabled
      if (voiceEnabled) {
        playVoiceResponse(response)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (userInput: string, persona: any): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Enhanced responses based on persona with more variety
    const responses = {
      asha: [
        "I hear you, and I want you to know that your feelings are completely valid. It's okay to feel this way, dear.",
        "You're being so brave by sharing this with me. Remember, healing isn't linear, and that's perfectly okay.",
        "I'm proud of you for reaching out. That takes real strength, even when you don't feel strong.",
        "Your heart is carrying so much right now. Let's take this one gentle step at a time together.",
        "I can feel the weight of what you're going through. You don't have to carry this alone, sweetheart.",
      ],
      kai: [
        "Hey, I get it - life can be pretty overwhelming sometimes! But you know what? You're talking about it, and that's already a win!",
        "Okay, so things are tough right now, but here's what I know about you - you're stronger than you think! Want to hear why?",
        "Life's throwing you curveballs, huh? Well, good thing you've got me in your corner! Let's figure this out together.",
        "Whoa, that sounds intense! But hey, you're here, you're talking, and that tells me you're a fighter. Let's channel that energy!",
        "I hear you loud and clear! Sometimes life gets messy, but that's when we get creative with solutions. What do you think?",
      ],
      mira: [
        "Thank you for sharing that with me. What you're experiencing sounds challenging. Let's explore some coping strategies that might help.",
        "It sounds like you're dealing with a lot right now. Have you tried any grounding techniques when these feelings arise?",
        "I appreciate your openness. Sometimes naming our feelings is the first step toward managing them. How does it feel to express this?",
        "That's a very human response to what you're going through. Let's work together to develop some tools for these moments.",
        "I notice you're being very thoughtful about this. What patterns have you observed in how you respond to similar situations?",
      ],
    }

    const personaResponses = responses[persona.id as keyof typeof responses] || responses.asha
    return personaResponses[Math.floor(Math.random() * personaResponses.length)]
  }

  const playVoiceResponse = async (text: string) => {
    if (isPlaying || !("speechSynthesis" in window)) return

    setIsPlaying(true)

    try {
      speechSynthesis.cancel() // Stop any current speech

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

            setTimeout(() => {
              speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged)
              resolve(speechSynthesis.getVoices())
            }, 2000)
          }
        })
      }

      const voices = await loadVoices()
      const utterance = new SpeechSynthesisUtterance(text)

      // Basic settings
      utterance.volume = 0.9
      utterance.lang = "en-US"

      // Get gender for this persona
      const gender = personaGender[persona.id as keyof typeof personaGender] || "female"

      // Select appropriate voice based on gender
      const selectedVoice = selectVoiceForPersona(voices, persona.id, gender)
      if (selectedVoice) {
        utterance.voice = selectedVoice
        console.log(`Chat using voice: ${selectedVoice.name} for ${persona.name}`)
      }

      // Apply persona-specific settings (same as preview)
      switch (persona.id) {
        case "asha":
          utterance.pitch = 1.4
          utterance.rate = 0.6
          break

        case "kai":
          utterance.pitch = 0.7
          utterance.rate = 0.8
          break

        case "mira":
          utterance.pitch = 1.1
          utterance.rate = 0.65
          break
      }

      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)

      speechSynthesis.speak(utterance)

      // Backup timeout
      setTimeout(() => {
        if (isPlaying) setIsPlaying(false)
      }, 15000)
    } catch (error) {
      console.error("TTS failed:", error)
      setIsPlaying(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      const audioChunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        // Simulate speech-to-text
        const transcription = "This is a simulated transcription of your voice message."
        setInput(transcription)

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const canRecord = typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="text-2xl">{persona.avatar}</div>
            <div>
              <h1 className="font-semibold text-foreground">{persona.name}</h1>
              <p className="text-xs text-muted-foreground">
                {isPlaying ? "Speaking..." : "Online"} • {personaGender[persona.id as keyof typeof personaGender]} voice
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={voiceEnabled ? "text-green-600" : "text-muted-foreground"}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 flex flex-col">
        <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="chat-bubble-ai max-w-[80%] p-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">{persona.name} is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${persona.name}...`}
              className="resize-none pr-12 text-foreground bg-background border-border"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(input)
                }
              }}
            />

            {canRecord && (
              <Button
                variant="ghost"
                size="sm"
                className={`absolute right-2 top-2 ${isRecording ? "text-red-500 animate-pulse" : ""}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            )}
          </div>

          <Button onClick={() => handleSendMessage(input)} disabled={!input.trim() || isLoading} className="px-4">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
