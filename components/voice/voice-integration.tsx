"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Voice API Integration Options
const voiceProviders = [
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    description: "Premium AI voices with emotional range",
    voices: {
      asha: "Rachel - Calm, nurturing female voice",
      kai: "Josh - Energetic, friendly male voice",
      mira: "Bella - Professional, clear female voice",
    },
    setup: "Requires ElevenLabs API key",
    quality: "Excellent",
    cost: "$5-22/month",
  },
  {
    id: "vapi",
    name: "Vapi",
    description: "Real-time voice AI for conversations",
    voices: {
      asha: "Nova - Gentle, empathetic voice",
      kai: "Alloy - Upbeat, motivational voice",
      mira: "Echo - Professional, therapeutic voice",
    },
    setup: "Requires Vapi API integration",
    quality: "Excellent",
    cost: "$0.05-0.15/minute",
  },
  {
    id: "openai",
    name: "OpenAI TTS",
    description: "High-quality text-to-speech",
    voices: {
      asha: "Nova - Warm, caring voice",
      kai: "Onyx - Energetic male voice",
      mira: "Shimmer - Professional female voice",
    },
    setup: "Requires OpenAI API key",
    quality: "Very Good",
    cost: "$15/1M characters",
  },
  {
    id: "azure",
    name: "Azure Speech",
    description: "Microsoft's neural voices",
    voices: {
      asha: "Jenny - Gentle, supportive voice",
      kai: "Guy - Enthusiastic male voice",
      mira: "Aria - Professional, clear voice",
    },
    setup: "Requires Azure subscription",
    quality: "Very Good",
    cost: "$1-16/1M characters",
  },
]

interface VoiceIntegrationProps {
  onProviderSelect: (provider: string) => void
}

export function VoiceIntegration({ onProviderSelect }: VoiceIntegrationProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const { toast } = useToast()

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId)
    onProviderSelect(providerId)

    toast({
      title: "Voice Provider Selected! 🎙️",
      description: `${voiceProviders.find((p) => p.id === providerId)?.name} will be used for AI voices.`,
    })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Upgrade Voice Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            For truly distinct and high-quality AI voices, consider integrating a premium voice provider:
          </p>

          <div className="grid gap-4">
            {voiceProviders.map((provider) => (
              <Card
                key={provider.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedProvider === provider.id ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20" : ""
                }`}
                onClick={() => handleProviderSelect(provider.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{provider.name}</h4>
                      <p className="text-sm text-muted-foreground">{provider.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-green-600 dark:text-green-400">{provider.quality}</div>
                      <div className="text-xs text-muted-foreground">{provider.cost}</div>
                    </div>
                  </div>

                  <div className="space-y-1 mb-3">
                    <div className="text-xs font-medium text-foreground">Voice Assignments:</div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>👩🏽‍💼 Asha: {provider.voices.asha}</div>
                      <div>🧑🏻‍🎨 Kai: {provider.voices.kai}</div>
                      <div>👩🏾‍⚕️ Mira: {provider.voices.mira}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{provider.setup}</span>
                    <Button size="sm" variant={selectedProvider === provider.id ? "default" : "outline"}>
                      {selectedProvider === provider.id ? "Selected" : "Select"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Implementation Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-foreground mb-2">🚀 Quick Setup (Recommended: ElevenLabs)</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Sign up at elevenlabs.io</li>
                <li>Get your API key from the dashboard</li>
                <li>Add ELEVENLABS_API_KEY to your environment variables</li>
                <li>
                  Install the ElevenLabs SDK: <code className="bg-muted px-1 rounded">npm install elevenlabs</code>
                </li>
                <li>Update the voice functions to use ElevenLabs API</li>
              </ol>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">💡 Alternative: Vapi Integration</h4>
              <p className="text-muted-foreground">
                For real-time voice conversations, Vapi provides excellent voice AI with low latency. Perfect for
                interactive chat experiences.
              </p>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Premium voice providers require API keys and have usage costs. The current
                browser voices are free but limited in quality and distinctiveness.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
