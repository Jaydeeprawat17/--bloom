"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, MicOff, Volume2, VolumeX, MessageCircle } from "lucide-react"
import { PersonaSelector } from "@/components/persona-selector"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: number
}

interface Persona {
  id: string
  name: string
  avatar: string
  description: string
  systemPrompt: string
}

interface ChatPanelProps {
  selectedPersona: Persona | null
  onPersonaSelect: (persona: Persona) => void
  onCrisisDetected: () => void
}

export function ChatPanel({ selectedPersona, onPersonaSelect, onCrisisDetected }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedPersona && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: getWelcomeMessage(selectedPersona),
        sender: "ai",
        timestamp: Date.now(),
      }
      setMessages([welcomeMessage])
    }
  }, [selectedPersona])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getWelcomeMessage = (persona: Persona) => {
    switch (persona.id) {
      case "asha":
        return "Hello dear, I'm Asha. I'm here to listen with a gentle heart. How are you feeling in this moment?"
      case "kai":
        return "Hey there! I'm Kai, and I'm genuinely excited to chat with you. What's been on your mind lately?"
      case "mira":
        return "Hello, I'm Dr. Mira. I'm here to walk alongside you in your healing journey. What would you like to explore together today?"
      default:
        return "Hello! I'm here to support you. How can I help you today?"
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
      "can't go on",
    ]
    return crisisKeywords.some((keyword) => text.toLowerCase().includes(keyword.toLowerCase()))
  }

  const generateAIResponse = async (userInput: string, persona: Persona): Promise<string> => {
    // Simulate realistic AI response generation
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 2000))

    const inputLower = userInput.toLowerCase()
    const isNegative = ["sad", "depressed", "anxious", "worried", "scared"].some((word) => inputLower.includes(word))
    const isPositive = ["good", "better", "happy", "grateful", "excited"].some((word) => inputLower.includes(word))

    if (persona.id === "asha") {
      if (isNegative) {
        return "I can feel the weight you're carrying right now, and I want you to know that it's okay to feel this way. Your emotions are valid, and you don't have to carry this alone."
      } else if (isPositive) {
        return "Oh, this makes my heart so happy! I can hear the lightness in your words, and it's beautiful. These moments of joy are so precious - let's celebrate this together."
      } else {
        return "I'm listening to every word you're sharing, and I want you to know that your thoughts and feelings matter to me. What else is on your heart right now?"
      }
    } else if (persona.id === "kai") {
      if (isNegative) {
        return "Hey, I hear you're going through a tough time, and I want you to know that reaching out like this? That's actually pretty amazing. You're stronger than you realize."
      } else if (isPositive) {
        return "YES! This is exactly what I love to hear! You're absolutely glowing right now, and it's infectious. Tell me more about what's making you feel this good!"
      } else {
        return "I love your energy! There's something really genuine about how you're sharing this with me. What's been the highlight of your day so far?"
      }
    } else {
      if (isNegative) {
        return "Thank you for sharing something so personal with me. What you're experiencing sounds incredibly challenging. When you notice these feelings arising, what do you typically do to care for yourself?"
      } else if (isPositive) {
        return "It's wonderful to hear you expressing something positive. These moments of lightness are so important for our overall well-being. What do you think contributed to this shift?"
      } else {
        return "I'm listening carefully to what you're sharing. Sometimes our thoughts and feelings don't fit into neat categories, and that's perfectly human. What feels most important for you to be heard about right now?"
      }
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !selectedPersona) return

    if (detectCrisis(content)) {
      onCrisisDetected()
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
      const response = await generateAIResponse(content, selectedPersona)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "ai",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, aiMessage])

      if (voiceEnabled && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(response)
        utterance.rate = 0.9
        speechSynthesis.speak(utterance)
      }
    } catch (error) {
      toast({
        title: "Connection Issue",
        description: "I'm having trouble responding right now. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!selectedPersona) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageCircle className="h-12 w-12 text-bloom-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground">Choose Your Support Companion</h3>
          <p className="text-muted-foreground mb-6">
            Select an AI friend who resonates with you. Each has their own caring personality and voice.
          </p>
          <PersonaSelector onSelect={onPersonaSelect} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{selectedPersona.avatar}</div>
            <div>
              <h3 className="font-semibold text-foreground">{selectedPersona.name}</h3>
              <p className="text-sm text-muted-foreground">Here to support you</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setVoiceEnabled(!voiceEnabled)}>
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onPersonaSelect(null)}>
              Change
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-muted/30">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] p-4 ${message.sender === "user" ? "chat-bubble-user" : "chat-bubble-ai"}`}>
                  <p className="text-sm leading-relaxed text-foreground">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
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
              <div className="chat-bubble-ai max-w-[80%] p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{selectedPersona.name} is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Share what's on your mind with ${selectedPersona.name}...`}
                className="resize-none pr-12"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(input)
                  }
                }}
              />

              <Button
                variant="ghost"
                size="sm"
                className={`absolute right-2 top-2 ${isRecording ? "text-destructive animate-pulse" : ""}`}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>

            <Button
              onClick={() => handleSendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="bg-bloom-primary hover:bg-bloom-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
